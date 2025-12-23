# GitHub Actions CI/CD Setup Guide

Complete guide to set up automated deployment using GitHub Actions and Docker Hub.

## 📋 Overview

This setup enables:

- ✅ **Automatic deployment** when you push to `main` branch
- ✅ **Docker Hub integration** - Images built on GitHub, pulled on Droplet
- ✅ **Automated testing** on pull requests
- ✅ **Security scanning** with Trivy
- ✅ **Database backups** before each deployment
- ✅ **Automatic rollback** if deployment fails
- ✅ **Version tagging** with commit SHA

## 🐳 How It Works

**Traditional Approach (Slow):**
```
Push code → Droplet builds images → Deploy
(5-10 minutes, uses Droplet resources)
```

**Docker Hub Approach (Fast):**
```
Push code → GitHub builds images → Push to Docker Hub → Droplet pulls images → Deploy
(3-5 minutes, Droplet just pulls pre-built images)
```

**Your Docker Hub Images:**
- Backend: `friendy21/strapi-starter-backend:latest`
- Frontend: `friendy21/strapi-starter-frontend:latest`

## 🚀 Quick Setup (10 minutes)

### Step 1: Configure Docker Hub Token

You already have your Docker Hub credentials:
- **Username:** `friendy21`
- **Token:** `YOUR_DOCKER_HUB_TOKEN` (the one you generated)

### Step 2: Generate SSH Key for GitHub Actions

**On your local machine:**

```bash
# Generate a dedicated SSH key for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions-deploy

# Display the private key (you'll add this to GitHub)
cat ~/.ssh/github-actions-deploy

# Display the public key (you'll add this to your Droplet)
cat ~/.ssh/github-actions-deploy.pub
```

### Step 3: Add Public Key to Your Droplet

**SSH into your Droplet:**

```bash
ssh deploy@YOUR_DROPLET_IP

# Add the public key to authorized_keys
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

# Verify permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Step 4: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these **5 secrets**:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `DOCKER_HUB_TOKEN` | Docker Hub access token | `YOUR_DOCKER_HUB_TOKEN` |
| `DROPLET_SSH_KEY` | Private key from Step 2 | Contents of `~/.ssh/github-actions-deploy` |
| `DROPLET_IP` | Your Droplet's IP address | `164.92.123.45` |
| `DROPLET_USER` | SSH username on Droplet | `deploy` |
| `NEXT_PUBLIC_STRAPI_URL` | Public Strapi URL | `https://yourdomain.com` |

**How to add secrets:**

```
Secret: DROPLET_SSH_KEY
Value: 
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
... (rest of your private key)
-----END OPENSSH PRIVATE KEY-----
```

```
Secret: DROPLET_IP
Value: 164.92.123.45
```

```
Secret: DROPLET_USER
Value: deploy
```

### Step 4: Ensure Git is Configured on Droplet

**SSH into your Droplet:**

```bash
ssh deploy@YOUR_DROPLET_IP

# Navigate to app directory
cd /opt/strapi-app

# Initialize git if not already done
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Or if already initialized, verify remote
git remote -v

# Configure git to allow directory ownership
git config --global --add safe.directory /opt/strapi-app

# Pull latest code
git pull origin main
```

### Step 5: Test the Workflow

**Push a change to trigger deployment:**

```bash
# On your local machine
git add .
git commit -m "test: trigger CI/CD deployment"
git push origin main
```

**Monitor the deployment:**

1. Go to your GitHub repository
2. Click **Actions** tab
3. Watch the workflow run in real-time

## 📁 Workflow Files

### Deployment Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual trigger via GitHub Actions UI

**What it does:**
1. Checks out code
2. Sets up SSH connection to Droplet
3. Pulls latest code on Droplet
4. Creates database backup
5. Stops services
6. Rebuilds and restarts services
7. Verifies deployment
8. Cleans up old Docker images

### Test Workflow (`.github/workflows/test.yml`)

**Triggers:**
- Pull requests to `main` branch
- Push to `develop` branch

**What it does:**
1. Tests Strapi backend build
2. Tests Next.js frontend build
3. Runs linting
4. Tests Docker image builds
5. Runs security scans

## 🔧 Customization

### Change Deployment Branch

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - production  # Change from 'main' to your branch
```

### Add Slack/Discord Notifications

Add this step to `.github/workflows/deploy.yml`:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    text: 'Deployment to production ${{ job.status }}'
```

### Add Environment Variables

If you need to update environment variables during deployment:

```yaml
- name: Update Environment Variables
  env:
    DROPLET_IP: ${{ secrets.DROPLET_IP }}
    DROPLET_USER: ${{ secrets.DROPLET_USER }}
  run: |
    ssh $DROPLET_USER@$DROPLET_IP << 'ENDSSH'
      cd /opt/strapi-app
      
      # Update specific env variable
      sed -i 's/OLD_VALUE/NEW_VALUE/g' .env
      
      # Or use GitHub secrets
      echo "NEW_VAR=${{ secrets.NEW_VAR }}" >> .env
    ENDSSH
```

### Deploy Only Specific Services

Modify the deployment step:

```yaml
# Deploy only Strapi
docker-compose up -d --build strapi

# Deploy only Next.js
docker-compose up -d --build nextjs
```

