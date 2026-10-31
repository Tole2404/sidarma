import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  scrapeGoogleMapsMultiCategories,
  ScrapedPlace,
} from "@/lib/scraper/googleMapsScraper";

export interface ProspectItem {
  id: string;
  storeName: string;
  category: string;
  categoryLabel: string;
  ownerName?: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  rating?: number;
  reviewsCount?: number;
  googleMapsUrl?: string;
  estimatedConsumptionKg: string;
  recommendedMajun: string;
  isAlreadyCustomer: boolean;
  source: string;
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(req.url);

    // Categories: can be multiple comma-separated (e.g. "building_materials,automotive,factory") or single
    const rawCategories =
      searchParams.get("categories") || searchParams.get("category") || "building_materials";
    const categories = rawCategories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const city = searchParams.get("city") || "Jakarta Barat";
    const keyword = (searchParams.get("q") || "").trim();
    const limitPerCategory = parseInt(searchParams.get("limit") || "5", 10);

    // 1. Fetch existing customers from Prisma PostgreSQL to detect duplicates
    const existingCustomers = await prisma.customer.findMany({
      select: { storeName: true, phone: true },
    });
    const existingNames = new Set(
      existingCustomers.map((c) => c.storeName.toLowerCase().trim())
    );
    const existingPhones = new Set(
      existingCustomers
        .map((c) => (c.phone ? c.phone.replace(/[^0-9]/g, "") : ""))
        .filter(Boolean)
    );

    // 2. Perform 100% LIVE MULTI-CATEGORY WEB SCRAPING directly on Google Maps
    console.log(
      `[LIVE SCRAPER] Memindai ${categories.length} kategori di ${city} (limit: ${limitPerCategory}/kategori):`,
      categories
    );

    const { places: rawPlaces, searchQuery, mapsUrl } =
      await scrapeGoogleMapsMultiCategories(
        categories,
        city,
        keyword,
        Math.min(Math.max(limitPerCategory, 2), 10)
      );

    // 3. Format & Map Results with Database Customer checks
    const prospects: ProspectItem[] = rawPlaces.map((item, index) => {
      const cleanPhoneDigits = (item.phone || "").replace(/[^0-9]/g, "");
      const storeName = item.storeName;
      const isAlready =
        existingNames.has(storeName.toLowerCase().trim()) ||
        (cleanPhoneDigits.length >= 7 && existingPhones.has(cleanPhoneDigits));

      return {
        id: `gmaps-live-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
        storeName: item.storeName,
        category: item.category,
        categoryLabel: item.categoryLabel,
        ownerName: item.ownerName,
        phone: item.phone,
        address: item.address,
        city: item.city,
        district: item.district,
        rating: item.rating,
        reviewsCount: item.reviewsCount,
        googleMapsUrl: item.googleMapsUrl,
        estimatedConsumptionKg: item.estimatedConsumptionKg,
        recommendedMajun: item.recommendedMajun,
        isAlreadyCustomer: Boolean(isAlready),
        source: "Google Maps Asli (Puppeteer Live)",
      };
    });

    const executionTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      executionTimeMs,
      engine: "Google Maps Live Multi-Scraper (Headless Chrome)",
      searchQuery,
      mapsLiveUrl: mapsUrl,
      categoriesScraped: categories,
      totalFound: prospects.length,
      unregisteredCount: prospects.filter((r) => !r.isAlreadyCustomer).length,
      registeredCount: prospects.filter((r) => r.isAlreadyCustomer).length,
      prospects,
    });
  } catch (error: any) {
    console.error("Error in /api/prospects/search live scraper:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Gagal menjalankan live scraper Google Maps.",
      },
      { status: 500 }
    );
  }
}
