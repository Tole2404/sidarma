-- =========================================================================
-- QUERY ANALISIS LABA RUGI & VALUASI STOK KAIN MAJUN
-- Dibuat oleh: SQL-17 (DataAnalyst-Core)
-- Target Database: PostgreSQL SIDARMA Production
-- =========================================================================

SELECT 
    p.name AS nama_produk,
    p.sku,
    p.category,
    p."unitPrice" AS harga_jual_satuan,
    COALESCE(SUM(s.quantity), 0) AS total_stok_kg,
    (COALESCE(SUM(s.quantity), 0) * p."unitPrice") AS total_valuasi_aset,
    CASE 
        WHEN COALESCE(SUM(s.quantity), 0) < 150 THEN 'KRITIS / SEGERA RESTOCK'
        WHEN COALESCE(SUM(s.quantity), 0) < 300 THEN 'BUFFER MENIPIS'
        ELSE 'STOK AMAN'
    END AS status_kesehatan_stok
FROM "Product" p
LEFT JOIN "Stock" s ON s."productId" = p.id
WHERE p."deletedAt" IS NULL
GROUP BY p.id, p.name, p.sku, p.category, p."unitPrice"
ORDER BY total_valuasi_aset DESC;
