FROM node:22-alpine AS deps
WORKDIR /app
# Keep dependency manifests in a separate layer so application-only changes
# do not force another installation of the whole dependency graph.
COPY package.json package-lock.json ./
# Preserve downloaded npm tarballs across rebuilds (also when Docker layers
# are rebuilt); npm ci always installs the exact committed lock-file versions.
RUN --mount=type=cache,id=pravopoisk-npm,target=/root/.npm,sharing=locked \
    npm ci --prefer-offline --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Coolify exposes build-time environment variables as Docker build args.
# Default off so an unconfigured production build preserves the old 18 forms.
ARG ENABLE_MILITARY_PUBLIC_DRAFTS=false
ENV ENABLE_MILITARY_PUBLIC_DRAFTS=${ENABLE_MILITARY_PUBLIC_DRAFTS}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "server.js"]
