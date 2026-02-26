# ── Stage 1: install all dependencies ────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (uses the schema, not a live DB)
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ── Stage 3: production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Standalone output contains a self-contained server.js + trimmed node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

# Add Prisma generated client (needed by the app at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Install Prisma CLI with its full dependency tree into the standalone node_modules.
# Running without --ignore-scripts allows the postinstall to download the correct
# linux-musl engine binaries (schema-engine + query-engine) at image-build time.
COPY package.json package-lock.json ./
RUN npm install prisma \
    && npm cache clean --force \
    && chown -R nextjs:nodejs /app/node_modules/@prisma /app/node_modules/prisma

COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Migrate then start (server.js is the standalone Next.js entrypoint)
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node server.js"]
