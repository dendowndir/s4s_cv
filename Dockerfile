FROM node:22.21.1-alpine3.21 AS builder

# Install build dependencies (only in builder)
RUN apk add --no-cache python3 make g++ git libc6-compat

WORKDIR /app

# Copy lockfiles first to leverage Docker layer cache for dependencies
COPY package.json package-lock.json ./

# Install all deps (including dev) for building
RUN npm ci --silent

# Copy source & build
COPY . .

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Remove dev dependencies to prepare a smaller node_modules for copying
# Use npm prune with --omit=dev if available, fallback to --production
RUN if npm help prune >/dev/null 2>&1; then npm prune --omit=dev || npm prune --production; fi

# Final runtime image
FROM node:22.21.1-alpine3.21 AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Create non-root user (Alpine flags)
RUN addgroup -S appgroup && adduser -S -G appgroup appuser

# Copy only the runtime artifacts from the builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

USER appuser

EXPOSE 3000

# Use Next's CLI directly from node_modules to avoid running npm in production
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]