# Deployment Guide

This guide covers deploying your Next.js + NestJS monorepo to production using CI/CD.

## 🏗️ **Architecture Overview**

- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Fly.io
- **Database**: Supabase PostgreSQL (or your PostgreSQL provider)
- **CI/CD**: GitHub Actions

## 🔐 **1. GitHub Secrets Setup**

Go to **GitHub Repository Settings > Secrets and variables > Actions** and configure these secrets:

### Backend Secrets (Fly.io)

- **`FLY_API_TOKEN`**: Get from `flyctl auth token` or Fly.io dashboard
- **`PRODUCTION_DATABASE_URL`**: Your production PostgreSQL connection string

### Frontend Secrets (Vercel)

- **`VERCEL_TOKEN`**: From Vercel Account Settings → Tokens
- **`VERCEL_ORG_ID`**: From Vercel Project Settings → General → Team/User ID
- **`VERCEL_PROJECT_ID`**: From Vercel Project Settings → General → Project ID

## 🛠️ **2. Fly.io Backend Setup**

### Initial Setup

```bash
cd backend
flyctl auth login
flyctl apps create your-backend-app-name
```

### Configure Secrets

```bash
# Required secrets
flyctl secrets set DATABASE_URL="your-production-database-url"
flyctl secrets set CLERK_SECRET_KEY="your-production-clerk-secret"
flyctl secrets set CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Optional rate limiting (uses defaults if not set)
flyctl secrets set RATE_LIMIT_MAX="100"
flyctl secrets set RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
```

### Verify Configuration

```bash
flyctl secrets list
flyctl status
```

## 🌐 **3. Vercel Frontend Setup**

### Initial Setup

1. Connect your GitHub repository to Vercel
2. Set build settings:
   - **Framework**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `cd .. && pnpm nx build frontend`
   - **Install Command**: `cd .. && pnpm install --frozen-lockfile`

### Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Clerk Authentication (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret

# API Configuration
NEXT_PUBLIC_BACKEND_URL=https://your-backend-app.fly.dev

# Environment
NODE_ENV=production
```

## 🚀 **4. Deployment Process**

### Automatic Deployment (Recommended)

Push to main branch for automatic deployment:

```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

### Manual Deployment

For manual deployment:

```bash
# Backend only
cd backend && flyctl deploy --remote-only

# Frontend only
cd frontend && vercel --prod
```

## 🔍 **5. Verification**

After deployment, verify:

### Backend Health Check

```bash
curl https://your-backend-app.fly.dev/health
```

### Frontend Access

- Visit `https://yourdomain.com`
- Test authentication flow
- Verify API connectivity

### Database Migrations

Check that migrations ran successfully:

```bash
flyctl logs -a your-backend-app
```

## 🐛 **6. Troubleshooting**

### Common Issues

**Build Failures**

- Check GitHub Actions logs
- Verify all secrets are set
- Ensure dependencies are up to date

**Database Connection Issues**

- Verify `PRODUCTION_DATABASE_URL` format
- Check database is accessible from Fly.io
- Test connection string locally

**CORS Errors**

- Verify `CORS_ORIGINS` includes your frontend domain
- Check frontend `NEXT_PUBLIC_BACKEND_URL` points to correct backend

**Deployment Timeouts**

- Check Fly.io resource limits
- Monitor deployment logs: `flyctl logs`

### Useful Commands

```bash
# Fly.io debugging
flyctl logs -a your-backend-app
flyctl status -a your-backend-app
flyctl ssh console -a your-backend-app

# Vercel debugging
vercel logs your-project-url
vercel env ls
```

## 📊 **7. Monitoring**

### Health Checks

- Backend: `https://your-backend-app.fly.dev/health`
- Frontend: Monitor Vercel dashboard

### Performance

- Fly.io: Monitor metrics in dashboard
- Vercel: Check Core Web Vitals and deployment logs

## 🔄 **8. Updates & Maintenance**

### Dependency Updates

```bash
pnpm update
git add .
git commit -m "chore: update dependencies"
git push origin main
```

### Database Migrations

Migrations run automatically during deployment. For manual migrations:

```bash
cd backend
flyctl ssh console -a your-backend-app
npx prisma migrate deploy
```

### Rolling Back

```bash
# Fly.io rollback
flyctl releases -a your-backend-app
flyctl deploy --image <previous-image>

# Vercel rollback
# Use Vercel dashboard to promote previous deployment
```

---

## 📞 **Support**

- **Fly.io**: https://fly.io/docs
- **Vercel**: https://vercel.com/docs
- **GitHub Actions**: Check workflow logs in Actions tab
