SELECT 
    product,
    SUM(quantityKg) AS total_kg,
    COUNT(saleId) AS total_transaksi,
    SUM(total) AS total_omzet
FROM sales
WHERE product = 'Majun Warna'
  AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY product;