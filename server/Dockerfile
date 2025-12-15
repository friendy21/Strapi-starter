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

# Build arguments for environment variables
ARG NODE_ENV=production
ARG DATABASE_CLIENT=postgres
ARG DATABASE_HOST
ARG DATABASE_PORT=5432
ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG JWT_SECRET
ARG ADMIN_JWT_SECRET
ARG APP_KEYS
ARG API_TOKEN_SALT
ARG TRANSFER_TOKEN_SALT

ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_CLIENT=${DATABASE_CLIENT}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV JWT_SECRET=${JWT_SECRET}
ENV ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
ENV APP_KEYS=${APP_KEYS}
ENV API_TOKEN_SALT=${API_TOKEN_SALT}
ENV TRANSFER_TOKEN_SALT=${TRANSFER_TOKEN_SALT}

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 strapi

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database

# Set ownership
RUN chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
