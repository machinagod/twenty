-- Forward-only, idempotent normalization to bring a database that is BEHIND the
-- on-disk migrations up to them, WITHOUT removing anything.
--
-- Generated from the drift report of prod vs the migrations reference
-- (see docs/SCHEMA_DRIFT.md). It ONLY adds the columns prod is missing; it never
-- drops prod's extra columns (which are newer main features prod legitimately has).
--
-- SAFE to run repeatedly (ADD COLUMN IF NOT EXISTS / guarded type creation).
-- REVIEW before running against production. This is a stopgap so current code can
-- boot against prod; the real fix is aligning the branch with prod's main and
-- replaying the fork's additions as proper migrations (docs/SCHEMA_DRIFT.md).

BEGIN;

-- objectMetadata.isCustom / fieldMetadata.isCustom  (boolean NOT NULL DEFAULT false)
ALTER TABLE core."objectMetadata" ADD COLUMN IF NOT EXISTS "isCustom" boolean NOT NULL DEFAULT false;
ALTER TABLE core."fieldMetadata"  ADD COLUMN IF NOT EXISTS "isCustom" boolean NOT NULL DEFAULT false;

-- NOTE: `isCustom` defaults to false for every existing row. Custom objects/fields
-- must be back-filled to true as a SEPARATE, idempotent step (do NOT inline
-- data logic in schema DDL). Determine custom-ness the same way the metadata layer
-- does for this version (e.g. absence of a standard definition), then:
--   UPDATE core."objectMetadata" SET "isCustom" = true WHERE <is a custom object>;
--   UPDATE core."fieldMetadata"  SET "isCustom" = true WHERE <is a custom field>;

-- emailingDomain.driver  (enum emailingDomain_driver_enum, NOT NULL)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'emailingDomain_driver_enum' AND n.nspname = 'core'
  ) THEN
    CREATE TYPE core."emailingDomain_driver_enum" AS ENUM ('AWS_SES');
  END IF;
END $$;

-- Added with a default so the NOT NULL is satisfied for any existing rows;
-- AWS_SES is currently the only enum value.
ALTER TABLE core."emailingDomain"
  ADD COLUMN IF NOT EXISTS "driver" core."emailingDomain_driver_enum" NOT NULL DEFAULT 'AWS_SES';

COMMIT;

-- Verify afterwards:
--   packages/twenty-server/scripts/check-schema-drift.sh <db-url>
-- Expect: no MISSING columns (EXTRA columns remain until the branch is aligned).
