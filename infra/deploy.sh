#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/clearoutspace"

echo "▶ Entering app directory…"
cd "$APP_DIR"

echo "▶ Pulling latest image from ghcr.io…"
docker compose pull app

echo "▶ Restarting services…"
docker compose up -d --remove-orphans

echo "▶ Pruning old images…"
docker image prune -f

echo "✅  Deploy complete."
