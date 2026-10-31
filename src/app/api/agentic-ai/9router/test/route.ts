import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NINEROUTER_BASE_URL || "http://localhost:20128/v1";
  const apiKey = process.env.NINEROUTER_API_KEY || "";
  const model = process.env.NINEROUTER_MODEL || "gpt-4o-mini";

  try {
    // Attempt pinging 9Router models or chat completions
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const res = await fetch(`${baseUrl}/models`, {
      headers,
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({
        online: true,
        baseUrl,
        model,
        message: "9Router terhubung dan siap memproses permintaan LLM!",
        models: data.data || [],
      });
    }

    // Try a simple ping to baseUrl root
    const rootRes = await fetch(baseUrl.replace("/v1", ""), {
      signal: AbortSignal.timeout(1500),
    }).catch(() => null);

    if (rootRes && rootRes.ok) {
      return NextResponse.json({
        online: true,
        baseUrl,
        model,
        message: "9Router terdeteksi aktif di port 20128!",
      });
    }

    return NextResponse.json({
      online: false,
      baseUrl,
      model,
      message:
        "9Router belum aktif. Jalankan perintah `9router` di terminal untuk menyalakan proxy gateway.",
    });
  } catch (err: any) {
    return NextResponse.json({
      online: false,
      baseUrl,
      model,
      error: err.message,
      message:
        "9Router tidak merespons di " +
        baseUrl +
        ". Jalankan `9router` di terminal.",
    });
  }
}
