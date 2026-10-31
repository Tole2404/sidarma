import { NextRequest, NextResponse } from "next/server";
import { executeAgent } from "@/lib/agentic/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, prompt, params } = body;

    console.log("API /api/agentic-ai/run -> executing agent:", agentId);

    const result = await executeAgent(agentId, prompt, params);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API /api/agentic-ai/run error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal menjalankan agent." },
      { status: 500 }
    );
  }
}
