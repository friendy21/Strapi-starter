# Quick Start: Deploy to DigitalOcean Droplet

**Get your Strapi + Next.js app live in 30-45 minutes for $12-18/month**

![Deployment Workflow](C:/Users/HP/.gemini/antigravity/brain/3c70fdec-d16a-4219-9715-bc81c9473c4e/deployment_workflow_visual_1765816264010.png)

## 📋 Prerequisites (5 minutes)

- [ ] DigitalOcean account → [Sign up](https://www.digitalocean.com/)
- [ ] SSH key generated → Run: `ssh-keygen -t ed25519`
- [ ] Domain name (optional for SSL)

## 🚀 Deployment Steps

### 1️⃣ Create Droplet (5 minutes)

1. Go to [DigitalOcean Droplets](https://cloud.digitalocean.com/droplets/new)
2. Choose:
   - **Image:** Ubuntu 24.04 LTS
   - **Size:** Basic $12/month (2GB RAM)
   - **Authentication:** Add your SSH key
3. Click **Create Droplet**
4. Copy the IP address

### 2️⃣ Initial Setup (10 minutes)

```bash
# Connect to your Droplet
ssh root@YOUR_DROPLET_IP

# Create non-root user
adduser deploy
usermod -aG sudo deploy

# Copy SSH keys
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh

# Switch to deploy user
su - deploy

# Update system
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 3️⃣ Install Docker (5 minutes)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
rm get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Apply group changes
newgrp docker

# Verify
docker --version
docker-compose --version
```

### 4️⃣ Deploy Application (10 minutes)

```bash
# Clone your repository
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Run deployment script
chmod +x scripts/deploy-droplet.sh
./scripts/deploy-droplet.sh

# Configure environment
cd /opt/strapi-app
nano .env
```

**Update these values in `.env`:**
```bash
DATABASE_PASSWORD=YourSecurePassword123!
NEXT_PUBLIC_STRAPI_URL=http://YOUR_DROPLET_IP
```

**Restart services:**
```bash
docker-compose down
docker-compose up -d --build
```

### 5️⃣ Verify Deployment (2 minutes)

```bash
# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f
```

**Test in browser:**
- Frontend: `http://YOUR_DROPLET_IP`
- Strapi Admin: `http://YOUR_DROPLET_IP/admin`

### 6️⃣ Setup Domain & SSL (Optional, 10 minutes)

**Configure DNS:**
1. Go to your domain registrar
2. Add A records:
   - `@` → `YOUR_DROPLET_IP`
   - `www` → `YOUR_DROPLET_IP`
3. Wait 5-30 minutes for propagation

**Update environment:**
```bash
cd /opt/strapi-app
nano .env
# Change: NEXT_PUBLIC_STRAPI_URL=https://yourdomain.com
```

**Get SSL certificate:**
```bash
docker-compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email your-email@example.com \
  --agree-tos
```

**Restart services:**
```bash
docker-compose down
docker-compose up -d
```

## ✅ Post-Deployment

### Create Strapi Admin
1. Visit `https://yourdomain.com/admin`
2. Create your admin account
3. Verify API permissions are set

### Setup Backups
```bash
# Create backup directory
sudo mkdir -p /opt/backups
sudo chown deploy:deploy /opt/backups

# Create backup script
cat > ~/backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
docker exec strapi-postgres pg_dump -U strapi strapi > "$BACKUP_DIR/db_$DATE.sql"
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
EOF

chmod +x ~/backup-database.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/deploy/backup-database.sh") | crontab -
```

## 🔧 Useful Commands

```bash
# View all services
cd /opt/strapi-app && docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update application
git pull origin main
docker-compose down
docker-compose up -d --build

# Backup database manually
docker exec strapi-postgres pg_dump -U strapi strapi > backup.sql

# Check disk space
df -h

# Check memory
free -h
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to Droplet | Check firewall, verify SSH key, use DigitalOcean console |
| 502 Bad Gateway | Check logs: `docker-compose logs`, restart: `docker-compose restart` |
| Container won't start | Check disk space: `df -h`, rebuild: `docker-compose up -d --build` |
| Database connection failed | Verify .env credentials, restart: `docker-compose restart postgres` |
| SSL certificate failed | Verify DNS propagation: `nslookup yourdomain.com` |

**For detailed troubleshooting:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📚 Full Documentation

For comprehensive guides, see:

- **[Complete Deployment Workflow](./.agent/workflows/deploy-digitalocean-droplet.md)** - Step-by-step with explanations
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Track your progress
- **[Architecture Guide](./ARCHITECTURE.md)** - Understand the system
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues and solutions

## 💡 Tips

1. **Use strong passwords** for database and admin
2. **Enable backups** in DigitalOcean ($2.40/month)
3. **Set up monitoring** with UptimeRobot (free)
4. **Use Cloudflare** for free CDN and DDoS protection
5. **Document your setup** - save credentials securely

## 📊 Cost Breakdown

| Item | Cost |
|------|------|
| Droplet (2GB RAM) | $12/month |
| Backups (optional) | $2.40/month |
| Domain (optional) | $10-15/year |
| SSL Certificate | Free (Let's Encrypt) |
| **Total** | **$12-18/month** |

## 🎉 Success!

Your Strapi + Next.js application is now live! 

**Next steps:**
- [ ] Set up monitoring
- [ ] Configure CDN (Cloudflare)
- [ ] Set up CI/CD for automated deployments
- [ ] Add content to Strapi
- [ ] Customize your Next.js frontend

---

**Need help?** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) or visit the [DigitalOcean Community](https://www.digitalocean.com/community).
