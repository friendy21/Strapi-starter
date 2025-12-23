# Getting Started With Strapi 5 and Next.js 15 

Have you ever wondered how well Strapi and Next.js work together? You can take it for a test run with this project.

It is open source, and you can use it to jump-start your project.

It is built with Next.js 15 and Strapi 5 

## What is Next.js?
Next.js is a framework built on top of React that provides additional features and optimizations for web development. 

It offers tools and conventions that make creating high-performance, SEO-friendly web applications easier.

**Key Features**
- App Router allows you to create and manage routes in your application easily and intuitively.

- Server Components allow parts of your application to be rendered on the server, which offers several benefits: Reduced client-side JavaScript, leading to improved performance and security, as sensitive operations can be kept on the server.

- Server Actions are a new feature that allows you to define and execute server-side code directly from your components, enabling Seamless integration of server-side logic within your application.

You can learn more about Next.js [here](https://nextjs.org/docs)

## What is Strapi?
Strapi is a flexible, customizable, headless CMS built with Node.js.

It offers a user-friendly interface for content management while allowing developers to build and design the front end independently. 

As a headless CMS, Strapi separates the content management from the presentation layer, delivering content via APIs.

**Powerful Combination**
Next.js and Strapi together create a robust solution for building dynamic websites. 

Next.js handles the front with server-side rendering capabilities, while Strapi manages the backend content.

**Key Benefits**

- **Improved SEO and Performance**: Next.js's server-side rendering capabilities, combined with Strapi's content management, enhance SEO and website speed. 

- **Flexibility and Customization**: Strapi's adaptability complements Next.js's versatility, allowing developers to create highly customized web applications and allowing for complete control over both the content structure and the frontend presentation.

- **API-First Approach**: Strapi provides a robust, out-of-the-box API that makes fetching and managing content in your Next.js application easy. 

This API-first approach enables you to build scalable and efficient web applications.

- **Developer-Friendly**: Strapi and Next.js are built with JavaScript/Node.js, providing a consistent development experience. This familiarity can lead to increased productivity and easier maintenance.

## What's New in Strapi 5
Strapi 5 introduces several powerful features to enhance content management and development efficiency.

- **Draft & Publish**: with a new user-friendly interface, Strapi 5 now separates Draft and Published content into distinct tabs, allowing you to save and publish content in a single action. This feature reduces the risk of publishing errors and makes collaboration smoother than ever.

- **Content History**: Strapi 5 allows you to quickly revert to previous versions of your content, helping you avoid data loss, inefficiency, and workflow disruptions. If you ever need to go back to an earlier version of a page, it's now just a click away.

- **100% TypeScript**: Strapi 5 is now entirely written in TypeScript, offering the benefits of type safety and easier maintainability. This means more robust code, quicker bug detection, and a smoother experience for collaborative projects.

- **Vite Bundling**: Strapi 5 offers Vite bundling support, which speeds up build times. This enhancement improves performance, making your development process more efficient.

- **Plugin CLI**: Strapi 5 introduces an intuitive Plugin CLI, providing a suite of commands that make plugin development more accessible than ever. This tool simplifies creating and managing plugins, saving developers valuable time.

- **New API Format**: Strapi 5's new API format is cleaner and more intuitive, simplifying your interactions with the CMS. It also reduces payload sizes, leading to faster and more efficient data handling.
Strapi 5 is your go-to open-source headless CMS for modern API creation and seamless content collaboration. It makes coding and publishing more intuitive.


## Getting Started With The Project Demo

You can check out the [following video](https://www.youtube.com/watch?v=RSdRM4gw218) or follow the steps outlined below.

**Step 1**: clone the project
The first step is to clone the project to your local computer.

I will be using GitHub CLI for this example. Let's start by cloning the project with the following command.

``` bash
  git clone https://github.com/PaulBratslavsky/strapi-5-next-js-starter-project.git
```
**Step 2**: run the setup script

Once you have the project on your local machine, let's install the project dependencies and seed them with example data.

We will run the following command from the root of our project.

``` bash
  npm run setup
```

And to seed the data.

``` bash
  npm run seed
```

Finally you can run `npm run dev` in the root of our project.

This will start both our `backend` and `frontend`.

Before navigating to our frontend, you will be prompted to create your first **Strapi Admin** user.

You can check out the `package.json` file for more details on what the script will do.

If you have any questions about the project, please leave a comment or stop by Strapi's "open office" hours Monday through Friday at 12:30 PM CST.

---

## 🚀 Deployment

Ready to deploy your application to production? We've created comprehensive guides to help you deploy to DigitalOcean.

### 📚 Deployment Documentation

| Document | Description |
|----------|-------------|
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Main deployment guide with options for Droplet and App Platform |
| **[Deployment Workflow](./.agent/workflows/deploy-digitalocean-droplet.md)** | Complete step-by-step guide for DigitalOcean Droplet deployment |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Quick reference checklist for deployment |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture and diagrams |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common issues and solutions |

### 🎯 Quick Start Deployment

**For DigitalOcean Droplet (Recommended):**

1. Create a Droplet (Ubuntu 24.04, 2GB RAM minimum)
2. SSH into your Droplet
3. Clone your repository
4. Run the deployment script:
   ```bash
   chmod +x scripts/deploy-droplet.sh
   ./scripts/deploy-droplet.sh
   ```
5. Configure your domain and SSL

**Estimated Cost:** $12-18/month  
**Estimated Time:** 30-45 minutes

For detailed instructions, see the [complete deployment workflow](./.agent/workflows/deploy-digitalocean-droplet.md).

### 🔧 What's Included

The deployment setup includes:

- **Docker Compose** configuration for all services
- **PostgreSQL** database with persistent storage
- **Nginx** reverse proxy with SSL support
- **Automated deployment** script
- **SSL certificate** management with Let's Encrypt
- **Backup scripts** for database
- **Environment templates** for production

### 📖 Need Help?

- Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues
- Review the [Architecture Documentation](./ARCHITECTURE.md) to understand the system
- Use the [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) to track your progress

---

## ⚙️ CI/CD with GitHub Actions

Automate your deployments with GitHub Actions! Push to `main` and your changes automatically deploy to your Droplet.

### 📚 CI/CD Documentation

| Document | Description |
|----------|-------------|
| **[CICD_SETUP.md](./CICD_SETUP.md)** | Complete GitHub Actions setup guide |
| **[Setup Workflow](./.agent/workflows/setup-github-actions-cicd.md)** | Step-by-step CI/CD configuration |
| **[CICD_QUICKREF.md](./CICD_QUICKREF.md)** | Quick reference for commands and secrets |

### 🚀 Quick Setup

1. **Generate SSH key for GitHub Actions:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions-deploy
   ```

2. **Add public key to your Droplet**

3. **Configure GitHub Secrets:**
   - `DROPLET_SSH_KEY` - Private SSH key
   - `DROPLET_IP` - Your Droplet's IP
   - `DROPLET_USER` - SSH username (usually `deploy`)

4. **Push to main branch** - Deployment happens automatically!

### ✨ What You Get

- ✅ **Automatic deployment** on push to `main`
- ✅ **Automated testing** on pull requests
- ✅ **Database backups** before each deployment
- ✅ **Automatic rollback** if deployment fails
- ✅ **Security scanning** with Trivy
- ✅ **Docker image optimization**

### 📊 Workflow Status

Add these badges to show your deployment status:

```markdown
![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)
![Test](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test.yml/badge.svg)
```

For detailed setup instructions, see the [CI/CD Setup Guide](./CICD_SETUP.md).

---

## 📝 License

This project is open source and available under the MIT License. 
