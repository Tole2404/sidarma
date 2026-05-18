# Majun Admin

Sistem administrasi usaha kain majun berbasis Next.js, Prisma, PostgreSQL, dan shadcn-style UI. Fase pertama mencakup dashboard, pembelian, penjualan, pengeluaran, stok, customer, dan supplier.

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- iron-session untuk auth admin

## Environment
Gunakan file `.env` berikut:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/majun_admin?schema=public"
LEGACY_DATABASE_URL="mysql://root:password@localhost:3306/simadar"
SESSION_SECRET="complex_password_at_least_32_characters_long"
```

`LEGACY_DATABASE_URL` bersifat opsional. Jika tersedia saat seeding, user admin lama dari MySQL akan di-upsert ke PostgreSQL.

## Menjalankan Lokal
1. Install dependency:
   ```bash
   npm install
   ```
2. Jalankan PostgreSQL lokal atau gunakan Docker Compose.
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Buat schema database:
   ```bash
   npx prisma migrate dev
   ```
5. Seed data awal:
   ```bash
   npx prisma db seed
   ```
6. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## Menjalankan Dengan Docker
1. Jalankan database dan app:
   ```bash
   docker compose up -d --build
   ```
2. Jika hanya ingin menyalakan database:
   ```bash
   docker compose up -d db
   ```
3. Setup Prisma di container app:
   ```bash
   docker compose exec app sh
   npx prisma migrate deploy
   npx prisma db seed
   exit
   ```

## Default Admin
- Email fallback: `admin@majun.local`
- Password: `admin123`

Jika `LEGACY_DATABASE_URL` aktif dan database MySQL lama tersedia, akun user lama akan ikut dimigrasikan saat seeding.
