# GitHub Actions CI/CD - Quick Reference

Quick commands and checklist for GitHub Actions setup.

## 🔑 SSH Key Setup

```bash
# Generate key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions-deploy

# View private key (for GitHub Secret)
cat ~/.ssh/github-actions-deploy

# View public key (for Droplet)
cat ~/.ssh/github-actions-deploy.pub
```

## 🔐 GitHub Secrets Required

| Secret Name | Value | Where to Get |
|-------------|-------|--------------|
| `DROPLET_SSH_KEY` | Private SSH key | `cat ~/.ssh/github-actions-deploy` |
| `DROPLET_IP` | Droplet IP address | DigitalOcean dashboard |
| `DROPLET_USER` | SSH username | Usually `deploy` |

**Add at:** GitHub Repo → Settings → Secrets and variables → Actions

## 🖥️ Droplet Configuration

```bash
# SSH into Droplet
ssh deploy@YOUR_DROPLET_IP

# Add public key
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Configure git
cd /opt/strapi-app
git config --global --add safe.directory /opt/strapi-app
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git pull origin main
```

## 📋 Workflow Files

| File | Purpose | Trigger |
|------|---------|---------|
| `.github/workflows/deploy.yml` | Automated deployment | Push to `main` |
| `.github/workflows/test.yml` | Testing & linting | Pull requests |

## 🚀 Deployment Flow

```
Push to main
    ↓
GitHub Actions triggered
    ↓
SSH into Droplet
    ↓
Pull latest code
    ↓
Backup database
    ↓
Rebuild & restart services
    ↓
Verify deployment
    ↓
Clean up old images
    ↓
✅ Deployment complete
```

## ✅ Setup Checklist

- [ ] SSH key generated
- [ ] Public key added to Droplet
- [ ] Private key added to GitHub Secrets
- [ ] `DROPLET_IP` secret added
- [ ] `DROPLET_USER` secret added
- [ ] Git configured on Droplet
- [ ] Workflow files committed
- [ ] Test deployment triggered
- [ ] Deployment verified

## 🔍 Monitor Deployment

**GitHub:**
- Go to Actions tab
- Click on running workflow
- Watch real-time logs

**Droplet:**
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
docker-compose ps
docker-compose logs -f
```

## 🆘 Quick Fixes

### SSH Permission Denied
```bash
# On Droplet
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Git Not Configured
```bash
# On Droplet
cd /opt/strapi-app
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git pull origin main
```

### Services Not Starting
```bash
# On Droplet
cd /opt/strapi-app
docker-compose down
docker-compose up -d --build
docker-compose logs
```

## 📊 Workflow Status Badges

Add to `README.md`:

```markdown
![Deploy](https://github.com/USERNAME/REPO/actions/workflows/deploy.yml/badge.svg)
![Test](https://github.com/USERNAME/REPO/actions/workflows/test.yml/badge.svg)
```

## 🎯 Common Tasks

### Manual Deployment
```bash
# GitHub → Actions → Deploy to DigitalOcean Droplet → Run workflow
```

### View Deployment Logs
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
docker-compose logs -f
```

### Rollback Deployment
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
git reset --hard HEAD~1
docker-compose down
docker-compose up -d --build
```

### Update Secrets
```bash
# GitHub → Settings → Secrets and variables → Actions → Update
```

---

**Full Documentation:** [CICD_SETUP.md](../CICD_SETUP.md)
