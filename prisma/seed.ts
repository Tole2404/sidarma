import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { BaleClothType, BaleGrade, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateLegacyUsers() {
  const legacyDatabaseUrl = process.env.LEGACY_DATABASE_URL;

  if (!legacyDatabaseUrl) {
    console.log("LEGACY_DATABASE_URL not set, skipping legacy user migration.");
    return 0;
  }

  try {
    const connection = await mysql.createConnection(legacyDatabaseUrl);
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT email, name, password, role FROM \"User\"",
    ).catch(async () => {
      return connection.query<mysql.RowDataPacket[]>(
        "SELECT email, name, password, role FROM `User`",
      );
    });

    let migratedCount = 0;

    for (const row of rows) {
      if (!row.email || !row.password) {
        continue;
      }

      await prisma.user.upsert({
        where: { email: String(row.email) },
        update: {
          name: row.name ? String(row.name) : null,
          password: String(row.password),
          role: String(row.role) === "USER" ? Role.USER : Role.ADMIN,
        },
        create: {
          email: String(row.email),
          name: row.name ? String(row.name) : null,
          password: String(row.password),
          role: String(row.role) === "USER" ? Role.USER : Role.ADMIN,
        },
      });

      migratedCount += 1;
    }

    await connection.end();
    console.log(`Migrated ${migratedCount} user(s) from legacy MySQL.`);
    return migratedCount;
  } catch (error) {
    console.warn("Legacy user migration skipped due to connection/query failure.", error);
    return 0;
  }
}

async function ensureDefaultAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@majun.local" },
    update: {},
    create: {
      email: "admin@majun.local",
      name: "Admin Majun",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Ensured fallback admin exists: admin@majun.local / admin123");
}

async function seedProducts() {
  const products = [
    { code: "MAJUN_PUTIH", name: "Majun Putih" },
    { code: "MAJUN_WARNA", name: "Majun Warna" },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: { name: product.name, isActive: true },
      create: product,
    });
  }
}

