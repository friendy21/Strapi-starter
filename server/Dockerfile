FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (Strapi needs devDependencies in production for TypeScript)
RUN npm install

# Copy all source files
COPY . .

# Build arguments
ARG NODE_ENV=production
ENV NODE_ENV=production
ENV DATABASE_CLIENT=postgres

# Build admin panel
RUN npm run build

# Expose port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "start"]
