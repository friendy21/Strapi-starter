#!/bin/bash
# ============================================
# DigitalOcean Droplet Deployment Script
# Run this on your Droplet after initial setup
# ============================================

set -e

echo "🚀 Starting Strapi + Next.js Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Please run as a non-root user with sudo privileges${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
fi

# Create app directory
APP_DIR="/opt/strapi-app"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

echo -e "${YELLOW}📁 App directory: $APP_DIR${NC}"

# Copy files (this script should be run from the project directory)
echo -e "${YELLOW}📋 Copying project files...${NC}"
cp -r . $APP_DIR/

cd $APP_DIR

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️ Creating .env file from template...${NC}"
    cp .env.production.example .env
    
    # Generate random secrets
    JWT_SECRET=$(openssl rand -base64 32)
    ADMIN_JWT_SECRET=$(openssl rand -base64 32)
    API_TOKEN_SALT=$(openssl rand -base64 32)
    TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
    APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
    
    # Update .env with generated secrets
    sed -i "s|your_jwt_secret_here|$JWT_SECRET|g" .env
    sed -i "s|your_admin_jwt_secret_here|$ADMIN_JWT_SECRET|g" .env
    sed -i "s|your_api_token_salt_here|$API_TOKEN_SALT|g" .env
    sed -i "s|your_transfer_token_salt_here|$TRANSFER_TOKEN_SALT|g" .env
    sed -i "s|key1,key2,key3,key4|$APP_KEYS|g" .env
    
    echo -e "${GREEN}✅ .env file created with generated secrets${NC}"
    echo -e "${YELLOW}⚠️ Please update DATABASE_PASSWORD and NEXT_PUBLIC_STRAPI_URL in .env${NC}"
fi

# Create SSL directory
mkdir -p nginx/ssl

# Build and start containers
echo -e "${YELLOW}🏗️ Building Docker images...${NC}"
docker-compose build

echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ All services are running!${NC}"
    echo ""
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    echo ""
    echo "Access your application:"
    echo "  - Frontend: http://$(curl -s ifconfig.me)"
    echo "  - Strapi Admin: http://$(curl -s ifconfig.me)/admin"
    echo ""
    echo "To set up SSL, run:"
    echo "  docker-compose run --rm certbot certonly --webroot -w /var/www/certbot -d your-domain.com"
else
    echo -e "${RED}❌ Some services failed to start. Check logs:${NC}"
    docker-compose logs
    exit 1
fi
