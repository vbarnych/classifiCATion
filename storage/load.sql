CREATE USER fresco WITH PASSWORD 'fresco';
CREATE DATABASE classification OWNER fresco;
psql -U fresco -d classification -a -f cats.sql
