SELECT 
    product_name,
    SUM(quantity_kg) AS total_kg_terjual,
    SUM(total_price) AS total_omzet
FROM sales
WHERE product_name ILIKE '%Majun Warna%'
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY product_name;