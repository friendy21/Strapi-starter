---
description: Complete step-by-step guide to deploy Strapi + Next.js to DigitalOcean Droplet
---

# Deploy to DigitalOcean Droplet - Complete Guide

This workflow provides a comprehensive, step-by-step guide to deploy your Strapi + Next.js application to a DigitalOcean Droplet using Docker Compose.

**Estimated Cost:** $12-18/month (Droplet + optional managed database)
**Estimated Time:** 30-45 minutes

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] DigitalOcean account ([Sign up here](https://www.digitalocean.com/))
- [ ] SSH key pair generated on your local machine
- [ ] Domain name (optional but recommended for SSL)
- [ ] Git repository with your code (GitHub, GitLab, etc.)
- [ ] Basic familiarity with terminal/command line

---

## Part 1: Create and Configure DigitalOcean Droplet

### Step 1: Generate SSH Key (if you don't have one)

**On your local machine:**

```bash
# Windows (PowerShell)
ssh-keygen -t ed25519 -C "your_email@example.com"

# When prompted, save to default location (press Enter)
# Set a passphrase or press Enter for no passphrase

# Display your public key
cat ~/.ssh/id_ed25519.pub
```

Copy the entire output - you'll need this in the next step.

### Step 2: Create a Droplet

1. **Log in to DigitalOcean** → Go to [Create Droplet](https://cloud.digitalocean.com/droplets/new)

2. **Choose Region:**
   - Select the region closest to your target users
   - Recommended: New York, San Francisco, London, Singapore

3. **Choose Image:**
   - Select **Ubuntu 24.04 LTS** (recommended)
   - Alternative: Ubuntu 22.04 LTS

4. **Choose Size:**
   - **Minimum:** Basic Droplet - $12/month (2GB RAM, 1 vCPU, 50GB SSD)
   - **Recommended:** Basic Droplet - $18/month (2GB RAM, 2 vCPU, 60GB SSD)
   - **For production with traffic:** $24/month (4GB RAM, 2 vCPU, 80GB SSD)

5. **Choose Authentication:**
   - Select **SSH Key**
   - Click **New SSH Key**
   - Paste your public key from Step 1
   - Give it a name (e.g., "My Laptop")

6. **Finalize Details:**
   - Hostname: Choose a meaningful name (e.g., `strapi-production`)
   - Tags: Optional (e.g., `production`, `strapi`)
   - Backups: Optional but recommended (+20% cost)

7. **Click "Create Droplet"**

8. **Wait 1-2 minutes** for the Droplet to be created

9. **Copy your Droplet's IP address** (shown in the dashboard)

### Step 3: Configure Firewall (Optional but Recommended)

1. In DigitalOcean dashboard, go to **Networking** → **Firewalls**
2. Click **Create Firewall**
3. Configure rules:
   - **Inbound Rules:**
     - SSH (22) - Your IP address only
     - HTTP (80) - All IPv4, All IPv6
     - HTTPS (443) - All IPv4, All IPv6
   - **Outbound Rules:**
     - All TCP, All UDP, ICMP - All destinations
4. Apply to your Droplet
5. Click **Create Firewall**

---

## Part 2: Initial Server Setup

### Step 4: Connect to Your Droplet

**From your local machine:**

```bash
# Replace YOUR_DROPLET_IP with your actual IP
ssh root@YOUR_DROPLET_IP

# Example:
# ssh root@164.92.123.45

# Type 'yes' when asked about fingerprint
```

You should now be connected to your Droplet as root.

### Step 5: Create a Non-Root User

**On the Droplet (as root):**

```bash
# Create a new user called 'deploy'
adduser deploy

# When prompted:
# - Set a strong password
# - Press Enter for all other fields (or fill them in)

# Grant sudo privileges
usermod -aG sudo deploy

# Add your SSH key to the new user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Switch to the new user
su - deploy
```

You're now logged in as the `deploy` user.

### Step 6: Update System Packages

```bash
# Update package list
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git ufw
```

### Step 7: Configure Firewall (UFW)

```bash
# Allow SSH (IMPORTANT: Do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw --force enable

# Check status
sudo ufw status
```

---

## Part 3: Install Docker and Docker Compose

### Step 8: Install Docker

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run the installation script
sudo sh get-docker.sh

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Clean up
rm get-docker.sh

# Apply group changes (or logout and login again)
newgrp docker

# Verify Docker installation
docker --version
```

Expected output: `Docker version 24.x.x, build...`

### Step 9: Install Docker Compose

```bash
# Download latest Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

Expected output: `Docker Compose version v2.x.x`

---

## Part 4: Deploy Your Application

### Step 10: Clone Your Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository (replace with your repo URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Example:
# git clone https://github.com/johndoe/strapi-starter.git

# Navigate into the project
cd YOUR_REPO
```

**Alternative: If your repository is private:**

```bash
# Generate SSH key on the Droplet
ssh-keygen -t ed25519 -C "deploy@your-droplet"

# Display the public key
cat ~/.ssh/id_ed25519.pub

# Copy this key and add it to your GitHub/GitLab account
# GitHub: Settings → SSH and GPG keys → New SSH key

# Then clone using SSH URL
git clone git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

### Step 11: Run the Deployment Script

```bash
# Make the deployment script executable
chmod +x scripts/deploy-droplet.sh

# Run the deployment script
./scripts/deploy-droplet.sh
```

**What this script does:**
- Installs Docker and Docker Compose (if not already installed)
- Creates `/opt/strapi-app` directory
- Copies all project files there
- Generates secure random secrets for Strapi
- Creates `.env` file from template
- Builds Docker images
- Starts all services (PostgreSQL, Strapi, Next.js, Nginx)

**Expected output:**
```
🚀 Starting Strapi + Next.js Deployment
📦 Updating system packages...
✅ Docker installed
✅ Docker Compose installed
📁 App directory: /opt/strapi-app
📋 Copying project files...
⚙️ Creating .env file from template...
✅ .env file created with generated secrets
⚠️ Please update DATABASE_PASSWORD and NEXT_PUBLIC_STRAPI_URL in .env
🏗️ Building Docker images...
🚀 Starting services...
⏳ Waiting for services to start...
✅ All services are running!
🎉 Deployment complete!
```

### Step 12: Configure Environment Variables

```bash
# Navigate to the app directory
cd /opt/strapi-app

# Edit the .env file
nano .env
```

**Update these critical values:**

1. **DATABASE_PASSWORD** - Change from default to a strong password:
   ```
   DATABASE_PASSWORD=YourSecurePassword123!@#
   ```

2. **NEXT_PUBLIC_STRAPI_URL** - Set to your domain or IP:
   ```
   # If you have a domain:
   NEXT_PUBLIC_STRAPI_URL=https://yourdomain.com
   
   # If using IP only (temporary):
   NEXT_PUBLIC_STRAPI_URL=http://YOUR_DROPLET_IP
   ```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 13: Restart Services with New Configuration

```bash
# Navigate to app directory
cd /opt/strapi-app

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Check if services are running
docker-compose ps
```

All services should show "Up" status.

### Step 14: Verify Deployment

```bash
# Check logs for any errors
docker-compose logs -f

# Press Ctrl+C to exit logs

# Check individual service logs if needed
docker-compose logs strapi
docker-compose logs nextjs
docker-compose logs nginx
```

**Test in your browser:**

1. **Frontend:** `http://YOUR_DROPLET_IP`
2. **Strapi Admin:** `http://YOUR_DROPLET_IP/admin`

---

## Part 5: Domain Configuration (Optional but Recommended)

### Step 15: Point Your Domain to Droplet

**In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):**

1. Go to DNS settings
2. Add/Update these records:

   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | A | @ | YOUR_DROPLET_IP | 3600 |
   | A | www | YOUR_DROPLET_IP | 3600 |

3. Save changes
4. Wait 5-30 minutes for DNS propagation

**Verify DNS propagation:**
```bash
# On your local machine
nslookup yourdomain.com
```

### Step 16: Update Environment for Domain

**On the Droplet:**

```bash
cd /opt/strapi-app
nano .env
```

Update:
```
NEXT_PUBLIC_STRAPI_URL=https://yourdomain.com
```

Save and restart:
```bash
docker-compose down
docker-compose up -d
```

---

## Part 6: SSL Certificate Setup (HTTPS)

### Step 17: Obtain SSL Certificate

**On the Droplet:**

```bash
cd /opt/strapi-app

# Get SSL certificate (replace yourdomain.com with your actual domain)
docker-compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

**Follow the prompts:**
- Enter your email
- Agree to terms of service
- Wait for certificate generation

### Step 18: Update Nginx Configuration for HTTPS

```bash
cd /opt/strapi-app
nano nginx/nginx.conf
```

Find the commented HTTPS section and uncomment it, or ensure your nginx.conf has SSL configuration.

**Restart Nginx:**
```bash
docker-compose restart nginx
```

**Test HTTPS:**
Visit `https://yourdomain.com` in your browser.

---

## Part 7: Post-Deployment Configuration

### Step 19: Create Strapi Admin User

1. Visit `https://yourdomain.com/admin` (or `http://YOUR_DROPLET_IP/admin`)
2. Fill in the admin registration form:
   - First name
   - Last name
   - Email
   - Password (strong password!)
3. Click **Let's start**

### Step 20: Verify API Permissions

The bootstrap function should have configured permissions automatically. To verify:

1. In Strapi admin, go to **Settings** → **Users & Permissions** → **Roles**
2. Click **Public**
3. Ensure these permissions are enabled:
   - **Global:** `find`
   - **Landing-page:** `find`
   - **Page:** `find`
   - **Post:** `find`
   - **Category:** `find`
4. Click **Save** if you made changes

### Step 21: Set Up Automated Backups

**Create backup directory:**
```bash
sudo mkdir -p /opt/backups
sudo chown deploy:deploy /opt/backups
```

**Create backup script:**
```bash
nano ~/backup-database.sh
```

**Add this content:**
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
docker exec strapi-postgres pg_dump -U strapi strapi > "$BACKUP_DIR/db_$DATE.sql"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
```

**Make it executable:**
```bash
chmod +x ~/backup-database.sh
```

**Add to crontab:**
```bash
crontab -e

# Add this line (daily backup at 2 AM):
0 2 * * * /home/deploy/backup-database.sh
```

### Step 22: Set Up Log Rotation

```bash
sudo nano /etc/logrotate.d/docker-compose
```

**Add:**
```
/opt/strapi-app/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

---

## Part 8: Monitoring and Maintenance

### Useful Commands

**View all services:**
```bash
cd /opt/strapi-app
docker-compose ps
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f strapi
docker-compose logs -f nextjs
docker-compose logs -f nginx
```

**Restart services:**
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart strapi
```

**Stop all services:**
```bash
docker-compose down
```

**Start all services:**
```bash
docker-compose up -d
```

**Update application:**
```bash
cd /opt/strapi-app
git pull origin main
docker-compose down
docker-compose up -d --build
```

**Check disk space:**
```bash
df -h
```

**Check memory usage:**
```bash
free -h
```

**Check Docker resource usage:**
```bash
docker stats
```

---

## Troubleshooting

### Issue: Services won't start

```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs strapi

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Issue: Database connection failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Connect to database manually
docker exec -it strapi-postgres psql -U strapi -d strapi
```

### Issue: Out of disk space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Remove old images
docker image prune -a
```

### Issue: Can't access via domain

```bash
# Check DNS propagation
nslookup yourdomain.com

# Check Nginx configuration
docker-compose logs nginx

# Restart Nginx
docker-compose restart nginx
```

### Issue: SSL certificate errors

```bash
# Check certificate status
docker-compose run --rm certbot certificates

# Renew certificate manually
docker-compose run --rm certbot renew

# Check Nginx SSL configuration
docker-compose exec nginx nginx -t
```

---

## Security Best Practices

1. **Change default passwords** - Update all passwords in `.env`
2. **Enable firewall** - Use UFW to restrict access
3. **Regular updates** - Keep system and Docker images updated
4. **Use SSH keys only** - Disable password authentication
5. **Enable automatic security updates:**
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure --priority=low unattended-upgrades
   ```
6. **Monitor logs regularly** - Check for suspicious activity
7. **Set up fail2ban** (optional):
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

---

## Next Steps

- [ ] Set up monitoring (e.g., DigitalOcean Monitoring, Uptime Robot)
- [ ] Configure CDN (e.g., Cloudflare) for better performance
- [ ] Set up automated deployments (CI/CD)
- [ ] Configure email service for Strapi
- [ ] Set up DigitalOcean Spaces for media uploads (optional)
- [ ] Create staging environment
- [ ] Document your content types and API endpoints

---

## Cost Optimization Tips

1. **Use DigitalOcean Spaces** instead of storing media on Droplet
2. **Enable Droplet backups** ($2.40/month for $12 Droplet)
3. **Use Cloudflare** for free CDN and DDoS protection
4. **Monitor resource usage** and resize Droplet if needed
5. **Use reserved IPs** if you plan to rebuild Droplets frequently

---

## Support Resources

- [DigitalOcean Documentation](https://docs.digitalocean.com/)
- [Strapi Documentation](https://docs.strapi.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [DigitalOcean Community](https://www.digitalocean.com/community)

---

**Congratulations! Your Strapi + Next.js application is now live on DigitalOcean! 🎉**
