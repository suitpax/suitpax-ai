# Dockerfile for Suitpax AI Monorepo
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.0.0

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install pnpm
RUN npm install -g pnpm@8.0.0

# Build packages first
RUN pnpm run build --filter=@suitpax/utils
RUN pnpm run build --filter=@suitpax/ui
RUN pnpm run build --filter=@suitpax/domains
RUN pnpm run build --filter=@suitpax/shared

# Build applications
RUN pnpm run build --filter=@suitpax/web
RUN pnpm run build --filter=@suitpax/dashboard

# Production image, copy all the files and run next
FROM base AS web-runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=builder /app/apps/web/.next/standalone ./web/
COPY --from=builder /app/apps/web/.next/static ./web/.next/static
COPY --from=builder /app/apps/web/public ./web/public

# Copy built dashboard
COPY --from=builder /app/apps/dashboard/.next/standalone ./dashboard/
COPY --from=builder /app/apps/dashboard/.next/static ./dashboard/.next/static
COPY --from=builder /app/apps/dashboard/public ./dashboard/public

USER nextjs

EXPOSE 3000 3001

CMD ["node", "web/server.js"]

# Dashboard runner
FROM base AS dashboard-runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/public ./public

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]