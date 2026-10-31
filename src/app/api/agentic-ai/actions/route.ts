import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET() {
  try {
    let rawLogs: any[] = [];
    if ((prisma as any).agentLog) {
      rawLogs = await (prisma as any).agentLog.findMany({
        where: { metadata: { not: null } },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    } else {
      rawLogs = await prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM "AgentLog" WHERE "metadata" IS NOT NULL ORDER BY "createdAt" DESC LIMIT 50`
      );
    }

    const pendingActions: any[] = [];

    for (const log of rawLogs) {
      try {
        if (!log.metadata) continue;
        const meta = typeof log.metadata === "string" ? JSON.parse(log.metadata) : log.metadata;
        const actions = meta?.pendingActions || [];
        for (const act of actions) {
          pendingActions.push({
            ...act,
            logId: log.id,
            agentName: log.agentName,
            division: log.division,
            logCreatedAt: log.createdAt,
          });
        }
      } catch {}
    }

    return NextResponse.json({
      success: true,
      totalPending: pendingActions.filter((a) => a.status === "REQUIRE_APPROVAL").length,
      actions: pendingActions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memuat daftar aksi persetujuan." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actionId, decision, notes } = body;

    if (!actionId || !["APPROVE", "REJECT"].includes(decision)) {
      return NextResponse.json(
        { success: false, error: "actionId dan decision ('APPROVE' / 'REJECT') wajib diisi." },
        { status: 400 }
      );
    }

    let rawLogs: any[] = [];
    if ((prisma as any).agentLog) {
      rawLogs = await (prisma as any).agentLog.findMany({
        where: { metadata: { contains: actionId } },
        take: 5,
      });
    } else {
      rawLogs = await prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM "AgentLog" WHERE "metadata" LIKE $1 LIMIT 5`,
        `%${actionId}%`
      );
    }

    if (!rawLogs || rawLogs.length === 0) {
      return NextResponse.json(
        { success: false, error: `Aksi dengan ID "${actionId}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    const targetLog = rawLogs[0];
    const meta = typeof targetLog.metadata === "string" ? JSON.parse(targetLog.metadata) : targetLog.metadata;
    let actionFound = false;
    let approvedAction: any = null;

    if (Array.isArray(meta.pendingActions)) {
      meta.pendingActions = meta.pendingActions.map((act: any) => {
        if (act.id === actionId) {
          actionFound = true;
          approvedAction = act;
          return {
            ...act,
            status: decision === "APPROVE" ? "APPROVED" : "REJECTED",
            decisionNotes: notes || null,
            resolvedAt: new Date().toISOString(),
          };
        }
        return act;
      });
    }

    if (!actionFound) {
      return NextResponse.json(
        { success: false, error: `Action ID "${actionId}" tidak ada dalam metadata log.` },
        { status: 404 }
      );
    }

    let committedRecordId: string | null = null;
    let commitMessage = "";

    // Auto-commit to ERP database if approved
    if (decision === "APPROVE" && approvedAction?.toolName === "propose_draft_order") {
      try {
        const payload = approvedAction.payload || {};
        let customer = await prisma.customer.findFirst({
          where: {
            storeName: { contains: payload.customerName || "", mode: "insensitive" },
          },
        });

        if (!customer && payload.customerName) {
          customer = await prisma.customer.create({
            data: {
              storeName: payload.customerName,
              notes: "Dibuat otomatis oleh Autonomous AI Agent (Approved)",
            },
          });
        }

        const product = await prisma.product.findFirst({
          where: {
            OR: [
              { name: { contains: payload.productCodeOrName || "", mode: "insensitive" } },
              { code: { contains: payload.productCodeOrName || "", mode: "insensitive" } },
            ],
          },
        });

        if (customer && product) {
          const firstUser = await prisma.user.findFirst();
          const userId = firstUser?.id;

          if (userId) {
            const { decimal, recomputeProductLedger } = await import("../../../../lib/majun-domain");
            const qty = Number(payload.quantityKg || 0);
            const price = Number(payload.pricePerKg || 0);
            const subtotal = qty * price;

            const sale = await prisma.$transaction(async (tx) => {
              const created = await tx.sale.create({
                data: {
                  customerId: customer.id,
                  productId: product.id,
                  saleDate: new Date(),
                  quantityKg: decimal(qty),
                  sellingPricePerKg: decimal(price),
                  subtotal: decimal(subtotal),
                  deliveryExpense: decimal(0),
                  additionalExpense: decimal(0),
                  totalTransactionValue: decimal(subtotal),
                  amountPaid: decimal(0),
                  outstandingAmount: decimal(subtotal),
                  notes: `${payload.notes || "Draft order AI"} [Approved Action ${actionId}]`,
                  createdById: userId,
                },
              });

              await tx.inventoryMovement.create({
                data: {
                  productId: product.id,
                  saleId: created.id,
                  occurredAt: new Date(),
                  movementType: "OUTBOUND",
                  quantityKg: decimal(qty),
                  notes: `Penjualan AI Agent [Approved Action ${actionId}]`,
                },
              });

              await recomputeProductLedger(tx, product.id);
              return created;
            });

            committedRecordId = sale.id;
            commitMessage = `Draf pesanan resmi dibukukan ke tabel Sale (ID: ${sale.id}) dan kartu stok terpotong ${qty} kg.`;

            // Update action metadata with committed sale id
            meta.pendingActions = meta.pendingActions.map((act: any) =>
              act.id === actionId
                ? { ...act, committedSaleId: sale.id, commitMessage }
                : act
            );
          }
        }
      } catch (commitErr: any) {
        console.error("Gagal auto-commit sale dari agent action:", commitErr);
        commitMessage = `Aksi disetujui, namun auto-commit DB gagal: ${commitErr?.message || String(commitErr)}`;
      }
    }

    const updatedMetadata = JSON.stringify(meta);

    if ((prisma as any).agentLog) {
      await (prisma as any).agentLog.update({
        where: { id: targetLog.id },
        data: { metadata: updatedMetadata },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE "AgentLog" SET "metadata" = $1 WHERE "id" = $2`,
        updatedMetadata,
        targetLog.id
      );
    }

    return NextResponse.json({
      success: true,
      message: `Aksi ${actionId} berhasil diperbarui menjadi ${decision === "APPROVE" ? "APPROVED" : "REJECTED"}.${commitMessage ? " " + commitMessage : ""}`,
      actionId,
      status: decision === "APPROVE" ? "APPROVED" : "REJECTED",
      committedRecordId,
      commitMessage,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memproses persetujuan aksi." },
      { status: 500 }
    );
  }
}
