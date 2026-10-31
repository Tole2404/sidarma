> ⚡ **Diproses Langsung Melalui 9Router (ag/gemini-3.8-flash-high)**

### Checklist Persiapan Backup Otomatis PostgreSQL

| Kategori | Item Pemeriksaan | Target Konfigurasi | Status |
| :--- | :--- | :--- | :--- |
| **Kredensial** | User database read-only/dump | Role `backup_user` dengan grant `SELECT` semua tabel | [ ] |
| **Keamanan** | File kredensial aman | File `~/.pgpass` permission `0600` | [ ] |
| **Storage** | Kapasitas disk lokal | Minimum sisa disk 3x estimasi dump size | [ ] |
| **Direktori** | Path target backup | `/var/backups/postgresql/` permission `0700` | [ ] |
| **Rotasi** | Kebijakan retensi | Backup lokal simpan 7 hari, offsite 30 hari | [ ] |
| **Otomasi** | Jadwal Cron OS | Berjalan pukul 00:00 server time (`0 0 * * *`) | [ ] |
| **Offsite** | Sinkronisasi remote | AWS S3 / Cloudflare R2 via `rclone` | [ ] |
| **Alerting** | Notifikasi gagal | Webhook Telegram/Discord kirim status error | [ ] |

---

### Langkah Konfigurasi

Ikuti urutan langkah berikut untuk setup otomatisasi:

1. Buat user backup di PostgreSQL:
   ```sql
   CREATE ROLE backup_user WITH LOGIN PASSWORD 'GANTI_PASSWORD_KUAT';
   GRANT pg_read_all_data TO backup_user;
   ```

2. Konfigurasi kredensial otomatis di server:
   ```bash
   echo "localhost:5432:sidarma_db:backup_user:GANTI_PASSWORD_KUAT" >> ~/.pgpass
   chmod 0600 ~/.pgpass
   ```

3. Buat direktori backup:
   ```bash
   mkdir -p /var/backups/postgresql
   chmod 0700 /var/backups/postgresql
   ```

4. Buat skrip backup `/opt/scripts/pg_backup.sh`:
   ```bash
   #!/usr/bin/env bash
   set -eo pipefail

   BACKUP_DIR="/var/backups/postgresql"
   DATE=$(date +"%Y%m%d_%H%M%S")
   DB_NAME="sidarma_db"
   BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.dump"
   LOG_FILE="/var/log/pg_backup.log"

   echo "[$(date)] Start backup database ${DB_NAME}" >> "${LOG_FILE}"

   # Dump format custom (-Fc) kompresi internal
   pg_dump -U backup_user -h localhost -Fc "${DB_NAME}" > "${BACKUP_FILE}"

   # Cek ukuran file > 0 byte
   if [ ! -s "${BACKUP_FILE}" ]; then
       echo "[$(date)] ERROR: Backup kosong atau gagal." >> "${LOG_FILE}"
       exit 1
   fi

   # Hapus file lokal lebih lama dari 7 hari
   find "${BACKUP_DIR}" -name "${DB_NAME}_*.dump" -mtime +7 -delete

   echo "[$(date)] Backup sukses: ${BACKUP_FILE}" >> "${LOG_FILE}"
   ```

5. Pasang permission eksekusi script:
   ```bash
   chmod +x /opt/scripts/pg_backup.sh
   ```

6. Daftarkan di Cron OS root atau deploy user:
   ```bash
   crontab -e
   ```
   Tambahkan entri midnight backup:
   ```cron
   0 0 * * * /opt/scripts/pg_backup.sh >> /var/log/pg_backup_cron.log 2>&1
   ```

---

### Verifikasi & Disaster Recovery

* Eksekusi manual skrip: `/opt/scripts/pg_backup.sh`.
* Cek output file: `ls -lh /var/backups/postgresql/`.
* Uji integritas file dump: `pg_restore --list /var/backups/postgresql/sidarma_db_*.dump > /dev/null`.
* Jadwalkan uji restore bulanan ke database staging: test load tabel inventory, supplier CV Sumber Rejeki, transaksi bal. Pastikan data utuh tanpa corrupt.