# QUINTIA — Operational Runbook

## Purpose

This runbook provides procedures for common operational tasks, incident
response, and maintenance of the QUINTIA platform on Vercel.

## Routine Operations

### Checking Application Health

```bash
curl https://<your-domain>/api/health
# Expected: { "status": "ok", "storage": "prisma" }
```

### Viewing Logs

1. Open the Vercel dashboard → **Logs** tab.
2. Filter by function name or time range.
3. For real-time tailing, use the Vercel CLI:

```bash
vercel logs --follow
```

### Deploying a Hotfix

1. Create a branch from `main`.
2. Apply the fix and push.
3. Verify the preview deployment.
4. Merge to `main` — production deploys automatically.

### Running Database Migrations

```bash
# Connect to production database context
npx prisma migrate deploy

# Verify migration status
npx prisma migrate status
```

### Clearing the In-Memory Store (Preview/Dev)

The memory adapter resets on every cold start. To force a reset, redeploy the
preview environment.

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|---|---|---|
| **SEV-1** | Production down, no workaround | Immediate |
| **SEV-2** | Major feature broken, workaround exists | < 1 hour |
| **SEV-3** | Minor issue, does not block users | < 4 hours |
| **SEV-4** | Cosmetic or documentation issue | Next sprint |

### Incident Procedure

1. **Detect** — Vercel alerts, user report, or health-check failure.
2. **Assess** — Determine severity and assign an owner.
3. **Mitigate** — Roll back if possible (see below).
4. **Fix** — Develop and test a fix on a branch.
5. **Deploy** — Merge to `main` and verify production.
6. **Post-mortem** — Document root cause and preventive actions.

### Rollback Procedure

1. Open Vercel dashboard → **Deployments**.
2. Identify the last known-good deployment.
3. Click **Promote to Production**.
4. Verify health check returns `ok`.

## Common Issues

### Pipeline Returns Empty Diagnostics

**Symptoms:** Report has zero diagnostics despite valid input.

**Investigation:**
1. Check the ontology coverage in the pipeline output.
2. Verify that diagnostic thresholds are not set too high.
3. Review the process graph for expected nodes and edges.

### Financial Results Are Zero

**Symptoms:** All `FinancialResult.savingsCents` values are `0`.

**Investigation:**
1. Verify `CostParams` are provided and non-zero.
2. Check that scenarios have non-zero `parameters`.
3. Run the recalculator in isolation with the same inputs.

### Database Connection Failures

**Symptoms:** 500 errors with Prisma connection messages.

**Investigation:**
1. Verify `DATABASE_URL` in Vercel environment variables.
2. Check database provider status page.
3. Test connection from a local machine:

```bash
npx prisma db pull
```

4. Check connection pool limits.

### Slow Function Execution

**Symptoms:** Functions approach or hit the 60-second timeout.

**Investigation:**
1. Check input data size — v1 is designed for batch sizes under 100K events.
2. Review Vercel function logs for which pipeline stage is slow.
3. Consider paginating large inputs.

## Maintenance Tasks

### Updating Dependencies

```bash
npm outdated          # Check for updates
npm update            # Apply compatible updates
npm run test          # Verify nothing broke
npm run build         # Verify build succeeds
```

### Prisma Schema Changes

1. Edit `prisma/schema.prisma`.
2. Generate a migration: `npx prisma migrate dev --name <description>`.
3. Test locally with `STORAGE_MODE=prisma`.
4. Deploy migration: `npx prisma migrate deploy`.

### Rotating Database Credentials

1. Generate new credentials in the database provider.
2. Update `DATABASE_URL` in Vercel environment variables.
3. Redeploy production.
4. Revoke old credentials.

## Contacts

| Role | Responsibility |
|---|---|
| On-call engineer | First responder for SEV-1/SEV-2 |
| Platform lead | Escalation point and architecture decisions |
| Database admin | Connection issues and schema migrations |

## Related Documents

- [DEPLOYMENT.md](./DEPLOYMENT.md) — deployment procedures
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system context

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial runbook |
