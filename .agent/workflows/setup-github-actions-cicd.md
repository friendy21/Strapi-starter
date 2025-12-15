---
description: Set up GitHub Actions CI/CD with Docker Hub for automated deployment
---

# GitHub Actions CI/CD with Docker Hub

This workflow guides you through setting up automated deployment using GitHub Actions and Docker Hub.

## Overview

**How it works:**
1. Push code to GitHub `main` branch
2. GitHub Actions builds Docker images
3. Images pushed to Docker Hub
4. Droplet pulls images and restarts services

**Benefits:**
- ✅ Faster deployments (no building on Droplet)
- ✅ Consistent images across environments
- ✅ Easy rollback to previous versions
- ✅ Reduced Droplet resource usage

## Prerequisites

- [ ] Docker Hub account (username: `friendy21`)
- [ ] Docker Hub access token
- [ ] Application deployed to DigitalOcean Droplet
- [ ] GitHub repository

---

## Part 1: Configure Docker Hub

### Step 1: Create Docker Hub Access Token

1. **Go to [Docker Hub](https://hub.docker.com/)**
2. **Click your profile** → **Account Settings**
3. **Click "Security"** → **"New Access Token"**
4. **Name:** `github-actions-deploy`
5. **Permissions:** Read, Write, Delete
6. **Click "Generate"**
7. **Copy the token** (you won't see it again!)

**Your token:** `YOUR_DOCKER_HUB_TOKEN` (add to GitHub Secrets, not here!)

---

## Part 2: Configure GitHub Secrets

### Step 2: Add GitHub Secrets

1. **Go to your GitHub repository**
2. **Click Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**

**Add these 4 secrets:**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DOCKER_HUB_TOKEN` | `YOUR_DOCKER_HUB_TOKEN` | Docker Hub access token |
| `DROPLET_SSH_KEY` | Your SSH private key | For connecting to Droplet |
| `DROPLET_IP` | Your Droplet IP | e.g., `164.92.123.45` |
| `DROPLET_USER` | `deploy` | SSH username |
| `NEXT_PUBLIC_STRAPI_URL` | `https://yourdomain.com` | Public Strapi URL |

---

## Part 3: Generate SSH Key (if not done)

### Step 3: Create SSH Key for GitHub Actions

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions-deploy

# Display private key (for GitHub Secret)
cat ~/.ssh/github-actions-deploy

# Display public key (for Droplet)
cat ~/.ssh/github-actions-deploy.pub
```

### Step 4: Add Public Key to Droplet

```bash
# SSH into Droplet
ssh deploy@YOUR_DROPLET_IP

# Add public key
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Exit
exit
```

---

## Part 4: Update Droplet Configuration

### Step 5: Update docker-compose.yml on Droplet

**SSH into your Droplet:**

```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
```

**Backup current docker-compose.yml:**

```bash
cp docker-compose.yml docker-compose.yml.backup
```

**Replace with production version:**

```bash
# Pull latest code (includes docker-compose.prod.yml)
git pull origin main

# Use production compose file
cp docker-compose.prod.yml docker-compose.yml

# Or create symlink
ln -sf docker-compose.prod.yml docker-compose.yml
```

**Verify the file:**

```bash
cat docker-compose.yml | grep "image:"
# Should show:
# image: friendy21/strapi-starter-backend:latest
# image: friendy21/strapi-starter-frontend:latest
```

### Step 6: Configure Git on Droplet

```bash
# Still on Droplet
cd /opt/strapi-app

# Configure git
git config --global --add safe.directory /opt/strapi-app

# Verify remote
git remote -v

# If no remote, add it
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Pull latest
git pull origin main
```

---

## Part 5: Test the CI/CD Pipeline

### Step 7: Commit and Push Workflows

**On your local machine:**

```bash
# Check workflow files
ls .github/workflows/
# Should show: deploy.yml, test.yml

# Add all changes
git add .
git commit -m "feat: add Docker Hub CI/CD workflow"

# Push to trigger deployment
git push origin main
```

### Step 8: Monitor Deployment

1. **Go to GitHub** → **Actions** tab
2. **Click on the running workflow**
3. **Watch the progress:**
   - ✅ Build and Push to Docker Hub
   - ✅ Deploy to Droplet

**Expected flow:**
```
Build and Push to Docker Hub (3-5 min)
  ├─ Build Strapi image
  ├─ Push to friendy21/strapi-starter-backend:latest
  ├─ Build Next.js image
  └─ Push to friendy21/strapi-starter-frontend:latest

Deploy to Droplet (1-2 min)
  ├─ SSH into Droplet
  ├─ Backup database
  ├─ Pull images from Docker Hub
  ├─ Restart services
  └─ Verify deployment
```

### Step 9: Verify Deployment

**Check Docker Hub:**
1. Go to [Docker Hub](https://hub.docker.com/)
2. Check repositories:
   - `friendy21/strapi-starter-backend`
   - `friendy21/strapi-starter-frontend`
3. Verify latest tag exists

**Check Droplet:**
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app

# Check running containers
docker-compose ps

# Verify images are from Docker Hub
docker images | grep friendy21

# Check logs
docker-compose logs -f
```

**Check Website:**
- Visit `http://YOUR_DROPLET_IP` or `https://yourdomain.com`
- Verify latest changes are live

---

## Workflow Behavior

### Automatic Deployment

**Triggers:**
- Push to `main` branch
- Manual trigger via GitHub Actions UI

**What happens:**
1. **Build Phase (GitHub Actions):**
   - Checkout code
   - Build Strapi Docker image
   - Build Next.js Docker image
   - Push both images to Docker Hub
   - Tag with `latest` and commit SHA

2. **Deploy Phase (Droplet):**
   - SSH into Droplet
   - Backup database
   - Login to Docker Hub
   - Pull latest images
   - Stop services
   - Start services with new images
   - Verify deployment
   - Cleanup old images

### Automated Testing

**Triggers:**
- Pull requests to `main`
- Push to `develop` branch

**What happens:**
- Lint and build Strapi
- Lint and build Next.js
- Test Docker builds
- Security scanning

---

## Docker Hub Images

Your images are now publicly available:

| Image | Docker Hub URL |
|-------|----------------|
| **Strapi Backend** | `docker pull friendy21/strapi-starter-backend:latest` |
| **Next.js Frontend** | `docker pull friendy21/strapi-starter-frontend:latest` |

**View on Docker Hub:**
- Backend: https://hub.docker.com/r/friendy21/strapi-starter-backend
- Frontend: https://hub.docker.com/r/friendy21/strapi-starter-frontend

---

## Troubleshooting

### ❌ Docker Hub Login Failed

**Error:**
```
Error: Cannot perform an interactive login from a non TTY device
```

**Fix:**
Verify `DOCKER_HUB_TOKEN` secret is set correctly in GitHub.

### ❌ Image Push Failed

**Error:**
```
denied: requested access to the resource is denied
```

**Fix:**
1. Verify Docker Hub token has Write permissions
2. Check repository names match: `friendy21/strapi-starter-backend`

### ❌ Image Pull Failed on Droplet

**Error:**
```
Error response from daemon: pull access denied
```

**Fix:**
```bash
# SSH into Droplet
ssh deploy@YOUR_DROPLET_IP

# Login to Docker Hub manually
docker login -u friendy21

# Test pull
docker pull friendy21/strapi-starter-backend:latest
```

### ❌ Services Won't Start

**Error:**
```
Container exited with code 1
```

**Fix:**
```bash
# Check logs
docker-compose logs strapi
docker-compose logs nextjs

# Verify environment variables
cat .env

# Restart services
docker-compose down
docker-compose up -d
```

---

## Manual Operations

### Pull Latest Images Manually

```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app

# Login to Docker Hub
docker login -u friendy21

# Pull images
docker pull friendy21/strapi-starter-backend:latest
docker pull friendy21/strapi-starter-frontend:latest

# Restart services
docker-compose down
docker-compose up -d
```

### Rollback to Previous Version

```bash
# SSH into Droplet
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app

# Pull specific version (use commit SHA)
docker pull friendy21/strapi-starter-backend:sha-abc1234
docker pull friendy21/strapi-starter-frontend:sha-abc1234

# Update docker-compose.yml to use specific tags
# Then restart
docker-compose down
docker-compose up -d
```

### View Image History

```bash
# On Droplet
docker images | grep friendy21

# Shows all versions with tags
```

---

## Best Practices

1. **Use version tags** - Tag images with commit SHA for rollback
2. **Keep images small** - Use multi-stage builds (already configured)
3. **Scan for vulnerabilities** - Automated in test workflow
4. **Clean up old images** - Automated in deployment
5. **Monitor image sizes** - Check Docker Hub dashboard
6. **Use private repos** - For production (upgrade Docker Hub plan)

---

## Next Steps

- [ ] Test the deployment workflow
- [ ] Verify images on Docker Hub
- [ ] Create a test pull request
- [ ] Set up image scanning alerts
- [ ] Consider private Docker Hub repositories
- [ ] Add deployment notifications

---

**Congratulations! Your Docker Hub CI/CD pipeline is ready! 🎉**

Every push to `main` builds images and deploys automatically.
