> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

### Checklist Persiapan Backup Otomatis PostgreSQL (00:00)

#### 1. Kredensial & Keamanan
- Buat user database khusus backup dengan hak baca saja.
- Simpan kredensial di `~/.pgpass` format: `hostname:port:database:username:password`.
- Set izin file ketat: `chmod 600 ~/.pgpass`. Jangan tulis password dalam script.

#### 2. Skrip Backup (`/opt/scripts/backup-pg.sh`)
- Gunakan format custom compressed (`-Fc`) untuk dump efisien dan fleksibilitas restore:
  ```bash
  pg_dump -h localhost -U db_backup_user -d sidarma_erp -Fc -f "/var/backups/pg/sidarma_$(date +%Y%m%d_%H%M%S).dump"
  ```
- Validasi exit code `$?` segera setelah command `pg_dump`.
- Cek ukuran file hasil dump tidak 0 byte.

#### 3. Rotasi & Retensi Disk Lokal
- Siapkan direktori backup: `mkdir -p /var/backups/pg`.
- Bersihkan dump lokal lebih tua dari 7 hari:
  ```bash
  find /var/backups/pg -type f -name "*.dump" -mtime +7 -delete
  ```
- Monitor sisa kapasitas partisi disk (`df -h`).

#### 4. Replikasi Offsite (Cloud Storage)
- Pasang `rclone` atau `aws-cli`.
- Sinkronisasi file ke bucket S3/R2 setelah dump lokal sukses:
  ```bash
  rclone copy /var/backups/pg/ remote:sidarma-db-backups/
  ```

#### 5. Penjadwalan Cron
- Buka crontab: `crontab -e`.
- Pasang jadwal tengah malam (00:00) beserta log:
  ```cron
  0 0 * * * /opt/scripts/backup-pg.sh >> /var/log/pg-backup.log 2>&1
  ```

#### 6. Notifikasi & Monitoring
- Tambahkan webhook (Discord/Telegram) dalam skrip saat proses gagal (`trap` on error).
- Kirim status gagal jika disk penuh atau dump error.

#### 7. Uji Validasi Restore
- Uji restore berkala ke server staging untuk verifikasi integritas data:
  ```bash
  pg_restore -h localhost -U db_user -d sidarma_staging --clean --no-owner /var/backups/pg/<nama_file>.dump
  ```