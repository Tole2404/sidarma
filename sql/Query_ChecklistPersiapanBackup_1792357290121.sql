CREATE ROLE backup_user WITH LOGIN PASSWORD 'strong_password';
   GRANT CONNECT ON DATABASE sidarma_db TO backup_user;
   GRANT USAGE ON SCHEMA public TO backup_user;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO backup_user;