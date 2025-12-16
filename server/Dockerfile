FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments
ARG NODE_ENV=production
ARG DATABASE_CLIENT=postgres

ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_CLIENT=${DATABASE_CLIENT}

# Build the Strapi admin (this handles TypeScript internally)
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 strapi

# Copy package files
COPY --from=builder /app/package*.json ./

# Copy node_modules (need all deps including TypeScript for runtime)
COPY --from=builder /app/node_modules ./node_modules

# Copy source files - Strapi runs from these with TypeScript support
COPY --from=builder /app/config ./config
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/database ./database
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/favicon.png ./favicon.png

# Copy the built admin panel (from dist/build)
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

# Start Strapi - it will use TypeScript files directly
CMD ["npm", "run", "start"]
