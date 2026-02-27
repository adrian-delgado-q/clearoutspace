# Server Setup Guide

One-time bootstrap for a fresh VPS. After this, every push to `main` deploys automatically via GitHub Actions.

## Prerequisites

```bash
# Install Docker + Compose plugin (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out and back in after this
```

## 1 — Clone the repo

```bash
git clone https://github.com/<your-org>/clearoutspace.git ~/clearoutspace
cd ~/clearoutspace
```

## 2 — Create the `.env` file

```bash
nano .env   # create from scratch — see the variable table below
```

Required variables:

| Variable | Description |
|---|---|
| `GHCR_USERNAME` | Your GitHub username / org (owner of the GHCR images) |
| `IMAGE_TAG` | Image tag to run — CI keeps this current; set to `latest` initially |
| `NEXT_PUBLIC_PB_URL` | Public PocketBase URL, e.g. `https://cms.clearoutspaces.ca` |
| `PB_SUPERUSER_EMAIL` | PocketBase admin email |
| `PB_SUPERUSER_PASSWORD` | PocketBase admin password |
| `TUNNEL_TOKEN` | Cloudflare tunnel token (see step 3) |

`PB_INTERNAL_URL` is set directly in `docker-compose.yml` and does **not** belong in `.env`.

## 3 — Create the Cloudflare Tunnel

1. **Cloudflare dashboard** → Zero Trust → Networks → Tunnels → **Create a tunnel**
2. Name it `clearoutspace`, copy the **tunnel token**
3. Add two public hostnames in the tunnel config:
   - `clearoutspaces.ca` → `http://localhost:3000`
   - `cms.clearoutspaces.ca` → `http://localhost:8090`
4. Paste the token as `TUNNEL_TOKEN` in `.env`

> Cloudflare handles TLS termination. No reverse proxy, no certificates to manage on the server.

## 4 — Add GitHub Actions secrets

In the repo → **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|---|---|
| `VPS_HOST` | Server IP or hostname |
| `VPS_USER` | SSH user (e.g. `ubuntu`) |
| `VPS_SSH_KEY` | Private SSH key (the public key must be in `~/.ssh/authorized_keys` on the server) |
| `VPS_PORT` | SSH port (optional, defaults to 22) |
| `APP_ENV_FILE` | The entire contents of your `.env` file |

> `APP_ENV_FILE` is the single source of truth for all runtime config. CI writes it to `~/clearoutspace/.env` on every deploy — you never need to touch the server's .env manually after this.

## 5 — First run

```bash
cd ~/clearoutspace

# (If GHCR packages are private, log in first)
# echo $GITHUB_PAT | docker login ghcr.io -u <username> --password-stdin

docker compose -f docker/compose.prod.yml pull
docker compose -f docker/compose.prod.yml up -d
docker compose -f docker/compose.prod.yml logs -f   # watch startup
```

PocketBase will automatically create the superuser and seed collections on first boot (see `pocketbase/entrypoint.sh`).

## 6 — Verify

- `https://clearoutspaces.ca` → Next.js app
- `https://cms.clearoutspaces.ca/_/` → PocketBase admin UI

## Useful commands

```bash
# View running containers
docker compose -f docker/compose.prod.yml ps

# Tail all logs
docker compose -f docker/compose.prod.yml logs -f

# Tail a single service
docker compose -f docker/compose.prod.yml logs -f app

# Manual deploy (normally CI handles this)
IMAGE_TAG=sha-abc1234 ./infra/deploy.sh

# Restart a single service without redeploying
docker compose -f docker/compose.prod.yml restart app

# Open a shell in the pocketbase container
docker compose -f docker/compose.prod.yml exec pocketbase sh
```
