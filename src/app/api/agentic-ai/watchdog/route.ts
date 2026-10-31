import { NextRequest, NextResponse } from "next/server";
import { runAutonomousWatchdogSweep, getLastWatchdogResult } from "../../../../lib/agentic/watchdog";

export async function GET() {
  try {
    let result = getLastWatchdogResult();
    if (!result) {
      result = await runAutonomousWatchdogSweep();
    }
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menjalankan status watchdog." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const sweepResult = await runAutonomousWatchdogSweep();
    return NextResponse.json({
      success: true,
      message: "Autonomous Watchdog Sweep selesai dieksekusi.",
      result: sweepResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal mengeksekusi watchdog sweep." },
      { status: 500 }
    );
  }
}
