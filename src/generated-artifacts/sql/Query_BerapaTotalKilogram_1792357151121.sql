SELECT SUM(quantity_kg) AS total_kg
FROM sales
WHERE product_name = 'Majun Warna'
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days';