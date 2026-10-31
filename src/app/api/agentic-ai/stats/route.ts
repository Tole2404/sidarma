import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AGENT_ROSTER } from "@/lib/agentic/roster";

export async function GET() {
  try {
    const totalAgents = AGENT_ROSTER.length;

    let totalLogs = 0;
    let successfulLogs = 0;
    let recentLogs: any[] = [];

    if ((prisma as any).agentLog) {
      totalLogs = await (prisma as any).agentLog.count();
      successfulLogs = await (prisma as any).agentLog.count({
        where: { status: "SUCCESS" },
      });
      recentLogs = await (prisma as any).agentLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          agentName: true,
          action: true,
          status: true,
          createdAt: true,
          latencyMs: true,
        },
      });
    } else {
      const countRes = await prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*)::int as count FROM "AgentLog"`
      );
      totalLogs = countRes[0]?.count || 0;

      const successRes = await prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*)::int as count FROM "AgentLog" WHERE "status" = 'SUCCESS'`
      );
      successfulLogs = successRes[0]?.count || 0;

      recentLogs = await prisma.$queryRawUnsafe<any[]>(
        `SELECT "id", "agentName", "action", "status", "createdAt", "latencyMs" FROM "AgentLog" ORDER BY "createdAt" DESC LIMIT 5`
      );
    }

    const successRate =
      totalLogs > 0 ? Math.round((successfulLogs / totalLogs) * 100) : 100;

    return NextResponse.json({
      totalAgents,
      totalExecutions: totalLogs,
      successRate,
      recentLogs,
      activeAgentsCount: totalAgents,
    });
  } catch (err: any) {
    console.error("API /api/agentic-ai/stats error:", err);
    return NextResponse.json(
      {
        totalAgents: AGENT_ROSTER.length,
        totalExecutions: 0,
        successRate: 100,
        recentLogs: [],
        activeAgentsCount: AGENT_ROSTER.length,
      },
      { status: 200 }
    );
  }
}
