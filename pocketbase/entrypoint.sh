#!/bin/sh
set -e

PB_DATA_DIR=${PB_DATA_DIR:-/pb/pb_data}
PB_HTTP=${PB_HTTP:-http://localhost:8090}

if [ -z "${PB_SUPERUSER_EMAIL}" ] || [ -z "${PB_SUPERUSER_PASSWORD}" ]; then
  echo "[init] Error: PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD must be set."
  exit 1
fi

# Start PocketBase in the background
/pb/pocketbase serve --http=0.0.0.0:8090 --dir="$PB_DATA_DIR" &
PB_PID=$!

# Wait until the API is responsive
echo "[init] Waiting for PocketBase..."
until wget -q -O- "$PB_HTTP/api/health" > /dev/null 2>&1; do
  sleep 1
done
echo "[init] PocketBase is ready"

# Ensure a superuser exists (idempotent — safe to run every boot)
/pb/pocketbase superuser upsert "$PB_SUPERUSER_EMAIL" "$PB_SUPERUSER_PASSWORD" \
  --dir="$PB_DATA_DIR" > /dev/null 2>&1 && echo "[init] Superuser ensured"

# Create collections (skips if already exists)
python3 /pb/scripts/setup.py

# Seed data (skips if collection already has records)
python3 /pb/scripts/seed.py

echo "[init] Done — handing off to PocketBase"
wait $PB_PID
