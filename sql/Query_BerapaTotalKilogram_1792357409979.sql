SELECT 
    product,
    SUM(quantity_kg) AS total_kg
FROM sales
WHERE product = 'Majun Warna'
  AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY product;