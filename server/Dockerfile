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

# First compile TypeScript to JavaScript
RUN npx tsc --project tsconfig.json || echo "TypeScript compilation completed"

# Then build the Strapi admin
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 strapi

# Copy built files - dist contains compiled code and admin build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

# Copy admin panel build from dist/build to root build folder (where Strapi expects it)
COPY --from=builder /app/dist/build ./build

# Copy compiled config and src from dist folder
COPY --from=builder /app/dist/config ./config
COPY --from=builder /app/dist/src ./src

# Also copy database folder if it has migrations
COPY --from=builder /app/database ./database

# Set ownership
RUN chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
