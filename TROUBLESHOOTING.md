# Deployment Troubleshooting Guide

Common issues and solutions when deploying Strapi + Next.js to DigitalOcean Droplet.

## Table of Contents
- [Connection Issues](#connection-issues)
- [Container Issues](#container-issues)
- [Database Issues](#database-issues)
- [SSL/HTTPS Issues](#sslhttps-issues)
- [Performance Issues](#performance-issues)
- [Build Issues](#build-issues)

---

## Connection Issues

### ❌ Cannot SSH into Droplet

**Symptoms:**
```
ssh: connect to host X.X.X.X port 22: Connection refused
```

**Solutions:**

1. **Check if Droplet is running:**
   - Go to DigitalOcean dashboard
   - Verify Droplet status is "Active"
   - If powered off, click "Power On"

2. **Verify SSH key:**
   ```bash
   # Check if your SSH key is loaded
   ssh-add -l
   
   # If not, add it
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Check firewall:**
   - In DigitalOcean dashboard, check Firewall settings
   - Ensure port 22 is allowed from your IP
   - Or temporarily allow from all IPs for testing

4. **Use password authentication (if SSH key fails):**
   ```bash
   ssh -o PreferredAuthentications=password root@YOUR_IP
   ```

5. **Access via DigitalOcean Console:**
   - Go to Droplet page
   - Click "Access" → "Launch Droplet Console"
   - Login and check SSH service: `systemctl status sshd`

---

### ❌ Cannot Access Website (Timeout)

**Symptoms:**
- Browser shows "Connection timed out"
- `curl http://YOUR_IP` hangs

**Solutions:**

1. **Check if Nginx is running:**
   ```bash
   ssh deploy@YOUR_IP
   cd /opt/strapi-app
   docker-compose ps nginx
   ```

2. **Check firewall rules:**
   ```bash
   sudo ufw status
   # Should show:
   # 80/tcp    ALLOW       Anywhere
   # 443/tcp   ALLOW       Anywhere
   ```

3. **Check if ports are listening:**
   ```bash
   sudo netstat -tlnp | grep -E ':(80|443)'
   ```

4. **Check Nginx logs:**
   ```bash
   docker-compose logs nginx
   ```

5. **Restart Nginx:**
   ```bash
   docker-compose restart nginx
   ```

---

### ❌ Website Shows "502 Bad Gateway"

**Symptoms:**
- Nginx is running but shows 502 error
- Backend services not responding

**Solutions:**

1. **Check if backend services are running:**
   ```bash
   docker-compose ps
   # All should show "Up"
   ```

2. **Check Strapi logs:**
   ```bash
   docker-compose logs strapi
   ```

3. **Check Next.js logs:**
   ```bash
   docker-compose logs nextjs
   ```

4. **Restart all services:**
   ```bash
   docker-compose restart
   ```

5. **Check if services are healthy:**
   ```bash
   docker-compose ps
   # Look for "healthy" status
   ```

6. **Rebuild if necessary:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

---

## Container Issues

### ❌ Container Keeps Restarting

**Symptoms:**
```bash
docker-compose ps
# Shows "Restarting" status
```

**Solutions:**

1. **Check container logs:**
   ```bash
   docker-compose logs --tail=100 strapi
   docker-compose logs --tail=100 nextjs
   ```

2. **Common causes:**

   **Out of Memory:**
   ```bash
   # Check memory usage
   free -h
   
   # If low, upgrade Droplet or reduce services
   ```

   **Environment variable missing:**
   ```bash
   # Check .env file
   cat /opt/strapi-app/.env
   
   # Ensure all required variables are set
   ```

   **Database not ready:**
   ```bash
   # Check PostgreSQL
   docker-compose logs postgres
   
   # Restart database
   docker-compose restart postgres
   ```

3. **Remove and recreate container:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

### ❌ Container Won't Start

**Symptoms:**
```
ERROR: Container failed to start
```

**Solutions:**

1. **Check for port conflicts:**
   ```bash
   sudo netstat -tlnp | grep -E ':(80|443|1337|3000|5432)'
   ```

2. **Check Docker logs:**
   ```bash
   docker-compose logs
   ```

3. **Verify Docker Compose file:**
   ```bash
   docker-compose config
   # Should show no errors
   ```

4. **Check disk space:**
   ```bash
   df -h
   # If >90% full, clean up
   docker system prune -a
   ```

5. **Rebuild images:**
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

---

## Database Issues

### ❌ Database Connection Failed

**Symptoms:**
```
Error: connect ECONNREFUSED postgres:5432
```

**Solutions:**

1. **Check if PostgreSQL is running:**
   ```bash
   docker-compose ps postgres
   ```

2. **Check PostgreSQL logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Verify database credentials in .env:**
   ```bash
   cat /opt/strapi-app/.env | grep DATABASE
   ```

4. **Test database connection manually:**
   ```bash
   docker exec -it strapi-postgres psql -U strapi -d strapi
   # Should connect successfully
   # Type \q to exit
   ```

5. **Restart PostgreSQL:**
   ```bash
   docker-compose restart postgres
   ```

6. **Check if database exists:**
   ```bash
   docker exec -it strapi-postgres psql -U strapi -c "\l"
   # Should list "strapi" database
   ```

---

### ❌ Database Data Lost After Restart

**Symptoms:**
- All content disappeared after restarting containers
- Admin user needs to be recreated

**Solutions:**

1. **Check if volume exists:**
   ```bash
   docker volume ls | grep postgres_data
   ```

2. **Verify volume is mounted:**
   ```bash
   docker inspect strapi-postgres | grep -A 10 Mounts
   ```

3. **Restore from backup:**
   ```bash
   # List backups
   ls -lh /opt/backups/
   
   # Restore latest backup
   cat /opt/backups/db_YYYYMMDD.sql | docker exec -i strapi-postgres psql -U strapi -d strapi
   ```

4. **Prevent future data loss:**
   - Never use `docker-compose down -v` (removes volumes)
   - Always use `docker-compose down` (keeps volumes)

---

### ❌ Database Running Out of Space

**Symptoms:**
```
ERROR: could not extend file: No space left on device
```

**Solutions:**

1. **Check disk usage:**
   ```bash
   df -h
   docker system df
   ```

2. **Clean up Docker:**
   ```bash
   # Remove unused images
   docker image prune -a
   
   # Remove unused volumes (CAREFUL!)
   docker volume prune
   
   # Full cleanup
   docker system prune -a --volumes
   ```

3. **Vacuum PostgreSQL:**
   ```bash
   docker exec -it strapi-postgres psql -U strapi -d strapi -c "VACUUM FULL;"
   ```

4. **Upgrade Droplet storage:**
   - Go to DigitalOcean dashboard
   - Resize Droplet to larger disk

---

## SSL/HTTPS Issues

### ❌ SSL Certificate Failed to Generate

**Symptoms:**
```
Failed to obtain certificate
```

**Solutions:**

1. **Verify domain points to Droplet:**
   ```bash
   nslookup yourdomain.com
   # Should return your Droplet IP
   ```

2. **Check if port 80 is accessible:**
   ```bash
   curl -I http://yourdomain.com
   ```

3. **Ensure Nginx is running:**
   ```bash
   docker-compose ps nginx
   ```

4. **Check Certbot logs:**
   ```bash
   docker-compose logs certbot
   ```

5. **Try manual certificate generation:**
   ```bash
   docker-compose run --rm certbot certonly --webroot \
     -w /var/www/certbot \
     -d yourdomain.com \
     --email your-email@example.com \
     --agree-tos \
     --dry-run
   
   # If dry-run succeeds, remove --dry-run and run again
   ```

6. **Check rate limits:**
   - Let's Encrypt has rate limits (5 failures per hour)
   - Wait 1 hour if you hit the limit

---

### ❌ HTTPS Not Working (SSL Error)

**Symptoms:**
- Browser shows "Your connection is not private"
- Certificate errors

**Solutions:**

1. **Check if certificate exists:**
   ```bash
   docker-compose run --rm certbot certificates
   ```

2. **Verify Nginx SSL configuration:**
   ```bash
   docker-compose exec nginx nginx -t
   ```

3. **Check certificate files:**
   ```bash
   ls -la /opt/strapi-app/nginx/ssl/live/yourdomain.com/
   ```

4. **Restart Nginx:**
   ```bash
   docker-compose restart nginx
   ```

5. **Renew certificate:**
   ```bash
   docker-compose run --rm certbot renew --force-renewal
   docker-compose restart nginx
   ```

---

### ❌ Mixed Content Warnings

**Symptoms:**
- HTTPS page loading HTTP resources
- Browser console shows mixed content errors

**Solutions:**

1. **Update .env file:**
   ```bash
   nano /opt/strapi-app/.env
   # Change:
   NEXT_PUBLIC_STRAPI_URL=https://yourdomain.com
   # (not http://)
   ```

2. **Rebuild Next.js:**
   ```bash
   docker-compose down
   docker-compose up -d --build nextjs
   ```

3. **Check Strapi URL settings:**
   - Login to Strapi admin
   - Settings → General
   - Ensure URL is `https://yourdomain.com`

---

## Performance Issues

### ❌ Website Very Slow

**Symptoms:**
- Pages take >5 seconds to load
- High response times

**Solutions:**

1. **Check resource usage:**
   ```bash
   # CPU and Memory
   docker stats
   
   # Disk I/O
   iostat -x 1
   ```

2. **Check if Droplet is undersized:**
   ```bash
   free -h
   # If memory is constantly >80%, upgrade Droplet
   ```

3. **Check database performance:**
   ```bash
   docker exec -it strapi-postgres psql -U strapi -d strapi
   # Run: SELECT * FROM pg_stat_activity;
   ```

4. **Optimize database:**
   ```bash
   docker exec -it strapi-postgres psql -U strapi -d strapi -c "VACUUM ANALYZE;"
   ```

5. **Check logs for errors:**
   ```bash
   docker-compose logs --tail=100
   ```

6. **Restart services:**
   ```bash
   docker-compose restart
   ```

---

### ❌ High Memory Usage

**Symptoms:**
```bash
free -h
# Shows <100MB available
```

**Solutions:**

1. **Identify memory hog:**
   ```bash
   docker stats --no-stream
   ```

2. **Restart heavy containers:**
   ```bash
   docker-compose restart strapi
   docker-compose restart nextjs
   ```

3. **Limit container memory (in docker-compose.yml):**
   ```yaml
   strapi:
     mem_limit: 512m
   ```

4. **Upgrade Droplet:**
   - Go to DigitalOcean dashboard
   - Resize to 4GB RAM Droplet

5. **Enable swap (temporary fix):**
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

---

## Build Issues

### ❌ Docker Build Failed

**Symptoms:**
```
ERROR: failed to solve: process "/bin/sh -c npm run build" did not complete successfully
```

**Solutions:**

1. **Check build logs:**
   ```bash
   docker-compose build --no-cache
   ```

2. **Common causes:**

   **Out of disk space:**
   ```bash
   df -h
   docker system prune -a
   ```

   **Missing environment variables:**
   ```bash
   cat /opt/strapi-app/.env
   # Verify all required variables are set
   ```

   **Network issues:**
   ```bash
   # Test internet connection
   ping -c 3 google.com
   ```

3. **Build with verbose output:**
   ```bash
   docker-compose build --progress=plain
   ```

4. **Build individual services:**
   ```bash
   docker-compose build strapi
   docker-compose build nextjs
   ```

---

### ❌ npm install Fails During Build

**Symptoms:**
```
npm ERR! network request failed
```

**Solutions:**

1. **Check internet connection:**
   ```bash
   ping -c 3 registry.npmjs.org
   ```

2. **Clear npm cache:**
   ```bash
   docker-compose build --no-cache
   ```

3. **Use different npm registry:**
   In Dockerfile, add:
   ```dockerfile
   RUN npm config set registry https://registry.npmjs.org/
   ```

4. **Increase timeout:**
   In Dockerfile, add:
   ```dockerfile
   RUN npm config set fetch-timeout 60000
   ```

---

## Emergency Recovery

### 🆘 Everything is Broken

**Nuclear option - complete reset:**

```bash
# 1. Backup database first!
docker exec strapi-postgres pg_dump -U strapi strapi > ~/emergency-backup.sql

# 2. Stop and remove everything
cd /opt/strapi-app
docker-compose down -v

# 3. Clean Docker
docker system prune -a --volumes

# 4. Pull latest code
git pull origin main

# 5. Rebuild from scratch
docker-compose up -d --build

# 6. Restore database if needed
cat ~/emergency-backup.sql | docker exec -i strapi-postgres psql -U strapi -d strapi
```

---

## Getting Help

### Collect Diagnostic Information

Before asking for help, collect this information:

```bash
# System info
uname -a
docker --version
docker-compose --version

# Container status
docker-compose ps

# Recent logs
docker-compose logs --tail=100 > logs.txt

# Resource usage
free -h
df -h
docker stats --no-stream

# Environment (sanitized)
cat /opt/strapi-app/.env | sed 's/=.*/=***REDACTED***/'
```

### Where to Get Help

1. **DigitalOcean Community:** https://www.digitalocean.com/community
2. **Strapi Discord:** https://discord.strapi.io
3. **Strapi Forum:** https://forum.strapi.io
4. **Stack Overflow:** Tag with `strapi`, `nextjs`, `docker`
5. **GitHub Issues:** 
   - Strapi: https://github.com/strapi/strapi/issues
   - Next.js: https://github.com/vercel/next.js/issues

---

## Prevention Tips

1. **Regular backups:** Set up automated daily backups
2. **Monitor resources:** Use DigitalOcean monitoring
3. **Keep updated:** Regularly update Docker images
4. **Test changes:** Test in development before production
5. **Document changes:** Keep notes of configuration changes
6. **Use version control:** Commit all configuration files
7. **Set up alerts:** Configure uptime monitoring (e.g., UptimeRobot)

---

**Remember:** Always backup before making major changes! 🔐
