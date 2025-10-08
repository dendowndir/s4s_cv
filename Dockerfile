# Stage 1: build
FROM node:18-bullseye AS builder
WORKDIR /app

# Install dependencies and build
COPY package.json package-lock.json ./
RUN npm ci && npm prune --omit=dev
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:18-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root system user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Ensure clean environment
RUN rm -rf /app/scripts || true

# Copy runtime essentials
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

USER appuser
EXPOSE 3000

# Start application
CMD ["npx", "next", "start", "-p", "3000"]
