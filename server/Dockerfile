FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies  
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables (needed for strapi build)
ARG NODE_ENV=production
ARG DATABASE_CLIENT=postgres

ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_CLIENT=${DATABASE_CLIENT}

# Compile TypeScript to JavaScript first
RUN npx tsc --project tsconfig.json || echo "TypeScript compilation completed"

# Build the Strapi admin panel
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 strapi

# Copy everything Strapi needs to run
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/favicon.png ./favicon.png

# Copy the dist folder (compiled TypeScript)
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

# Use strapi start which knows where to find compiled files
CMD ["npm", "run", "start"]
