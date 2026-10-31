SELECT 
    customer,
    SUM(quantity_kg) AS total_volume_kg,
    SUM(total) AS total_omzet
FROM sales
WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY customer
ORDER BY total_volume_kg DESC
LIMIT 5;