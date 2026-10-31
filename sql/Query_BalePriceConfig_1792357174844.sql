SELECT 
    s.id AS supplier_id,
    s.nama_supplier,
    COUNT(p.id) AS total_partai,
    AVG(p.harga_beli_bal) AS rata_rata_harga_bal
FROM supplier s
JOIN pembelian_bal p ON s.id = p.supplier_id
GROUP BY s.id, s.nama_supplier
ORDER BY rata_rata_harga_bal ASC;