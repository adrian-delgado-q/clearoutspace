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

ENV_FILE="/opt/clearoutspaces/.env"
APP_DIR="${APP_DIR:-$HOME/clearoutspace}"
GHCR_USERNAME="${GHCR_USERNAME:-$(grep '^GHCR_USERNAME=' "${ENV_FILE}" | cut -d= -f2)}"

echo "▶ Deploying tag: ${IMAGE_TAG}"
cd "${APP_DIR}"

# Update dynamic deploy vars in the server secrets file.
# Remove stale values first to avoid duplicates, then append current ones.
sed -i '/^GHCR_USERNAME=/d;/^IMAGE_TAG=/d' "${ENV_FILE}"
printf 'GHCR_USERNAME=%s\nIMAGE_TAG=%s\n' "${GHCR_USERNAME}" "${IMAGE_TAG}" >> "${ENV_FILE}"

# --env-file resolves ${VAR} substitutions in the compose file (e.g. image names).
# env_file: in each service handles runtime injection inside containers.
echo "▶ Pulling images…"
docker compose --env-file "${ENV_FILE}" -f docker/compose.prod.yml pull

echo "▶ Restarting services…"
docker compose --env-file "${ENV_FILE}" -f docker/compose.prod.yml up -d --remove-orphans

echo "▶ Pruning old images…"
docker image prune -f

echo "✅  Deploy complete (tag: ${IMAGE_TAG})"
