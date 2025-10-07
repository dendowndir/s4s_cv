# Stage 1: build
FROM node:18-bullseye AS builder
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:18-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root system user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy only runtime dependencies
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Copy built files and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json package-lock.json ./  # needed for runtime scripts

# Set ownership
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

# Start in production
CMD ["npx", "next", "start", "-p", "3000"]
