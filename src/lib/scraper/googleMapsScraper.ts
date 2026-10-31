import puppeteer from "puppeteer-core";
import fs from "fs";

export interface ScrapedPlace {
  storeName: string;
  category: string;
  categoryLabel: string;
  ownerName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  rating: number;
  reviewsCount: number;
  googleMapsUrl: string;
  estimatedConsumptionKg: string;
  recommendedMajun: string;
  source: string;
}

function getBrowserExecutablePath(): string {
  const possiblePaths = [
    process.env.CHROME_BIN,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean) as string[];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Fallback default
  return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
}

export function getCategoryConfig(category: string): {
  label: string;
  defaultSearch: string;
  estimatedConsumption: string;
  recommendedMajun: string;
} {
  switch (category) {
    case "building_materials":
      return {
        label: "Toko Bangunan & Material",
        defaultSearch: "toko bangunan",
        estimatedConsumption: "50 - 150 kg/bulan",
        recommendedMajun: "Majun Putih Jahit & Majun Warna Polos (Lap Kuas & Keramik)",
      };
    case "automotive":
      return {
        label: "Bengkel & Karoseri Mobil",
        defaultSearch: "bengkel mobil",
        estimatedConsumption: "100 - 300 kg/bulan",
        recommendedMajun: "Majun Katun Super Serap Oli, Gemuk & Lemak Mesin",
      };
    case "factory":
      return {
        label: "Pabrik Manufaktur Industri",
        defaultSearch: "pabrik manufaktur",
        estimatedConsumption: "200 - 1000 kg/bulan",
        recommendedMajun: "Majun Putih Tanpa Jahit & Majun Lembaran Lebar Ekspor",
      };
    case "printing":
      return {
        label: "Percetakan & Sablon",
        defaultSearch: "percetakan offset digital",
        estimatedConsumption: "50 - 200 kg/bulan",
        recommendedMajun: "Majun Putih Katun Halus Serap Tinta Mesin Cetak",
      };
    case "fabrication":
      return {
        label: "Workshop Bubut & Fabrikasi",
        defaultSearch: "bengkel bubut las fabrikasi",
        estimatedConsumption: "100 - 250 kg/bulan",
        recommendedMajun: "Majun Katun Serap Debu Besi & Oli Bubut",
      };
    case "all":
    default:
      return {
        label: "Toko Bangunan & Industri Teknik",
        defaultSearch: "toko bangunan dan material industri",
        estimatedConsumption: "80 - 250 kg/bulan",
        recommendedMajun: "Majun Putih Jahit & Majun Warna Serap Oli",
      };
  }
}

export interface LiveScrapeResult {
  places: ScrapedPlace[];
  searchQuery: string;
  mapsUrl: string;
  targetCount: number;
}

