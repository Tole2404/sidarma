Buatkan saya sebuah web app sistem keuangan bernama "SIMADAR (Sistem Informasi Manajemen Darmin)" menggunakan Next.js (App Router) yang berjalan di environment lokal terlebih dahulu.

Tujuan utama:
- Sistem berjalan di localhost
- Bisa diakses melalui IP local (untuk demo ke device lain)
- Opsional: support Docker untuk deployment sederhana

Teknologi yang digunakan:
- Next.js versi terbaru (App Router)
- Tailwind CSS
- Database lokal  MySQL
- Authentication sederhana (session/login manual atau NextAuth)

Fitur utama:
1. Login & Register (admin)
2. Dashboard:
   - Total pemasukan
   - Total pengeluaran
   - Saldo
3. CRUD transaksi:
   - Tambah pemasukan
   - Tambah pengeluaran
   - Edit & hapus
4. Kategori transaksi
5. Riwayat transaksi (table)
6. Filter berdasarkan tanggal
7. Export data ke CSV

Kebutuhan teknis:
- Gunakan App Router (folder app/)
- Gunakan API Route Next.js untuk backend
- Gunakan Prisma schema untuk database
- Sertakan file .env.example

Akses jaringan:
- Sertakan cara menjalankan project di localhost
- Sertakan cara agar bisa diakses via IP local (0.0.0.0)

Docker (opsional tapi WAJIB dijelaskan):
- Buatkan Dockerfile
- Buatkan docker-compose.yml (app + database)
- Sertakan cara menjalankan dengan Docker

Output yang diharapkan:
- Struktur folder project lengkap
- Kode tiap file penting (frontend + backend)
- Schema database (Prisma)
- Step-by-step cara install dan running (local & Docker)
- Cara akses via IP local