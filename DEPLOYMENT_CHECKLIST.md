# DigitalOcean Droplet Deployment Checklist

Quick reference checklist for deploying Strapi + Next.js to DigitalOcean.

## Pre-Deployment

- [ ] DigitalOcean account created
- [ ] SSH key generated (`ssh-keygen -t ed25519`)
- [ ] Domain name purchased (optional)
- [ ] Code pushed to Git repository

## Droplet Setup

- [ ] Droplet created (Ubuntu 24.04, minimum 2GB RAM)
- [ ] SSH key added to Droplet
- [ ] Droplet IP address noted: `_________________`
- [ ] Firewall configured (ports 22, 80, 443)

## Server Configuration

- [ ] Connected via SSH: `ssh root@YOUR_IP`
- [ ] Non-root user created: `adduser deploy`
- [ ] User added to sudo group: `usermod -aG sudo deploy`
- [ ] SSH keys copied to new user
- [ ] System updated: `sudo apt update && sudo apt upgrade -y`
- [ ] UFW firewall configured and enabled

## Docker Installation

- [ ] Docker installed: `curl -fsSL https://get.docker.com | sh`
- [ ] User added to docker group: `sudo usermod -aG docker $USER`
- [ ] Docker Compose installed
- [ ] Docker version verified: `docker --version`

## Application Deployment

- [ ] Repository cloned: `git clone YOUR_REPO_URL`
- [ ] Deployment script executed: `./scripts/deploy-droplet.sh`
- [ ] `.env` file configured in `/opt/strapi-app`
- [ ] `DATABASE_PASSWORD` updated
- [ ] `NEXT_PUBLIC_STRAPI_URL` updated
- [ ] Services restarted: `docker-compose up -d --build`
- [ ] All containers running: `docker-compose ps`

## Domain & SSL (if applicable)

- [ ] DNS A records configured:
  - `@` → Droplet IP
  - `www` → Droplet IP
- [ ] DNS propagation verified: `nslookup yourdomain.com`
- [ ] SSL certificate obtained via Certbot
- [ ] Nginx configured for HTTPS
- [ ] HTTPS working: `https://yourdomain.com`

## Strapi Configuration

- [ ] Admin user created at `/admin`
- [ ] Admin credentials saved securely
- [ ] Public API permissions verified
- [ ] Content types accessible via API

## Backups & Monitoring

- [ ] Backup directory created: `/opt/backups`
- [ ] Backup script created and tested
- [ ] Cron job configured for daily backups
- [ ] Log rotation configured
- [ ] Monitoring set up (optional)

## Security

- [ ] All default passwords changed
- [ ] Firewall rules verified
- [ ] SSH password authentication disabled (optional)
- [ ] Fail2ban installed (optional)
- [ ] Automatic security updates enabled

## Testing

- [ ] Frontend accessible: `http(s)://YOUR_DOMAIN`
- [ ] Strapi admin accessible: `http(s)://YOUR_DOMAIN/admin`
- [ ] API endpoints working
- [ ] No errors in logs: `docker-compose logs`

## Documentation

- [ ] Deployment details documented
- [ ] Credentials stored in password manager
- [ ] Team notified of deployment
- [ ] Monitoring alerts configured

---

## Quick Commands Reference

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update application
cd /opt/strapi-app && git pull && docker-compose up -d --build

# Backup database manually
docker exec strapi-postgres pg_dump -U strapi strapi > backup.sql

# Check disk space
df -h

# Check memory
free -h

# View running containers
docker-compose ps
```

---

## Emergency Contacts

- **Droplet IP:** `_________________`
- **Domain:** `_________________`
- **Admin Email:** `_________________`
- **DigitalOcean Support:** https://cloud.digitalocean.com/support

---

**Deployment Date:** `_________________`
**Deployed By:** `_________________`
**Notes:** `_________________`
