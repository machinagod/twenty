#!/bin/sh
set -e

setup_and_migrate_db() {
    if [ "${DISABLE_DB_MIGRATIONS}" = "true" ]; then
        echo "Database setup and migrations are disabled, skipping..."
        return
    fi

    echo "Running database setup and migrations..."

    # Migration DDL (e.g. adding a generated column to a large table) can take far
    # longer than the runtime query timeout, so only these commands get a longer one.
    migration_timeout_ms="${UPGRADE_PG_DATABASE_TIMEOUT_MS:-600000}"

    # Run setup and migration scripts
    has_schema=$(psql -tAc "SELECT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'core')" ${PG_DATABASE_URL})
    if [ "$has_schema" = "f" ]; then
        echo "Database appears to be empty, running migrations."
        PG_DATABASE_PRIMARY_TIMEOUT_MS="$migration_timeout_ms" yarn database:init:prod
    fi

    if ! yarn command:prod cache:flush; then
        echo "Warning: Failed to flush cache before upgrade, but continuing startup..."
    fi

    # A half-migrated database serves 500s while /healthz stays green, so a failed
    # upgrade must stop the container and fail the deploy.
    if ! PG_DATABASE_PRIMARY_TIMEOUT_MS="$migration_timeout_ms" yarn command:prod upgrade; then
        if [ "${UPGRADE_CONTINUE_ON_ERROR}" = "true" ]; then
            echo "Warning: Upgrade completed with errors. Continuing because UPGRADE_CONTINUE_ON_ERROR=true. Check logs for details."
        else
            echo "Error: Upgrade failed. Refusing to start on a partially migrated database. Set UPGRADE_CONTINUE_ON_ERROR=true to override."
            exit 1
        fi
    fi

    if ! yarn command:prod cache:flush; then
        echo "Warning: Failed to flush cache after upgrade, but continuing startup..."
    fi

    echo "Successfully migrated DB!"
}

register_background_jobs() {
    if [ "${DISABLE_CRON_JOBS_REGISTRATION}" = "true" ]; then
        echo "Cron job registration is disabled, skipping..."
        return
    fi

    echo "Registering background sync jobs..."
    if yarn command:prod cron:register:all; then
        echo "Successfully registered all background sync jobs!"
    else
        echo "Warning: Failed to register background jobs, but continuing startup..."
    fi
}

setup_and_migrate_db
register_background_jobs

# Continue with the original Docker command
exec "$@"
