# QUINTIA — Vercel Deployment Guide

## Purpose

This document covers how to deploy QUINTIA to Vercel, configure environment
variables, and manage preview and production environments.

## Prerequisites

- A Vercel account linked to the GitHub repository.
- A PostgreSQL database (for production `STORAGE_MODE=prisma`).
- Node.js 18+ and npm installed locally.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `STORAGE_MODE` | Yes | `memory` (dev/preview) or `prisma` (production) |
| `DATABASE_URL` | Prod only | PostgreSQL connection string for Prisma |
| `NEXT_PUBLIC_APP_URL` | No | Public URL for the application |

> **Important:** The environment variable is `STORAGE_MODE`, not
> `STORAGE_ADAPTER`. Using the wrong name will cause the application to fall
> back to the memory adapter silently.

### Setting Variables in Vercel

1. Go to **Project Settings → Environment Variables**.
2. Add each variable for the appropriate scope:
   - **Production**: `STORAGE_MODE=prisma`, `DATABASE_URL=<connection-string>`
   - **Preview**: `STORAGE_MODE=memory`
   - **Development**: `STORAGE_MODE=memory`
3. Redeploy after changing variables.

## Deployment Workflow

### Automatic Deployments

Every push to `main` triggers a production deployment. Pull requests get
preview deployments automatically.

```
git push origin main  →  Vercel production deployment
git push origin feat  →  Vercel preview deployment (on PR)
```

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Build Configuration

The `vercel.json` at the repository root controls build settings. The default
Next.js framework preset is used.

### Build Command

```bash
npm run build
```

### Output Directory

Next.js manages this automatically via `.next/`.

## Database Setup (Production)

1. Provision a PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.).
2. Set `DATABASE_URL` in Vercel environment variables.
3. Run Prisma migrations:

```bash
npx prisma migrate deploy
```

4. Vercel build will generate the Prisma client automatically.

## Preview Deployments

- Every pull request gets an isolated preview URL.
- Preview deployments use `STORAGE_MODE=memory` by default.
- Use preview URLs for QA and stakeholder review.

## Monitoring

### Vercel Dashboard

- **Functions tab** — invocation count, duration, errors.
- **Logs tab** — real-time and historical function logs.
- **Analytics tab** — Web Vitals and performance metrics.

### Health Check

The application exposes a health endpoint:

```
GET /api/health → { "status": "ok", "storage": "memory|prisma" }
```

## Rollback

Vercel keeps every deployment immutable. To roll back:

1. Go to **Deployments** in the Vercel dashboard.
2. Find the last known-good deployment.
3. Click **Promote to Production**.

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| App starts but data is lost on reload | `STORAGE_MODE=memory` in production | Set `STORAGE_MODE=prisma` |
| Prisma connection error | Missing or invalid `DATABASE_URL` | Verify connection string |
| Build fails on `prisma generate` | Prisma schema out of sync | Run `npx prisma generate` locally |
| Function timeout (504) | Pipeline processing too large a dataset | Reduce input size or increase timeout |
| Wrong env var name used | Using `STORAGE_ADAPTER` instead of `STORAGE_MODE` | Rename to `STORAGE_MODE` |

## Security

- Never commit `DATABASE_URL` or other secrets to the repository.
- Use Vercel's encrypted environment variables.
- Rotate database credentials periodically.
- Enable Vercel's DDoS protection (enabled by default).

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — system architecture
- [RUNBOOK.md](./RUNBOOK.md) — operational procedures

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial deployment guide |
