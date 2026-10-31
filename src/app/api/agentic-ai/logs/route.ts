import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const division = searchParams.get("division");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    if ((prisma as any).agentLog) {
      const where: any = {};
      if (division && division !== "ALL") where.division = division;
      if (status && status !== "ALL") where.status = status;
      if (search) {
        where.OR = [
          { agentName: { contains: search, mode: "insensitive" } },
          { input: { contains: search, mode: "insensitive" } },
          { action: { contains: search, mode: "insensitive" } },
        ];
      }

      const logs = await (prisma as any).agentLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return NextResponse.json({ logs });
    } else {
      // Direct raw query fallback
      const logs = await prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM "AgentLog" ORDER BY "createdAt" DESC LIMIT $1`,
        limit
      );
      return NextResponse.json({ logs });
    }
  } catch (err: any) {
    console.error("API /api/agentic-ai/logs error:", err);
    return NextResponse.json(
      { logs: [], error: err.message || "Gagal mengambil log." },
      { status: 200 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if ((prisma as any).agentLog) {
      await (prisma as any).agentLog.deleteMany({});
    } else {
      await prisma.$executeRawUnsafe(`DELETE FROM "AgentLog"`);
    }
    return NextResponse.json({
      success: true,
      message: "Semua log berhasil dibersihkan.",
    });
  } catch (err: any) {
    console.error("API /api/agentic-ai/logs DELETE error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal menghapus log." },
      { status: 500 }
    );
  }
}
