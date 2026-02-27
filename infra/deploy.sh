#!/usr/bin/env bash
# Manual deploy script — useful for hotfixes or bootstrapping.
# Normally CI handles deploys automatically on every push to main.
#
# Usage:
#   IMAGE_TAG=sha-abc1234 ./infra/deploy.sh
#   IMAGE_TAG=latest      ./infra/deploy.sh   # pulls the latest tag
#
set -euo pipefail

: "${IMAGE_TAG:?IMAGE_TAG must be set (e.g. sha-abc1234 or latest)}"

APP_DIR="${APP_DIR:-$HOME/clearoutspace}"

echo "▶ Deploying tag: ${IMAGE_TAG}"
cd "${APP_DIR}"

# Stamp IMAGE_TAG into .env so docker compose picks it up.
# The rest of the .env (secrets, PB creds, etc.) is already on the server.
if grep -q '^IMAGE_TAG=' .env 2>/dev/null; then
  sed -i "s|^IMAGE_TAG=.*|IMAGE_TAG=${IMAGE_TAG}|" .env
else
  echo "IMAGE_TAG=${IMAGE_TAG}" >> .env
fi

echo "▶ Pulling images…"
docker compose -f docker/compose.prod.yml pull

echo "▶ Restarting services…"
docker compose -f docker/compose.prod.yml up -d --remove-orphans

echo "▶ Pruning old images…"
docker image prune -f

echo "✅  Deploy complete (tag: ${IMAGE_TAG})"