async function seedExpenseCategories() {
  const categories = [
    "Delivery",
    "Fuel",
    "Worker Salary",
    "Packaging",
    "Transportation",
    "Miscellaneous",
  ];

  for (const name of categories) {
    await prisma.expenseCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

async function seedBalePrices() {
  const balePrices: Array<{
    clothType: BaleClothType;
    grade: BaleGrade;
    pricePerBal: number;
    notes?: string;
  }> = [
    { clothType: BaleClothType.PUTIH, grade: BaleGrade.A1, pricePerBal: 950000, notes: "Grade premium" },
    { clothType: BaleClothType.PUTIH, grade: BaleGrade.B2, pricePerBal: 900000, notes: "Grade menengah" },
    { clothType: BaleClothType.PUTIH, grade: BaleGrade.C3, pricePerBal: 840000, notes: "Grade ekonomis" },
    { clothType: BaleClothType.WARNA, grade: BaleGrade.A1, pricePerBal: 980000, notes: "Grade premium" },
    { clothType: BaleClothType.WARNA, grade: BaleGrade.B2, pricePerBal: 930000, notes: "Grade menengah" },
    { clothType: BaleClothType.WARNA, grade: BaleGrade.C3, pricePerBal: 870000, notes: "Grade ekonomis" },
  ];

  for (const item of balePrices) {
    await prisma.balePrice.upsert({
      where: {
        clothType_grade: {
          clothType: item.clothType,
          grade: item.grade,
        },
      },
      update: {
        pricePerBal: item.pricePerBal,
        notes: item.notes,
      },
      create: {
        clothType: item.clothType,
        grade: item.grade,
        pricePerBal: item.pricePerBal,
        notes: item.notes,
      },
    });
  }
}

async function seedLandingSettings() {
  const landingData = [
    // Hero Section
    { section: "hero", key: "badge", value: "Supplier kain majun terpercaya sejak 2019" },
    { section: "hero", key: "title", value: "Kain Majun Berkualitas" },
    { section: "hero", key: "subtitle", value: "untuk Semua Kebutuhan" },
    { section: "hero", key: "description", value: "Majun putih & warna siap kirim dalam quantity besar. Harga distributor, kualitas premium, pengiriman cepat ke seluruh Jawa." },
    { section: "hero", key: "trust1", value: "Bebas ongkir Jabodetabek" },
    { section: "hero", key: "trust2", value: "Stock siap kirim" },
    { section: "hero", key: "wa_number", value: "6281234567890" },
    // Stats Section
    { section: "stats", key: "exp_years", value: "5+" },
    { section: "stats", key: "customers", value: "100+" },
    { section: "stats", key: "stock", value: "10 Ton" },
    { section: "stats", key: "response", value: "24 Jam" },
    // About Section
    { section: "about", key: "badge", value: "Kenapa Memilih Kami" },
    { section: "about", key: "title", value: "Distributor langsung, harga lebih hemat" },
    { section: "about", key: "description", value: "CV. SIDARMA MAJUN hadir sebagai solusi pasokan kain majun berkualitas dengan harga langsung dari sumber. Dengan pengalaman lebih dari 5 tahun, kami melayani ratusan toko dan pabrik di Pulau Jawa." },
    { section: "about", key: "address", value: "Jl. Industri Maju No. 18, Bandung" },
    { section: "about", key: "hours", value: "08.00 — 17.00 WIB" },
    { section: "about", key: "phone", value: "0812-3456-7890" },
    { section: "about", key: "stock", value: "± 10 Ton" },
    { section: "about", key: "trust1", value: "Bahan berkualitas, tidak mudah robek" },
    { section: "about", key: "trust2", value: "Daya serap tinggi & cepat kering" },
    { section: "about", key: "trust3", value: "Harga langsung dari distributor" },
    { section: "about", key: "trust4", value: "Pengiriman cepat ke seluruh Jawa" },
    { section: "about", key: "trust5", value: "Minimal order 20 kg" },
    { section: "about", key: "trust6", value: "Bisa cicilan untuk customer tetap" },
    // Order Section
    { section: "order", key: "step1_title", value: "Hubungi Kami" },
    { section: "order", key: "step1_desc", value: "Chat via WhatsApp atau telepon untuk konsultasi kebutuhan." },
    { section: "order", key: "step2_title", value: "Konfirmasi Order" },
    { section: "order", key: "step2_desc", value: "Pilih produk, tentukan quantity, dan sepakati harga." },
    { section: "order", key: "step3_title", value: "Proses & Kirim" },
    { section: "order", key: "step3_desc", value: "Barang disiapkan & dikirim lewat ekspedisi terpercaya." },
    // CTA Section
    { section: "cta", key: "title", value: "Siap memesan kain majun?" },
    { section: "cta", key: "subtitle", value: "Hubungi kami sekarang via WhatsApp untuk konsultasi dan penawaran harga terbaik." },
    // Footer
    { section: "footer", key: "company_name", value: "CV. SIDARMA MAJUN" },
    { section: "footer", key: "description", value: "Penyedia kain majun putih dan warna berkualitas untuk kebutuhan industri, bengkel, rumah sakit, dan cleaning service." },
    { section: "footer", key: "wa_label", value: "WhatsApp" },
    { section: "footer", key: "wa_number", value: "0812-3456-7890" },
    { section: "footer", key: "email_label", value: "Email" },
    { section: "footer", key: "email", value: "sidarmamajun@gmail.com" },
    { section: "footer", key: "address", value: "Jl. Industri Maju No. 18, Bandung" },
    { section: "footer", key: "hours_weekday", value: "Senin — Jumat: 08.00 — 17.00" },
    { section: "footer", key: "hours_saturday", value: "Sabtu: 08.00 — 14.00" },
    { section: "footer", key: "hours_sunday", value: "Minggu: Tutup" },
    // Maps
    { section: "maps", key: "embed_url", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.7419172!3d-6.2416776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMjAuMCJTIDEwNsKwNDQnMzAuOSJF!5e0!3m2!1sid!2sid" },
    { section: "maps", key: "maps_link", value: "https://maps.app.goo.gl/aJDEdUZwJ8M3wnEP9?g_st=ic" },
    { section: "maps", key: "location_name", value: "Lokasi Gudang Kami" },
    { section: "maps", key: "location_subtitle", value: "Area pergudangan & industri" },
  ];

  for (const item of landingData) {
    await prisma.landingSetting.upsert({
      where: {
        section_key: {
          section: item.section,
          key: item.key,
        },
      },
      update: { value: item.value },
      create: item,
    });
  }
  console.log("Seeded landing page settings.");
}

async function main() {
  console.log("Start seeding Majun Admin...");

  await migrateLegacyUsers();
  await ensureDefaultAdmin();
  await seedProducts();
  await seedExpenseCategories();
  await seedBalePrices();
  await seedLandingSettings();

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
