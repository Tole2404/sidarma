DELETE FROM audit_logs
WHERE created_at < NOW() - INTERVAL '90 days';