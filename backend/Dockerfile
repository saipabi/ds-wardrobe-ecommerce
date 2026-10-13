# Multi-stage production build for Node.js Express Commerce Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions and typescript configuration
COPY package*.json tsconfig.json ./

# Install dependencies for compilation
RUN npm ci

# Copy source files
COPY src ./src

# Compile TypeScript to dist
RUN npm run build

# --- Production Runner Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Copy package definitions
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Create persistent storage folder
RUN mkdir -p /app/data

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8000/api/health || exit 1

CMD ["node", "dist/index.js"]
