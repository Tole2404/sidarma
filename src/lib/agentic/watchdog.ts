import { prisma } from "../db";
import { executeAgent } from "./engine";

export interface WatchdogFinding {
  type: "CRITICAL_STOCK" | "OUTSTANDING_DEBT" | "HIGH_WASTE_ANOMALY";
  severity: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  detail: string;
  metric: string;
}

export interface WatchdogSweepResult {
  runAt: string;
  status: "HEALTHY" | "ATTENTION_REQUIRED" | "CRITICAL";
  totalFindings: number;
  findings: WatchdogFinding[];
  agentSummary?: string;
  logId?: string;
}

let lastSweepResult: WatchdogSweepResult | null = null;

export async function runAutonomousWatchdogSweep(): Promise<WatchdogSweepResult> {
  const findings: WatchdogFinding[] = [];

  // 1. Scan Critical Low Stocks (<= 100 kg)
  try {
    const products = await prisma.product.findMany({
      where: { currentStockKg: { lte: 100 } },
      select: { code: true, name: true, currentStockKg: true },
    });

    for (const p of products) {
      const stock = Number(p.currentStockKg);
      findings.push({
        type: "CRITICAL_STOCK",
        severity: stock <= 0 ? "HIGH" : "MEDIUM",
        title: `Stok Kritis: ${p.name}`,
        detail: `Stok saat ini ${stock} kg di bawah batas aman operasional. Segera lakukan pengadaan bal atau partai bongkaran.`,
        metric: `${stock} kg`,
      });
    }
  } catch (err) {
    console.error("Watchdog stock scan error:", err);
  }

  // 2. Scan Outstanding Debts (Unpaid / Partial Sales)
  try {
    const unpaidSales = await prisma.sale.findMany({
      where: { paymentStatus: { in: ["UNPAID", "PARTIAL"] } },
      include: { customer: { select: { storeName: true } } },
      take: 10,
    });

    if (unpaidSales.length > 0) {
      const totalOutstanding = unpaidSales.reduce(
        (sum, s) => sum + Number(s.outstandingAmount),
        0
      );
      findings.push({
        type: "OUTSTANDING_DEBT",
        severity: totalOutstanding > 10000000 ? "HIGH" : "MEDIUM",
        title: `Piutang Pelanggan Belum Lunas (${unpaidSales.length} Faktur)`,
        detail: `Terdapat total tagihan tertunggak Rp ${totalOutstanding.toLocaleString("id-ID")} dari pelanggan: ${unpaidSales.map((s) => s.customer.storeName).join(", ")}.`,
        metric: `Rp ${totalOutstanding.toLocaleString("id-ID")}`,
      });
    }
  } catch (err) {
    console.error("Watchdog sales debt scan error:", err);
  }

  // 3. Scan High Waste Bongkaran (> 15% waste)
  try {
    const recentBongkarans = await prisma.bongkaran.findMany({
      take: 5,
      orderBy: { purchaseDate: "desc" },
      include: { konveksi: { select: { name: true } }, sorts: true },
    });

    for (const b of recentBongkarans) {
      const totalInput = Number(b.quantityKg);
      const totalWaste = (b.sorts || []).reduce((sum, s) => sum + Number(s.wasteKg), 0);
      if (totalInput > 0) {
        const wastePercent = (totalWaste / totalInput) * 100;
        if (wastePercent > 15) {
          findings.push({
            type: "HIGH_WASTE_ANOMALY",
            severity: wastePercent > 20 ? "HIGH" : "MEDIUM",
            title: `Anomali Susut/Waste Tinggi (${wastePercent.toFixed(1)}%)`,
            detail: `Partai bal dari ${b.konveksi.name} menghasilkan ${totalWaste} kg sampah dari ${totalInput} kg input kain.`,
            metric: `${wastePercent.toFixed(1)}%`,
          });
        }
      }
    }
  } catch (err) {
    console.error("Watchdog waste scan error:", err);
  }

  const overallStatus =
    findings.filter((f) => f.severity === "HIGH").length > 0
      ? "CRITICAL"
      : findings.length > 0
      ? "ATTENTION_REQUIRED"
      : "HEALTHY";

  let agentSummary = "Semua parameter operasional darmin dalam batas normal.";
  let logId: string | undefined;

  // 4. Trigger Autonomous Audit Sentinel if anomalies or critical conditions found
  if (findings.length > 0) {
    try {
      const prompt = `Lakukan sweep pengawasan audit otomatis (Autonomous Watchdog Sweep).
Temuan parameter operasional:
${findings.map((f, i) => `${i + 1}. [${f.severity}] ${f.title}: ${f.detail}`).join("\n")}

Berikan analisis dampak kas/stok dan tindakan darurat prioritas untuk manajemen darmin.`;

      const auditRun = await executeAgent("audit-sentinel", prompt, {
        isWatchdog: true,
        findingsCount: findings.length,
      });

      agentSummary = auditRun.output;
      logId = auditRun.logId;
    } catch (auditErr) {
      console.error("Watchdog audit agent run error:", auditErr);
    }
  }

  const result: WatchdogSweepResult = {
    runAt: new Date().toISOString(),
    status: overallStatus,
    totalFindings: findings.length,
    findings,
    agentSummary,
    logId,
  };

  lastSweepResult = result;
  return result;
}

export function getLastWatchdogResult(): WatchdogSweepResult | null {
  return lastSweepResult;
}
