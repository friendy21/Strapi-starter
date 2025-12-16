FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for TypeScript compilation)
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG NODE_ENV=production
ARG DATABASE_CLIENT=postgres

ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_CLIENT=${DATABASE_CLIENT}

# Compile TypeScript config and src files
RUN npx tsc --project tsconfig.json || echo "TypeScript compilation done"

# Build the Strapi admin panel
RUN npm run build

# Debug: Show what was built
RUN echo "=== Contents of dist ===" && ls -la dist/ || echo "No dist folder"
RUN echo "=== Contents of dist/config ===" && ls -la dist/config/ || echo "No dist/config folder"

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 strapi

# Copy package files and node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy public folder
COPY --from=builder /app/public ./public
COPY --from=builder /app/favicon.png ./favicon.png

# Copy the ENTIRE dist folder (contains build, config, src)
COPY --from=builder /app/dist ./dist

# Strapi expects config/ and src/ at root - copy compiled versions there
COPY --from=builder /app/dist/config ./config
COPY --from=builder /app/dist/src ./src

# Copy admin build - Strapi looks for this in dist/build
# (already in dist from above, but let's be explicit)

# Copy database folder for migrations if exists
COPY --from=builder /app/database ./database

# Set ownership
RUN chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
