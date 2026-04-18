# Vercel Skill — Deployment and Configuration

## Purpose

This skill provides guidance for deploying and configuring QUINTIA on Vercel.

## Environment Variables

| Variable | Required | Values |
|---|---|---|
| `STORAGE_MODE` | Yes | `memory` (dev) · `prisma` (prod) |
| `DATABASE_URL` | Prod | PostgreSQL connection string |

> **Critical:** Use `STORAGE_MODE`, not `STORAGE_ADAPTER`.

## Deployment Commands

```bash
# Local development
npm run dev

# Preview deployment
vercel

# Production deployment
vercel --prod

# Check build locally
npm run build
```

## Vercel Configuration

The `vercel.json` file at the repository root configures the deployment.
Next.js framework preset is used automatically.

## Database Operations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (production)
npx prisma migrate deploy

# Create migration (development)
npx prisma migrate dev --name <description>
```

## Health Check

```bash
curl https://<domain>/api/health
# { "status": "ok", "storage": "prisma" }
```

## Rollback

1. Vercel dashboard → Deployments.
2. Select last known-good deployment.
3. Promote to Production.

## Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| Data lost on reload | `STORAGE_MODE=memory` in prod | Set to `prisma` |
| Connection error | Bad `DATABASE_URL` | Verify connection string |
| Build fails | Prisma schema drift | Run `npx prisma generate` |
| 504 timeout | Large input data | Reduce batch size |

## Reference

- `docs/DEPLOYMENT.md` — full deployment guide
- `docs/RUNBOOK.md` — operational procedures
- `vercel.json` — Vercel project configuration
