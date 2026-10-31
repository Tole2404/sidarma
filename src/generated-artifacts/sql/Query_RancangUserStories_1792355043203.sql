-- Tabel acuan API portal
SELECT 
    i.invoice_number,
    i.issue_date,
    i.due_date,
    i.total_amount,
    i.paid_amount,
    (i.total_amount - i.paid_amount) AS outstanding_amount,
    i.payment_status -- 'PAID', 'PARTIAL', 'UNPAID'
FROM invoices i
WHERE i.customer_id = :customer_id
ORDER BY i.issue_date DESC;