---
description: Set up GitHub Actions CI/CD for automated deployment to DigitalOcean Droplet
---

# GitHub Actions CI/CD Setup

This workflow guides you through setting up automated deployment using GitHub Actions.

## Prerequisites

- [ ] Application already deployed manually to DigitalOcean Droplet
- [ ] GitHub repository with your code
- [ ] SSH access to your Droplet

## Part 1: Generate SSH Key for GitHub Actions

### Step 1: Create Dedicated SSH Key

**On your local machine:**

```bash
# Generate SSH key for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions-deploy

# When prompted for passphrase, press Enter (no passphrase for automation)
```

### Step 2: Display Keys

```bash
# Display PRIVATE key (for GitHub Secrets)
cat ~/.ssh/github-actions-deploy

# Display PUBLIC key (for Droplet)
cat ~/.ssh/github-actions-deploy.pub
```

**Copy both keys** - you'll need them in the next steps.

---

## Part 2: Configure Droplet

### Step 3: Add Public Key to Droplet

**SSH into your Droplet:**

```bash
ssh deploy@YOUR_DROPLET_IP
```

**Add the public key:**

```bash
# Add public key to authorized_keys
echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

# Verify permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Exit
exit
```

### Step 4: Configure Git on Droplet

**SSH back into your Droplet:**

```bash
ssh deploy@YOUR_DROPLET_IP

# Navigate to app directory
cd /opt/strapi-app

# Configure git safe directory
git config --global --add safe.directory /opt/strapi-app

# Verify git remote
git remote -v

# If no remote, add it
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Pull latest code
git pull origin main

# Exit
exit
```

---

## Part 3: Configure GitHub Secrets

### Step 5: Add Secrets to GitHub

1. **Go to your GitHub repository**
2. **Click Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**

**Add these 3 secrets:**

#### Secret 1: DROPLET_SSH_KEY

- **Name:** `DROPLET_SSH_KEY`
- **Value:** Paste the entire PRIVATE key from Step 2
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmU...
  ... (entire private key)
  -----END OPENSSH PRIVATE KEY-----
  ```

#### Secret 2: DROPLET_IP

- **Name:** `DROPLET_IP`
- **Value:** Your Droplet's IP address (e.g., `164.92.123.45`)

#### Secret 3: DROPLET_USER

- **Name:** `DROPLET_USER`
- **Value:** `deploy` (or your SSH username)

---

## Part 4: Test CI/CD Pipeline

### Step 6: Commit and Push Workflow Files

**On your local machine:**

```bash
# Check if workflow files exist
ls .github/workflows/

# Should show:
# - deploy.yml
# - test.yml

# Add and commit
git add .github/workflows/
git commit -m "feat: add GitHub Actions CI/CD workflows"

# Push to trigger deployment
git push origin main
```

### Step 7: Monitor Deployment

1. **Go to your GitHub repository**
2. **Click the "Actions" tab**
3. **Click on the running workflow**
4. **Watch the deployment in real-time**

Expected steps:
- ✅ Checkout code
- ✅ Setup SSH
- ✅ Add Droplet to known hosts
- ✅ Deploy to Droplet
- ✅ Verify Deployment
- ✅ Notify on Success

### Step 8: Verify Deployment

**Check your website:**
- Visit `http://YOUR_DROPLET_IP` or `https://yourdomain.com`
- Verify the latest changes are live

**Check Droplet:**
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
docker-compose ps
# All services should be "Up"
```

---

## Part 5: Test Pull Request Workflow

### Step 9: Create a Test PR

```bash
# Create a new branch
git checkout -b test-cicd

# Make a small change
echo "# CI/CD Test" >> TEST.md

# Commit and push
git add TEST.md
git commit -m "test: CI/CD pipeline"
git push origin test-cicd
```

### Step 10: Create Pull Request

1. **Go to GitHub repository**
2. **Click "Pull requests"** → **"New pull request"**
3. **Select `test-cicd` branch**
4. **Click "Create pull request"**

**Watch the test workflow run:**
- ✅ Test Strapi Backend
- ✅ Test Next.js Frontend
- ✅ Test Docker Build
- ✅ Security Scan

---

## Workflow Behavior

### Automatic Deployment (deploy.yml)

**Triggers:**
- Push to `main` branch
- Manual trigger via Actions UI

**What it does:**
1. Connects to Droplet via SSH
2. Pulls latest code
3. Creates database backup
4. Stops services
5. Rebuilds Docker images
6. Starts services
7. Verifies deployment
8. Cleans up old images

### Automated Testing (test.yml)

**Triggers:**
- Pull requests to `main`
- Push to `develop` branch

**What it does:**
1. Tests Strapi build
2. Tests Next.js build
3. Runs linting
4. Tests Docker builds
5. Runs security scans

---

## Troubleshooting

### ❌ SSH Permission Denied

**Error in Actions:**
```
Permission denied (publickey)
```

**Fix:**
1. Verify `DROPLET_SSH_KEY` secret contains the PRIVATE key
2. Verify public key is in `~/.ssh/authorized_keys` on Droplet
3. Check key permissions on Droplet:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

### ❌ Git Pull Failed

**Error:**
```
fatal: not a git repository
```

**Fix:**
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git fetch origin
git reset --hard origin/main
```

### ❌ Docker Build Failed

**Error:**
```
ERROR: failed to solve
```

**Fix:**
```bash
ssh deploy@YOUR_DROPLET_IP
cd /opt/strapi-app

# Check disk space
df -h

# Clean up Docker
docker system prune -a

# Rebuild manually
docker-compose up -d --build
```

### ❌ Deployment Verification Failed

**Error:**
```
Frontend is not accessible
```

**Fix:**
1. Increase wait time in workflow (edit `.github/workflows/deploy.yml`)
2. Change `sleep 10` to `sleep 30`
3. Check if services are running:
   ```bash
   docker-compose ps
   docker-compose logs
   ```

---

## Customization

### Change Deployment Branch

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - production  # Change from 'main'
```

### Add Notifications

Add Slack notification step to `deploy.yml`:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Deploy Only on Tag

```yaml
on:
  push:
    tags:
      - 'v*'  # Only deploy on version tags
```

---

## Best Practices

1. **Test locally first** - Always test changes before pushing
2. **Use feature branches** - Never push directly to main
3. **Review PRs** - Enable branch protection and require reviews
4. **Monitor deployments** - Watch Actions tab during deployment
5. **Keep secrets secure** - Never commit secrets to repository
6. **Rotate SSH keys** - Change deployment keys every 90 days
7. **Enable notifications** - Get alerted on deployment failures

---

## Next Steps

- [ ] Enable branch protection on `main`
- [ ] Set up Slack/Discord notifications
- [ ] Create staging environment workflow
- [ ] Add deployment approval gates
- [ ] Set up monitoring and alerts
- [ ] Document deployment process for team

---

**Congratulations! Your CI/CD pipeline is now active! 🎉**

Every push to `main` will automatically deploy to your Droplet.
