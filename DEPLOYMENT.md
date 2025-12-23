# DigitalOcean Deployment Guide

Complete guide for deploying your Strapi + Next.js application to DigitalOcean.

## Table of Contents
- [Option 1: Droplet with Docker Compose](#option-1-droplet-with-docker-compose)
- [Option 2: App Platform](#option-2-app-platform)
- [Post-Deployment Steps](#post-deployment-steps)

---

## Option 1: Droplet with Docker Compose

**Cost: ~$12-18/month** (Droplet + optional managed DB)

### Prerequisites
- DigitalOcean account
- Domain name (optional but recommended)
- Git repository with your code

### Step 1: Create a Droplet

1. Go to [DigitalOcean Droplets](https://cloud.digitalocean.com/droplets)
2. Create a new Droplet:
   - **Image**: Ubuntu 24.04 LTS
   - **Size**: Basic $12/month (2GB RAM, 1 vCPU)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH Key (recommended)
3. Note your Droplet's IP address

### Step 2: Initial Server Setup

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Create a non-root user
adduser deploy
usermod -aG sudo deploy

# Switch to new user
su - deploy
```

### Step 3: Clone and Deploy

```bash
# Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Make deploy script executable and run it
chmod +x scripts/deploy-droplet.sh
./scripts/deploy-droplet.sh
```

### Step 4: Configure Environment

Edit `.env` file in `/opt/strapi-app`:
```bash
cd /opt/strapi-app
nano .env
```

Update these values:
- `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` - Set strong, unique values
- `APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT` - Required secrets (replace all placeholders; generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_STRAPI_URL` - Your domain (e.g., `https://yourdomain.com`)

### Step 5: Set Up SSL (Optional but Recommended)

```bash
# Get SSL certificate
docker-compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d yourdomain.com \
  -d www.yourdomain.com

# Update nginx.conf to enable HTTPS
# Then restart nginx
docker-compose restart nginx
```

### Step 6: Point Your Domain

Add DNS records:
- **A Record**: `@` → Your Droplet IP
- **A Record**: `www` → Your Droplet IP

---

## Option 2: App Platform

**Cost: ~$25-30/month** (Services + Managed DB)

### Prerequisites
- DigitalOcean account
- GitHub repository with your code

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 2: Update App Spec

Edit `.do/app.yaml`:
- Replace `your-username/your-repo` with your GitHub repo
- Update secret values (generate with `openssl rand -base64 32`)

### Step 3: Deploy via CLI

```bash
# Install doctl
# Mac: brew install doctl
# Windows: scoop install doctl

# Authenticate
doctl auth init

# Create app
doctl apps create --spec .do/app.yaml
```

### Step 4: Deploy via Dashboard (Alternative)

1. Go to [App Platform](https://cloud.digitalocean.com/apps)
2. Click **Create App**
3. Select your GitHub repo
4. Choose **Use App Spec** and upload `.do/app.yaml`
5. Review and deploy

### Step 5: Configure Custom Domain

1. In App Platform, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS with provided records

---

## Post-Deployment Steps

### 1. Create Strapi Admin User

Visit `https://yourdomain.com/admin` and create your first admin account.

### 2. Verify Public Permissions

The bootstrap function should have set up permissions automatically. If not:
1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Enable `find` for: Global, Landing-page, Page, Post, Category

### 3. Set Up Backups (Droplet Only)

```bash
# Add to crontab
crontab -e

# Daily database backup at 2 AM
0 2 * * * docker exec strapi-postgres pg_dump -U strapi strapi > /opt/backups/db-$(date +\%Y\%m\%d).sql
```

### 4. Monitor Logs

```bash
# Droplet: View logs
docker-compose logs -f

# App Platform: View in dashboard or
doctl apps logs your-app-id
```

---

## Files Created

| File | Purpose |
|------|---------|
| `server/Dockerfile` | Strapi production build |
| `client/Dockerfile` | Next.js production build |
| `docker-compose.yml` | Full stack orchestration |
| `nginx/nginx.conf` | Reverse proxy config |
| `.do/app.yaml` | App Platform specification |
| `.env.production.example` | Environment template |
| `scripts/deploy-droplet.sh` | Automated deployment |

---

## Troubleshooting

### Container won't start
```bash
docker-compose logs strapi
docker-compose logs nextjs
```

### Database connection issues
```bash
docker exec -it strapi-postgres psql -U strapi -d strapi
```

### Permission denied
```bash
sudo chown -R $USER:$USER /opt/strapi-app
```

### SSL certificate issues
```bash
docker-compose run --rm certbot certificates
```
