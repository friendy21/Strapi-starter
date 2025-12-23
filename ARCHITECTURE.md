# DigitalOcean Droplet Architecture

This document explains the architecture of your deployed Strapi + Next.js application on DigitalOcean.

## System Architecture

```mermaid
graph TB
    subgraph Internet
        User[👤 User Browser]
        DNS[🌐 DNS Server]
    end
    
    subgraph "DigitalOcean Droplet"
        subgraph "UFW Firewall"
            Port80[Port 80 HTTP]
            Port443[Port 443 HTTPS]
            Port22[Port 22 SSH]
        end
        
        subgraph "Docker Network: strapi-network"
            Nginx[🔀 Nginx Reverse Proxy<br/>Container]
            NextJS[⚛️ Next.js Frontend<br/>Container<br/>Port 3000]
            Strapi[🚀 Strapi Backend<br/>Container<br/>Port 1337]
            Postgres[(🗄️ PostgreSQL<br/>Database<br/>Container<br/>Port 5432)]
            Certbot[🔒 Certbot<br/>SSL Certificates]
        end
        
        subgraph "Docker Volumes"
            DBData[📦 postgres_data]
            Uploads[📦 strapi_uploads]
            SSL[📦 SSL Certificates]
        end
    end
    
    User -->|DNS Lookup| DNS
    DNS -->|Returns IP| User
    User -->|HTTPS Request| Port443
    User -->|HTTP Request| Port80
    Port80 --> Nginx
    Port443 --> Nginx
    
    Nginx -->|Route /api, /admin, /uploads| Strapi
    Nginx -->|Route / all other| NextJS
    
    NextJS -->|API Calls| Strapi
    Strapi -->|Query/Store| Postgres
    
    Postgres -.->|Persist Data| DBData
    Strapi -.->|Store Files| Uploads
    Certbot -.->|Manage Certs| SSL
    Nginx -.->|Use Certs| SSL
    
    style User fill:#e1f5ff
    style Nginx fill:#90EE90
    style NextJS fill:#61dafb
    style Strapi fill:#8e75ff
    style Postgres fill:#336791
    style Certbot fill:#ff9800
```

## Request Flow

### 1. User Visits Website

```mermaid
sequenceDiagram
    participant User
    participant DNS
    participant Firewall
    participant Nginx
    participant NextJS
    participant Strapi
    participant DB
    
    User->>DNS: What's the IP for yourdomain.com?
    DNS->>User: Here's the IP: 164.92.x.x
    User->>Firewall: HTTPS Request (Port 443)
    Firewall->>Nginx: Allow (Port 443 open)
    Nginx->>NextJS: Forward request to Next.js
    NextJS->>Strapi: Fetch data via internal network
    Strapi->>DB: Query database
    DB->>Strapi: Return data
    Strapi->>NextJS: Return JSON
    NextJS->>Nginx: Return HTML
    Nginx->>User: Serve page with SSL
```

### 2. Admin Accesses Strapi

```mermaid
sequenceDiagram
    participant Admin
    participant Nginx
    participant Strapi
    participant DB
    
    Admin->>Nginx: GET /admin
    Nginx->>Strapi: Forward to Strapi:1337/admin
    Strapi->>Admin: Return admin panel
    Admin->>Nginx: POST /admin/login
    Nginx->>Strapi: Forward credentials
    Strapi->>DB: Verify user
    DB->>Strapi: User valid
    Strapi->>Admin: Return JWT token
```

## Container Communication

### Internal Docker Network

All containers communicate via the `strapi-network` bridge network:

```
┌─────────────────────────────────────────┐
│     Docker Network: strapi-network      │
│                                         │
│  ┌────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Nginx  │  │ Next.js │  │ Strapi  │ │
│  │        │  │         │  │         │ │
│  └───┬────┘  └────┬────┘  └────┬────┘ │
│      │            │             │      │
│      └────────────┴─────────────┘      │
│                   │                    │
│            ┌──────┴──────┐            │
│            │  PostgreSQL  │            │
│            └──────────────┘            │
└─────────────────────────────────────────┘
```

**Container Hostnames:**
- `nginx` → Nginx reverse proxy
- `nextjs` → Next.js frontend
- `strapi` → Strapi backend
- `postgres` → PostgreSQL database

**Example:** Next.js connects to Strapi using `http://strapi:1337`

## Port Mapping

### External Ports (Exposed to Internet)

| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| 22 | SSH | TCP | Server administration |
| 80 | Nginx | HTTP | Web traffic (redirects to HTTPS) |
| 443 | Nginx | HTTPS | Secure web traffic |

### Internal Ports (Docker Network Only)

| Port | Service | Access |
|------|---------|--------|
| 1337 | Strapi | Internal only (via Nginx) |
| 3000 | Next.js | Internal only (via Nginx) |
| 5432 | PostgreSQL | Internal only (Strapi only) |

## Data Persistence

### Docker Volumes

