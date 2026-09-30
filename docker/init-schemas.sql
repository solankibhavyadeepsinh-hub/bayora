-- ====================================================================
-- Bayora AI Security Laboratory - Database Schema Isolation Initialization
-- Enforces Pillar 1 (Sandbox Isolation) via strict PostgreSQL schemas
-- ====================================================================

-- 1. Create Distinct Zone Schemas
CREATE SCHEMA IF NOT EXISTS control_plane;
CREATE SCHEMA IF NOT EXISTS red_zone;
CREATE SCHEMA IF NOT EXISTS blue_zone;
CREATE SCHEMA IF NOT EXISTS llm_zone;
CREATE SCHEMA IF NOT EXISTS audit_zone;

-- 2. Define Restricted Zone Service Roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'bayora_red_svc') THEN
        CREATE ROLE bayora_red_svc WITH LOGIN PASSWORD 'red_zone_secure_secret_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'bayora_blue_svc') THEN
        CREATE ROLE bayora_blue_svc WITH LOGIN PASSWORD 'blue_zone_secure_secret_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'bayora_audit_svc') THEN
        CREATE ROLE bayora_audit_svc WITH LOGIN PASSWORD 'audit_zone_secure_secret_2026';
    END IF;
END
$$;

-- 3. Revoke Cross-Zone Access (Default-Deny)
REVOKE ALL ON SCHEMA red_zone FROM PUBLIC, bayora_blue_svc, bayora_audit_svc;
REVOKE ALL ON SCHEMA blue_zone FROM PUBLIC, bayora_red_svc, bayora_audit_svc;
REVOKE ALL ON SCHEMA audit_zone FROM PUBLIC, bayora_red_svc, bayora_blue_svc;

-- 4. Grant Zone-Specific Privileges
GRANT USAGE, CREATE ON SCHEMA red_zone TO bayora_red_svc;
GRANT USAGE, CREATE ON SCHEMA blue_zone TO bayora_blue_svc;
GRANT USAGE, CREATE ON SCHEMA audit_zone TO bayora_audit_svc;
GRANT USAGE ON SCHEMA control_plane TO bayora_red_svc, bayora_blue_svc, bayora_audit_svc;

-- Set default search path
ALTER DATABASE bayora SET search_path TO control_plane, red_zone, blue_zone, llm_zone, audit_zone, public;
