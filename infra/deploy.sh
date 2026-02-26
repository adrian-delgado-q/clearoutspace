#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# ClearoutSpace – manual redeploy helper (Docker Compose)
#
# GitHub Actions (./github/workflows/deploy.yml) runs these steps automatically
# on every push to main. Use this script only for manual / emergency deploys
# directly on the VPS.
#
# Prerequisites on the VPS:
#   - Docker + Docker Compose plugin
#   - /var/www/clearoutspace/.env populated
#   - docker-compose.yml present in /var/www/clearoutspace/
#   - Logged in to ghcr.io:
#       echo $GHCR_TOKEN | docker login ghcr.io -u GITHUB_USERNAME --password-stdin
# ─────────────────────────────────────────────────────────────────────────────
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
