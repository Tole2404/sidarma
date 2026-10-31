import { prisma } from "../db";
import * as fs from "fs";
import * as path from "path";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface PendingAction {
  id: string;
  toolName: string;
  agentId: string;
  status: "REQUIRE_APPROVAL" | "APPROVED" | "REJECTED";
  payload: Record<string, any>;
  reason: string;
  createdAt: string;
}

export const ERP_TOOL_DEFINITIONS: { type: "function"; function: ToolDefinition }[] = [
  {
    type: "function",
    function: {
      name: "get_inventory_stock",
      description: "Ambil data stok riil produk kain majun dan HPP rata-rata dari database PostgreSQL.",
      parameters: {
        type: "object",
        properties: {
          productNameOrCode: { type: "string", description: "Filter nama atau kode produk (opsional)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_bale_market_prices",
      description: "Ambil daftar harga pasaran bal limbah kain majun (Putih/Warna, Grade A1/B2/C3).",
      parameters: {
        type: "object",
        properties: {
          clothType: { type: "string", enum: ["PUTIH", "WARNA"], description: "Tipe kain bal" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_sales_history_and_debts",
      description: "Ambil ringkasan riwayat penjualan, omzet, dan piutang pelanggan (UNPAID/PARTIAL).",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Batas jumlah data (default: 5)" },
          onlyUnpaid: { type: "boolean", description: "Hanya tampilkan piutang belum lunas" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_bongkaran_rendemen",
      description: "Ambil data historis bongkaran bal limbah konveksi, efektivitas rendemen sortir kain putih, warna, dan susut/waste.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Jumlah partai bongkaran (default: 3)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_draft_order",
      description: "Ajukan draf pesanan penjualan (Sales Order). Operasi berstatus REQUIRE_APPROVAL untuk persetujuan admin.",
      parameters: {
        type: "object",
        properties: {
          customerName: { type: "string", description: "Nama pelanggan atau toko target" },
          productCodeOrName: { type: "string", description: "Kode atau nama produk majun" },
          quantityKg: { type: "number", description: "Jumlah dalam kilogram" },
          pricePerKg: { type: "number", description: "Harga penawaran per kg" },
          notes: { type: "string", description: "Catatan tempo pembayaran atau pengiriman" },
        },
        required: ["customerName", "productCodeOrName", "quantityKg", "pricePerKg"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "flag_audit_anomaly",
      description: "Catat temuan anomali bisnis (stok minus, rendemen limbah > 20%, piutang macet) ke audit sentinel.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "Kategori anomali (INVENTORY | FINANCE | SUPPLY | OPERATIONAL)" },
          severity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
          details: { type: "string", description: "Penjelasan lengkap temuan dan rekomendasi mitigasi" },
        },
        required: ["category", "severity", "details"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_image",
      description: "Generate gambar/foto fisik dari prompt teks secara gratis menggunakan Pollinations AI (Flux Model). Berkas gambar otomatis disimpan ke server dan dapat ditampilkan di markdown.",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Prompt visual detail dalam bahasa Inggris (fotorealistik, pencahayaan, subjek kain majun/pabrik)" },
          width: { type: "number", description: "Lebar gambar pixel (default: 1024)" },
          height: { type: "number", description: "Tinggi gambar pixel (default: 1024)" },
          model: { type: "string", enum: ["flux", "turbo"], description: "Model AI: 'flux' (ultra-realistis) atau 'turbo' (cepat)" },
        },
        required: ["prompt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delegate_task_to_agent",
      description: "Delegasikan sub-analisis ke agen spesialis lain dalam divisi darmin (Multi-Agent Orchestration).",
      parameters: {
        type: "object",
        properties: {
          targetAgentId: { type: "string", description: "ID agen tujuan (contoh: quotation-drafter, bale-scorer, audit-sentinel)" },
          taskPrompt: { type: "string", description: "Tugas spesifik yang harus dianalisis oleh agen target" },
        },
        required: ["targetAgentId", "taskPrompt"],
      },
    },
  },
];

export async function executeErpTool(
  toolName: string,
  args: Record<string, any>,
  currentAgentId: string
): Promise<{ result: any; requireApproval?: PendingAction }> {
  switch (toolName) {
    case "get_inventory_stock": {
      const filter = args.productNameOrCode
        ? {
            OR: [
              { name: { contains: args.productNameOrCode, mode: "insensitive" as const } },
              { code: { contains: args.productNameOrCode, mode: "insensitive" as const } },
            ],
          }
        : {};
      const products = await prisma.product.findMany({
        where: filter,
        select: { id: true, code: true, name: true, currentStockKg: true, averageCostPerKg: true, isActive: true },
        take: 10,
      });
      return {
        result: products.map((p) => ({
          code: p.code,
          name: p.name,
          stockKg: Number(p.currentStockKg),
          avgCostPerKg: Number(p.averageCostPerKg),
          status: Number(p.currentStockKg) <= 100 ? "CRITICAL_LOW" : "AVAILABLE",
        })),
      };
    }

    case "get_bale_market_prices": {
      const where = args.clothType ? { clothType: args.clothType } : {};
      const prices = await prisma.balePrice.findMany({
        where: where as any,
        orderBy: { createdAt: "desc" },
        take: 6,
      });
      return {
        result: prices.map((bp) => ({
          id: bp.id,
          clothType: bp.clothType,
          grade: bp.grade,
          pricePerBal: Number(bp.pricePerBal),
          notes: bp.notes,
        })),
      };
    }

    case "get_sales_history_and_debts": {
      const where = args.onlyUnpaid ? { paymentStatus: { in: ["UNPAID" as const, "PARTIAL" as const] } } : {};
      const sales = await prisma.sale.findMany({
        where,
        take: args.limit || 5,
        orderBy: { saleDate: "desc" },
        include: { customer: { select: { storeName: true } }, product: { select: { name: true } } },
      });
      return {
        result: sales.map((s) => ({
          saleId: s.id,
          date: s.saleDate.toISOString().split("T")[0],
          customer: s.customer.storeName,
          product: s.product.name,
          quantityKg: Number(s.quantityKg),
          total: Number(s.totalTransactionValue),
          outstanding: Number(s.outstandingAmount),
          status: s.paymentStatus,
        })),
      };
    }

    case "get_bongkaran_rendemen": {
      const bongkarans = await prisma.bongkaran.findMany({
        take: args.limit || 3,
        orderBy: { purchaseDate: "desc" },
        include: { konveksi: { select: { name: true } }, sorts: true },
      });
      return {
        result: bongkarans.map((b) => {
          const totalInput = Number(b.quantityKg);
          const sorts = b.sorts || [];
          const putihKg = sorts.reduce((sum, s) => sum + Number(s.outputPutihKg), 0);
          const warnaKg = sorts.reduce((sum, s) => sum + Number(s.outputWarnaKg), 0);
          const wasteKg = sorts.reduce((sum, s) => sum + Number(s.wasteKg), 0);
          const wastePercent = totalInput > 0 ? ((wasteKg / totalInput) * 100).toFixed(1) : "0";
          return {
            id: b.id,
            konveksi: b.konveksi.name,
            totalInputKg: totalInput,
            costPerKg: Number(b.costPerKgEffective),
            outputPutihKg: putihKg,
            outputWarnaKg: warnaKg,
            wasteKg: wasteKg,
            wastePercent: `${wastePercent}%`,
            status: b.status,
          };
        }),
      };
    }

    case "propose_draft_order": {
      const actionId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const pendingAction: PendingAction = {
        id: actionId,
        toolName: "propose_draft_order",
        agentId: currentAgentId,
        status: "REQUIRE_APPROVAL",
        payload: {
          customerName: args.customerName,
          productCodeOrName: args.productCodeOrName,
          quantityKg: args.quantityKg,
          pricePerKg: args.pricePerKg,
          estimatedSubtotal: args.quantityKg * args.pricePerKg,
          notes: args.notes || "Draft via AI Agent",
        },
        reason: `Draf penjualan baru volume ${args.quantityKg} kg untuk ${args.customerName} membutuhkan otorisasi admin sebelum mutasi invoice/stok.`,
        createdAt: new Date().toISOString(),
      };
      return {
        result: {
          actionId,
          status: "REQUIRE_APPROVAL",
          message: "Draf order berhasil dibuat dan masuk antrean persetujuan admin.",
          summary: pendingAction.payload,
        },
        requireApproval: pendingAction,
      };
    }

    case "flag_audit_anomaly": {
      return {
        result: {
          anomalyId: `ano_${Date.now()}`,
          status: "LOGGED",
          category: args.category,
          severity: args.severity,
          message: `Temuan anomali level [${args.severity}] dicatat ke sistem pengawasan audit.`,
          details: args.details,
        },
      };
    }

    case "generate_image": {
      const prompt = String(args.prompt || "").trim();
      const width = Number(args.width) || 1024;
      const height = Number(args.height) || 1024;
      const model = args.model || "flux";
      const seed = Math.floor(Math.random() * 1000000);

      const encodedPrompt = encodeURIComponent(prompt);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&nologo=true&seed=${seed}`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 40000);

        const imgRes = await fetch(pollinationsUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const publicDir = path.join(process.cwd(), "public", "generated-images");
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }

          const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.jpg`;
          const filePath = path.join(publicDir, fileName);
          fs.writeFileSync(filePath, buffer);

          const relativeUrl = `/generated-images/${fileName}`;
          return {
            result: {
              success: true,
              message: "Gambar fisik berhasil digenerate gratis via Pollinations Flux dan disimpan ke server.",
              fileName,
              localUrl: relativeUrl,
              markdownImage: `![${prompt.slice(0, 40)}](${relativeUrl})`,
              sizeBytes: buffer.length,
            },
          };
        } else {
          return {
            result: {
              success: false,
              directUrl: pollinationsUrl,
              error: `Pollinations HTTP ${imgRes.status}`,
              markdownImage: `![${prompt.slice(0, 40)}](${pollinationsUrl})`,
            },
          };
        }
      } catch (err: any) {
        return {
          result: {
            success: false,
            directUrl: pollinationsUrl,
            error: err?.message || String(err),
            markdownImage: `![${prompt.slice(0, 40)}](${pollinationsUrl})`,
          },
        };
      }
    }

    default:
      return { result: { error: `Tool ${toolName} tidak dikenal.` } };
  }
}