```mermaid
graph LR
    subgraph "Docker Volumes"
        V1[postgres_data<br/>Database files]
        V2[strapi_uploads<br/>Media files]
        V3[certbot_webroot<br/>SSL certificates]
    end
    
    subgraph "Containers"
        C1[PostgreSQL]
        C2[Strapi]
        C3[Certbot]
        C4[Nginx]
    end
    
    C1 -.->|Persist| V1
    C2 -.->|Store/Read| V2
    C3 -.->|Manage| V3
    C4 -.->|Read| V3
```

**Volume Locations:**
- `/var/lib/docker/volumes/strapi-app_postgres_data`
- `/var/lib/docker/volumes/strapi-app_strapi_uploads`
- `/var/lib/docker/volumes/strapi-app_certbot_webroot`

## Security Layers

```mermaid
graph TD
    A[Internet] -->|Layer 1| B[DigitalOcean Firewall]
    B -->|Layer 2| C[UFW Firewall]
    C -->|Layer 3| D[Nginx Reverse Proxy]
    D -->|Layer 4| E[Docker Network Isolation]
    E --> F[Application Containers]
    
    style B fill:#ff9999
    style C fill:#ffcc99
    style D fill:#ffff99
    style E fill:#99ff99
    style F fill:#99ccff
```

1. **DigitalOcean Firewall** (Optional) - Cloud-level protection
2. **UFW Firewall** - OS-level firewall, only allows ports 22, 80, 443
3. **Nginx** - Reverse proxy, SSL termination, rate limiting
4. **Docker Network** - Container isolation
5. **Application** - Strapi authentication, Next.js security headers

## File Structure on Droplet

```
/opt/strapi-app/
├── .env                      # Environment variables
├── docker-compose.yml        # Container orchestration
├── server/                   # Strapi backend
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── client/                   # Next.js frontend
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── nginx/
│   ├── nginx.conf           # Nginx configuration
│   └── ssl/                 # SSL certificates
└── scripts/
    └── deploy-droplet.sh    # Deployment script

/opt/backups/                # Database backups
└── db_YYYYMMDD_HHMMSS.sql

/home/deploy/                # User home directory
└── backup-database.sh       # Backup script
```

## Environment Variables Flow

```mermaid
graph LR
    A[.env file] -->|Read by| B[docker-compose.yml]
    B -->|Pass to| C[Strapi Container]
    B -->|Pass to| D[Next.js Container]
    B -->|Pass to| E[PostgreSQL Container]
    
    C -->|Uses| F[Database Connection]
    C -->|Uses| G[JWT Secrets]
    D -->|Uses| H[API URL]
```

## Backup Strategy

```mermaid
graph TD
    A[Cron Job<br/>Daily 2 AM] -->|Triggers| B[backup-database.sh]
    B -->|Executes| C[docker exec pg_dump]
    C -->|Creates| D[SQL Backup File]
    D -->|Stored in| E[/opt/backups/]
    E -->|Retention| F[Keep 7 days]
    F -->|Delete| G[Older backups]
```

## SSL Certificate Renewal

```mermaid
graph LR
    A[Certbot Container] -->|Checks every 12h| B{Certificate<br/>expires soon?}
    B -->|Yes| C[Renew Certificate]
    B -->|No| D[Wait]
    C -->|Update| E[SSL Volume]
    E -->|Used by| F[Nginx]
    D -->|Wait 12h| A
```

## Scaling Considerations

### Current Setup (Single Droplet)
- **Pros:** Simple, cost-effective, easy to manage
- **Cons:** Single point of failure, limited scalability
- **Best for:** Small to medium traffic, MVP, personal projects

### Future Scaling Options

```mermaid
graph TB
    subgraph "Current: Single Droplet"
        A[All Services<br/>on one Droplet]
    end
    
    subgraph "Scale Option 1: Managed Database"
        B1[Droplet<br/>Strapi + Next.js]
        B2[Managed PostgreSQL]
        B1 --> B2
    end
    
    subgraph "Scale Option 2: Separate Services"
        C1[Droplet 1<br/>Next.js]
        C2[Droplet 2<br/>Strapi]
        C3[Managed PostgreSQL]
        C1 --> C2
        C2 --> C3
    end
    
    subgraph "Scale Option 3: Load Balanced"
        D1[Load Balancer]
        D2[Droplet 1<br/>Strapi]
        D3[Droplet 2<br/>Strapi]
        D4[Managed PostgreSQL]
        D1 --> D2
        D1 --> D3
        D2 --> D4
        D3 --> D4
    end
```

## Monitoring Points

Key metrics to monitor:

1. **CPU Usage** - `docker stats`
2. **Memory Usage** - `free -h`
3. **Disk Space** - `df -h`
4. **Container Health** - `docker-compose ps`
5. **Application Logs** - `docker-compose logs`
6. **Database Size** - PostgreSQL queries
7. **Response Times** - Nginx access logs
8. **SSL Certificate Expiry** - Certbot status

---

## Quick Reference

### Check System Status
```bash
# All containers
docker-compose ps

# Resource usage
docker stats

# Disk space
df -h

# Memory
free -h
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f strapi
```

### Restart Services
```bash
# All
docker-compose restart

# Specific
docker-compose restart nginx
```

---

This architecture provides a solid foundation for your application with room to scale as your needs grow.
