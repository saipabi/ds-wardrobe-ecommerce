# DS WARDROBE — Production Cloud & Docker Deployment Guide

**Project:** DS Wardrobe Modern Decoupled Fashion E-Commerce Platform  
**Target Environments:** Cloud PaaS (Vercel + Render + Supabase + Upstash) & Self-Hosted Linux/Docker Containers (AWS EC2 / DigitalOcean)

---

## 1. Architecture Overview

DS Wardrobe is built as a **Decoupled Headless Commerce Architecture**. The platform can be deployed in two battle-tested production topologies:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TOPOLOGY A: MANAGED CLOUD                       │
│                                                                        │
│   [ Patrons & Mobile Devices ] ──► Cloudflare DNS / SSL               │
│                                           │                            │
│                  ┌────────────────────────┴────────────────────────┐   │
│                  ▼                                                 ▼   │
│         [ Vercel Edge CDN ]                               [ Render / Railway ] │
│        Next.js 16 Storefront                             Commerce Express API  │
│        (Port 443 / HTTPS)                                 (Port 443 / HTTPS)   │
│                                                                    │   │
│                                           ┌────────────────────────┼───┘
│                                           ▼                        ▼
│                                 [ Supabase / Neon ]       [ Upstash Redis ]
│                                   PostgreSQL 16+            Fast Cache & Queues
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                   TOPOLOGY B: DOCKER COMPOSE ON VPS                    │
│                                                                        │
│   [ Client Browser ] ──► Nginx Reverse Proxy (Port 80/443 SSL)        │
│                                 │                                      │
│             ┌───────────────────┴───────────────────┐                  │
│             ▼                                       ▼                  │
│   ds-wardrobe-frontend (3000)             ds-wardrobe-backend (8000)   │
│                                                     │                  │
│                                ┌────────────────────┼─────────────┐    │
│                                ▼                                  ▼    │
│                       ds-wardrobe-db (5432)             ds-wardrobe-redis (6379)│
│                         PostgreSQL 16                       Redis 7     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Strategy A: Managed Serverless Cloud (Zero Maintenance)

This is the recommended deployment pattern for DS Wardrobe, providing high-availability across India with automatic scaling and zero server patching.

### A. Deploy Frontend on Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your `E-Commerce` repository.
4. Set **Root Directory** to `frontend`.
5. Framework Preset: **Next.js** (automatically detected).
6. Under **Environment Variables**, add:
   ```env
   NEXT_PUBLIC_API_URL=https://api.dswardrobe.com/api
   ```
7. Click **Deploy**. Vercel will build the SSR bundle and distribute it globally with edge caching.
8. Connect your domain in *Project Settings > Domains* (e.g., `dswardrobe.com`).

---

### B. Deploy Commerce Backend on Render or Railway
1. Sign in to [Render](https://render.com) or [Railway](https://railway.app).
2. Click **New > Web Service** and connect the GitHub repository.
3. Set **Root Directory** to `backend`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start` (or `node dist/index.js`)
6. Health Check Path: `/api/health`
7. Set Environment Variables:
   ```env
   PORT=8000
   NODE_ENV=production
   JWT_SECRET=generate_a_secure_64_char_random_secret_here
   FRONTEND_URL=https://dswardrobe.com
   DATABASE_URL=postgresql://user:pass@host:5432/ds_wardrobe
   REDIS_URL=rediss://default:token@host:6379
   ```
8. Deploy. Render/Railway will assign an HTTPS URL (e.g. `https://ds-backend.onrender.com`).

---

### C. Managed Database (PostgreSQL) on Supabase or Neon
1. Create a free PostgreSQL 16 database at [Supabase](https://supabase.com) or [Neon.tech](https://neon.tech).
2. Copy the transactional connection URI:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require
   ```
3. Paste into the Backend environment variables.

---

### D. Serverless Redis on Upstash
1. Create a serverless Redis database at [Upstash](https://upstash.com) (select Mumbai `ap-south-1` region for lowest India latency).
2. Copy the `rediss://...` connection string.
3. Paste into Backend environment variables as `REDIS_URL`.
4. Verify by pinging `https://api.dswardrobe.com/api/health` — it will return:
   ```json
   {
     "status": "healthy",
     "cache": { "type": "redis", "redisUrl": "rediss://..." },
     "database": { "driver": "postgresql", "storage": "persistent" }
   }
   ```

---

## 3. Strategy B: Single-Command Docker Compose (VPS / AWS EC2)

If deploying to a dedicated server (AWS EC2, DigitalOcean Droplet, Hetzner, or Ubuntu 22.04 LTS):

### Step 1: Install Docker & Docker Compose
```bash
# Ubuntu / Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Step 2: Clone & Configure
```bash
git clone https://github.com/your-username/E-Commerce.git
cd E-Commerce
cp .env.example .env
```
Edit `.env` to set production passwords and domain URLs.

### Step 3: Launch Full Multi-Container Stack
```bash
docker compose up -d --build
```

### Step 4: Verify Containers
```bash
docker compose ps
```
Output:
```text
NAME                   IMAGE               COMMAND                  SERVICE             STATUS              PORTS
ds-wardrobe-db         postgres:16-alpine  "docker-entrypoint.s…"   db                  Up (healthy)        0.0.0.0:5432->5432/tcp
ds-wardrobe-redis      redis:7-alpine      "docker-entrypoint.s…"   redis               Up (healthy)        0.0.0.0:6379->6379/tcp
ds-wardrobe-backend    e-commerce-backend  "node dist/index.js"     backend             Up (healthy)        0.0.0.0:8000->8000/tcp
ds-wardrobe-frontend   e-commerce-frontend "npm start"              frontend            Up                  0.0.0.0:3000->3000/tcp
```

### Step 5: Configure Nginx & SSL (Let's Encrypt)

Create `/etc/nginx/sites-available/dswardrobe.conf`:
```nginx
# Storefront (Port 3000)
server {
    server_name dswardrobe.com www.dswardrobe.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Commerce Backend API (Port 8000)
server {
    server_name api.dswardrobe.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable SSL via Certbot:
```bash
sudo certbot --nginx -d dswardrobe.com -d www.dswardrobe.com -d api.dswardrobe.com
```

---

## 4. Production Security & Operational Checklist

- [x] **Zero Committed Secrets:** Credentials are read strictly from runtime environment variables.
- [x] **CORS Whitelisting:** Set `FRONTEND_URL` in `backend/.env` to prevent cross-origin abuse.
- [x] **Stock Locking:** Order creation runs in a single transactional pass to prevent overselling on flash drops.
- [x] **Container Health Checks:** All services define Docker health probes for automatic restart in case of failure.
- [x] **Database Backups:** Daily automated backups of `pgdata` volume using `pg_dump`:
  ```bash
  docker compose exec -t db pg_dump -U ds_user ds_wardrobe > backup_$(date +%F).sql
  ```
