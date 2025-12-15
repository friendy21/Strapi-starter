# Docker Hub CI/CD - Quick Reference

Quick setup guide for Docker Hub-based GitHub Actions CI/CD.

## 🔐 Required GitHub Secrets

| Secret Name | Value | Where to Get |
|-------------|-------|--------------|
| `DOCKER_HUB_TOKEN` | Your Docker Hub token | Docker Hub → Account Settings → Security |
| `DROPLET_SSH_KEY` | Private SSH key | `cat ~/.ssh/github-actions-deploy` |
| `DROPLET_IP` | `134.209.107.38` | Worker-04 IP address |
| `DROPLET_USER` | SSH username | Usually `root` or `deploy` |
| `NEXT_PUBLIC_STRAPI_URL` | Public URL | `https://yourdomain.com` or `http://134.209.107.38` |

**Add at:** GitHub Repo → Settings → Secrets and variables → Actions

## 🐳 Docker Hub Images

| Service | Image | Pull Command |
|---------|-------|--------------|
| **Strapi** | `friendy21/strapi-starter-backend` | `docker pull friendy21/strapi-starter-backend:latest` |
| **Next.js** | `friendy21/strapi-starter-frontend` | `docker pull friendy21/strapi-starter-frontend:latest` |

## 🚀 Quick Setup

### 1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions-deploy
cat ~/.ssh/github-actions-deploy      # Private key → GitHub Secret
cat ~/.ssh/github-actions-deploy.pub  # Public key → Droplet
```

### 2. Add Public Key to Droplet
```bash
ssh deploy@YOUR_DROPLET_IP
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Update Droplet Configuration
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app

# Backup current config
cp docker-compose.yml docker-compose.yml.backup

# Use production config (pulls from Docker Hub)
cp docker-compose.prod.yml docker-compose.yml

# Configure git
git config --global --add safe.directory /opt/strapi-app
git pull origin main
```

### 4. Add GitHub Secrets
Go to: GitHub → Settings → Secrets and variables → Actions

Add all 5 secrets listed above.

### 5. Push to Deploy
```bash
git add .
git commit -m "feat: add Docker Hub CI/CD"
git push origin main
```

## 📊 Deployment Flow

```
Push to main
    ↓
GitHub Actions builds images
    ↓
Push to Docker Hub
    ├─ friendy21/strapi-starter-backend:latest
    └─ friendy21/strapi-starter-frontend:latest
    ↓
SSH into Droplet
    ↓
Pull images from Docker Hub
    ↓
Restart services
    ↓
✅ Deployment complete
```

## 🔧 Common Commands

### View Images on Droplet
```bash
ssh deploy@YOUR_DROPLET_IP
docker images | grep friendy21
```

### Pull Latest Images Manually
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
docker login -u friendy21
docker pull friendy21/strapi-starter-backend:latest
docker pull friendy21/strapi-starter-frontend:latest
docker-compose down
docker-compose up -d
```

### Check Deployment Status
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
docker-compose ps
docker-compose logs -f
```

### Rollback to Previous Version
```bash
# Use specific commit SHA tag
docker pull friendy21/strapi-starter-backend:sha-abc1234
docker pull friendy21/strapi-starter-frontend:sha-abc1234
# Update docker-compose.yml tags, then restart
docker-compose down && docker-compose up -d
```

## 🆘 Quick Fixes

### Docker Hub Login Failed
```bash
# Verify token in GitHub Secrets
```

### Image Pull Failed
```bash
# Login to Docker Hub on Droplet
ssh deploy@YOUR_DROPLET_IP
docker login -u friendy21
# Enter token when prompted
```

### Services Won't Start
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
docker-compose logs
docker-compose down
docker-compose up -d
```

## 📁 Files

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | Build, push, and deploy workflow |
| `docker-compose.prod.yml` | Production config (uses Docker Hub images) |
| `docker-compose.yml` | Development config (builds locally) |

## 🎯 Workflow Triggers

| Event | Action |
|-------|--------|
| Push to `main` | Build → Push to Docker Hub → Deploy |
| Pull Request | Run tests only |
| Manual | GitHub Actions → Run workflow |

## ✅ Verification Checklist

- [ ] Docker Hub token added to GitHub Secrets
- [ ] SSH key added to GitHub Secrets and Droplet
- [ ] `docker-compose.prod.yml` copied to `docker-compose.yml` on Droplet
- [ ] Git configured on Droplet
- [ ] Workflow pushed to GitHub
- [ ] Deployment successful
- [ ] Images visible on Docker Hub
- [ ] Website accessible

---

**Full Guide:** [Setup Workflow](./.agent/workflows/setup-github-actions-cicd.md)
