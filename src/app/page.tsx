import { prisma } from "@/lib/db";
import LandingClient from "./LandingClient";

async function getLandingData() {
  try {
    const settings = await prisma.landingSetting.findMany({
      orderBy: [{ section: "asc" }, { key: "asc" }],
    });

    const grouped = settings.reduce((acc, s) => {
      if (!acc[s.section]) acc[s.section] = {};
      acc[s.section][s.key] = s.value;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    return grouped;
  } catch {
    return {};
  }
}

export default async function LandingPage() {
  const data = await getLandingData();
  return <LandingClient data={data} />;
}