## 🔍 Monitoring Deployments

### View Workflow Runs

1. Go to **Actions** tab in GitHub
2. Click on a workflow run
3. Expand steps to see detailed logs

### Check Deployment Status

```bash
# SSH into Droplet
ssh deploy@YOUR_DROPLET_IP

# Check service status
cd /opt/strapi-app
docker-compose ps

# View logs
docker-compose logs -f
```

### View Deployment History

```bash
# On Droplet
cd /opt/strapi-app

# View git history
git log --oneline -10

# View deployment backups
ls -lh /opt/backups/pre-deploy-*
```

## 🆘 Troubleshooting

### ❌ SSH Connection Failed

**Error:**
```
Permission denied (publickey)
```

**Solution:**

1. Verify the private key is correct in GitHub secrets
2. Ensure public key is in `~/.ssh/authorized_keys` on Droplet
3. Check SSH key permissions on Droplet:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

### ❌ Git Pull Failed

**Error:**
```
fatal: not a git repository
```

**Solution:**

```bash
# SSH into Droplet
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app

# Initialize git
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git fetch origin
git reset --hard origin/main
```

### ❌ Docker Build Failed

**Error:**
```
ERROR: failed to solve: process "/bin/sh -c npm run build" did not complete
```

**Solution:**

1. Check if there's enough disk space:
   ```bash
   df -h
   ```

2. Clean up Docker:
   ```bash
   docker system prune -a
   ```

3. Check environment variables in `.env`

### ❌ Deployment Verification Failed

**Error:**
```
Frontend is not accessible
```

**Solution:**

1. Check if services are running:
   ```bash
   docker-compose ps
   ```

2. Check logs:
   ```bash
   docker-compose logs
   ```

3. Increase wait time in workflow (change `sleep 10` to `sleep 30`)

### ❌ Permission Denied on Droplet

**Error:**
```
Permission denied: /opt/strapi-app
```

**Solution:**

```bash
# SSH into Droplet as root or with sudo
sudo chown -R deploy:deploy /opt/strapi-app
```

## 🔐 Security Best Practices

1. **Use dedicated SSH key** - Don't reuse your personal SSH key
2. **Limit SSH key access** - Add key only to the deploy user
3. **Rotate secrets regularly** - Change SSH keys every 90 days
4. **Use environment-specific secrets** - Different keys for staging/production
5. **Enable branch protection** - Require PR reviews before merging to main
6. **Enable security scanning** - The test workflow includes Trivy scanning

## 📊 Workflow Status Badges

Add these to your `README.md`:

```markdown
![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)
![Test](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test.yml/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual values.

## 🚀 Advanced Features

### Multi-Environment Deployment

Create separate workflows for staging and production:

**`.github/workflows/deploy-staging.yml`:**
```yaml
on:
  push:
    branches:
      - develop

env:
  DEPLOY_PATH: /opt/strapi-app-staging
```

**`.github/workflows/deploy-production.yml`:**
```yaml
on:
  push:
    branches:
      - main

env:
  DEPLOY_PATH: /opt/strapi-app
```

### Blue-Green Deployment

Modify deployment to use two environments:

```yaml
- name: Blue-Green Deployment
  run: |
    ssh $DROPLET_USER@$DROPLET_IP << 'ENDSSH'
      # Deploy to blue environment
      cd /opt/strapi-app-blue
      git pull origin main
      docker-compose up -d --build
      
      # Test blue environment
      sleep 30
      if curl -f http://localhost:8080; then
        # Switch traffic to blue
        # Update nginx to point to blue
        # Stop green environment
        cd /opt/strapi-app-green
        docker-compose down
      fi
    ENDSSH
```

### Automated Database Migrations

Add migration step before deployment:

```yaml
- name: Run Database Migrations
  run: |
    ssh $DROPLET_USER@$DROPLET_IP << 'ENDSSH'
      cd /opt/strapi-app
      docker-compose exec -T strapi npm run strapi migrate
    ENDSSH
```

### Rollback on Failure

The deployment workflow already includes basic rollback:

```yaml
if docker-compose ps | grep -q "Up"; then
  echo "✅ Deployment successful!"
else
  echo "❌ Deployment failed! Rolling back..."
  git reset --hard HEAD~1
  docker-compose up -d
  exit 1
fi
```

## 📝 Deployment Checklist

Before enabling CI/CD:

- [ ] SSH key generated and added to Droplet
- [ ] GitHub secrets configured (SSH_KEY, IP, USER)
- [ ] Git initialized on Droplet in `/opt/strapi-app`
- [ ] Droplet has internet access
- [ ] Docker and Docker Compose installed on Droplet
- [ ] `.env` file configured on Droplet
- [ ] Backup directory exists (`/opt/backups`)
- [ ] Test deployment manually first
- [ ] Workflow files committed to repository

## 🎯 Next Steps

1. **Test the workflow** - Push a small change and monitor
2. **Set up notifications** - Add Slack/Discord webhooks
3. **Enable branch protection** - Require reviews before merging
4. **Create staging environment** - Test before production
5. **Monitor deployments** - Set up uptime monitoring
6. **Document your process** - Keep team informed

---

**Your CI/CD pipeline is now ready! 🎉**

Every push to `main` will automatically deploy to your Droplet.
