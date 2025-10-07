# Dockerfile
# Stage 1: build
FROM node:18-bullseye AS builder
WORKDIR /app

# Install build deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
# If your project uses environment variables at build time, they must be provided here via --build-arg or CI.
RUN npm run build

# Stage 2: runtime
FROM node:18-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only what is needed for runtime
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built files and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# start in production
CMD ["npx", "next", "start", "-p", "3000"]
