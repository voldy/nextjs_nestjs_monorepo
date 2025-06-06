# Use the official Node.js 20 alpine image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat git

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files including shared package
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --prod

# Build stage
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all source files including shared package
COPY . .

# Install all dependencies
RUN pnpm install

# Generate Prisma client
RUN pnpm exec prisma generate

# Build the application
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy production dependencies and built app
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

USER nestjs

EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { host: 'localhost', port: process.env.PORT || 8080, path: '/health', timeout: 2000 }; const request = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); request.on('error', () => process.exit(1)); request.end();"

CMD ["node", "dist/main.js"] 
