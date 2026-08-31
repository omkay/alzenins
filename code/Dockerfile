# Cloud Run image for the Alzenins platform.
#
# Three stages so the runtime image carries no toolchain, no source and no dev
# dependencies — it is the Next standalone server plus its static assets.

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# ---- dependencies -----------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# No BuildKit cache mount: Cloud Build's docker builder runs the classic
# builder, which ignores --mount and fails outright.
RUN pnpm install --frozen-lockfile

# ---- build ------------------------------------------------------------------
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# APP_URL is baked into the build: metadataBase and the hreflang alternates are
# resolved at build time for the statically rendered pages, so it cannot be
# supplied only at runtime.
ARG APP_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV APP_URL=$APP_URL \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
    NEXT_TELEMETRY_DISABLED=1

# The build validates env at module load, so these must parse. They are
# placeholders only — the real values arrive as Cloud Run secrets at runtime.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build \
    AUTH_SECRET=build-time-placeholder-not-used-at-runtime-000

RUN pnpm build

# ---- runtime ----------------------------------------------------------------
FROM base AS runtime
WORKDIR /app
# PORT is overridden by the host (Render and Cloud Run both inject it).
# HOSTNAME must be 0.0.0.0 or the standalone server binds to localhost only and
# the platform's health check can never reach it.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=8080

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Migrations are applied by a separate step before traffic shifts, so the
# runtime image deliberately has no drizzle-kit and no database credentials
# beyond the connection it serves with.
USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
