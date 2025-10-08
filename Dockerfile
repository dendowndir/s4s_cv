# Stage 1: build
FROM node:18-bullseye AS builder
WORKDIR /app

# Install all dependencies (including dev)
COPY package.json package-lock.json ./
RUN npm ci

# Copy and build
COPY . .
RUN npm run build

# Prune after build (removes dev deps)
RUN npm prune --omit=dev

# Stage 2: runtime
FROM node:18-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root system user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Clean possible script conflicts
RUN rm -rf /app/scripts || true

# Copy only runtime artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

USER appuser
EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