// Scrape multiple categories in a single browser session
export async function scrapeGoogleMapsMultiCategories(
  categories: string[],
  city: string,
  keyword: string,
  limitPerCategory: number = 5
): Promise<LiveScrapeResult> {
  const targetArea = !city || city === "all" ? "DKI Jakarta" : city;
  const execPath = getBrowserExecutablePath();

  if (!fs.existsSync(execPath)) {
    console.warn("Browser binary not found at:", execPath);
    return { places: [], searchQuery: "", mapsUrl: "", targetCount: 0 };
  }

  // Normalize categories list (if empty or contains 'all', default to core 3-4 sectors)
  let targetCats = categories.filter((c) => c && c !== "all");
  if (targetCats.length === 0) {
    targetCats = ["building_materials", "automotive", "factory"];
  }

  const allPlaces: ScrapedPlace[] = [];
  let firstQuery = "";
  let firstMapsUrl = "";

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: execPath,
      headless: "new" as any,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--lang=id-ID,id",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    for (const cat of targetCats) {
      const config = getCategoryConfig(cat);
      let query = "";
      if (keyword && keyword.trim()) {
        const cleanKw = keyword.trim();
        query = cleanKw.toLowerCase().includes(targetArea.toLowerCase())
          ? cleanKw
          : `${cleanKw} ${targetArea}`;
      } else {
        query = `${config.defaultSearch} ${targetArea}`;
      }

      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      if (!firstQuery) {
        firstQuery = query;
        firstMapsUrl = mapsUrl;
      }

      console.log(`[PUPPETEER LIVE] Scraping kategori '${config.label}' di ${targetArea}: ${query}`);

      try {
        await page.goto(mapsUrl, { waitUntil: "networkidle2", timeout: 25000 });

        // Wait for feed items
        await page
          .waitForSelector('div[role="feed"], div[role="article"], .qBF1Pd', { timeout: 8000 })
          .catch(() => {});

        // Scroll feed once or twice
        try {
          await page.evaluate(async () => {
            const feed = document.querySelector('div[role="feed"]');
            if (feed) {
              feed.scrollTop = feed.scrollHeight / 2;
              await new Promise((r) => setTimeout(r, 600));
              feed.scrollTop = feed.scrollHeight;
              await new Promise((r) => setTimeout(r, 600));
            }
          });
        } catch {}

        // Extract places from DOM
        const rawPlaces = await page.evaluate(
          (maxCount, catId, catLabel, catNeeds, catMajun, area) => {
            const items = Array.from(
              document.querySelectorAll(
                'div[role="article"], div[role="feed"] > div > div[jsaction]'
              )
            );

            const phoneRegex =
              /(\+62[\s-]?\d{2,4}[\s-]?\d{4,8}|08\d{2}[\s-]?\d{3,4}[\s-]?\d{3,5}|\(0\d{2,3}\)[\s-]?\d{6,8}|02\d{1,2}[\s-]?\d{6,8})/;

            const list: Array<{
              storeName: string;
              category: string;
              categoryLabel: string;
              ownerName: string;
              phone: string;
              address: string;
              city: string;
              district: string;
              rating: number;
              reviewsCount: number;
              googleMapsUrl: string;
              estimatedConsumptionKg: string;
              recommendedMajun: string;
              source: string;
            }> = [];

            for (const item of items) {
              if (list.length >= maxCount) break;

              const nameEl = item.querySelector(".qBF1Pd, .fontHeadlineSmall, [aria-label]");
              const name =
                nameEl?.textContent?.trim() || nameEl?.getAttribute("aria-label") || "";

              if (!name || name.length < 3 || name === "Hasil" || name === "Sponsor") {
                continue;
              }

              const linkEl = item.querySelector('a[href*="/maps/place/"]') as HTMLAnchorElement | null;
              const link = linkEl?.href || "";

              const ratingEl = item.querySelector(".MW4etd");
              const rating = ratingEl
                ? parseFloat(ratingEl.textContent?.trim().replace(",", ".") || "0")
                : 4.5;

              const reviewEl = item.querySelector(".UY7F9");
              const reviewsText = reviewEl
                ? reviewEl.textContent?.replace(/[^0-9]/g, "") || ""
                : "";
              const reviewsCount = reviewsText ? parseInt(reviewsText, 10) : 15;

              // Phone extraction
              const textElements = Array.from(item.querySelectorAll(".W4Efsd"));
              let phone = "";
              textElements.forEach((el) => {
                const t = el.textContent || "";
                const m = t.match(phoneRegex);
                if (m && !phone) phone = m[0].trim();
              });

              // Address extraction
              const fullText = (item as HTMLElement).innerText || "";
              const lines = fullText
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean);

              let address = "";
              for (const line of lines) {
                const streetMatch = line.match(
                  /(?:Jl\.|Jalan|Gang|Gg\.|Blok|Komplek|Komp\.|Raya|Kawasan|RT\.|RW\.).*/i
                );
                if (streetMatch) {
                  address = streetMatch[0]
                    .replace(/[\uE000-\uF8FF\u2000-\u206F]/g, "")
                    .replace(/[^\x20-\x7E\u00A0-\u024F]/g, " ")
                    .replace(/^[·•\s\u2022\u00b7,.-]+|[·•\s\u2022\u00b7,.-]+$/g, "")
                    .replace(/\s+/g, " ")
                    .trim();
                  break;
                }
              }

              if (!address && lines.length > 2) {
                address = lines[2]
                  .replace(/[\uE000-\uF8FF\u2000-\u206F]/g, "")
                  .replace(/[^\x20-\x7E\u00A0-\u024F]/g, " ")
                  .replace(/^[·•\s\u2022\u00b7,.-]+|[·•\s\u2022\u00b7,.-]+$/g, "")
                  .replace(/\s+/g, " ")
                  .trim();
              }

              let district = "-";
              const districtMatch = address.match(
                /(Cengkareng|Kalideres|Kebon Jeruk|Kembangan|Palmerah|Grogol|Tanjung Priok|Kelapa Gading|Cilincing|Koja|Pademangan|Penjaringan|Cakung|Cipayung|Ciracas|Duren Sawit|Jatinegara|Kramat Jati|Makasar|Matraman|Pasar Rebo|Cilandak|Jagakarsa|Kebayoran|Mampang|Pancoran|Pasar Minggu|Pesanggrahan|Setiabudi|Tebet|Gambir|Tanah Abang|Menteng|Senen|Cempaka Putih|Johar Baru|Kemayoran|Sawah Besar)/i
              );
              if (districtMatch) district = districtMatch[1];

              list.push({
                storeName: name,
                category: catId,
                categoryLabel: catLabel,
                ownerName: "Pemilik / Staff Usaha",
                phone: phone || "Telepon Tidak Tercantum",
                address: address || `Wilayah ${area}`,
                city: area,
                district,
                rating,
                reviewsCount,
                googleMapsUrl:
                  link ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${name} ${address}`
                  )}`,
                estimatedConsumptionKg: catNeeds,
                recommendedMajun: catMajun,
                source: "Google Maps Asli (Puppeteer Live)",
              });
            }

            return list;
          },
          limitPerCategory,
          cat,
          config.label,
          config.estimatedConsumption,
          config.recommendedMajun,
          targetArea
        );

        allPlaces.push(...rawPlaces);
      } catch (catErr) {
        console.warn(`Gagal memindai kategori ${cat}:`, catErr);
      }
    }

    return {
      places: allPlaces,
      searchQuery: targetCats.length > 1 ? `${targetCats.length} Sektor di ${targetArea}` : firstQuery,
      mapsUrl: firstMapsUrl,
      targetCount: targetCats.length,
    };
  } catch (err) {
    console.error("Puppeteer Multi-Scraper Error:", err);
    return { places: allPlaces, searchQuery: firstQuery, mapsUrl: firstMapsUrl, targetCount: targetCats.length };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

// Single category live scraper backward-compatible wrapper
export async function scrapeGoogleMapsLive(
  category: string,
  city: string,
  keyword: string,
  maxResults: number = 20
): Promise<LiveScrapeResult> {
  return scrapeGoogleMapsMultiCategories([category], city, keyword, maxResults);
}
