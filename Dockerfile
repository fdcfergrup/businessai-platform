# Multi-stage build for BusinessAI
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production && \
    cd server && npm ci --only=production && \
    cd ../client && npm ci

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S businessai -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=businessai:nodejs /app/server ./server
COPY --from=builder --chown=businessai:nodejs /app/client/build ./client/build
COPY --from=builder --chown=businessai:nodejs /app/package*.json ./

# Create uploads directory
RUN mkdir -p uploads && chown businessai:nodejs uploads

# Switch to non-root user
USER businessai

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"]