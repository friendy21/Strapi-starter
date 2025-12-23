FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm install

# Copy all source files
COPY . .

# Build environment
ENV NODE_ENV=development

# Expose port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "develop"]
