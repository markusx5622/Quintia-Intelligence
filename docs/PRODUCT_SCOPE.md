# QUINTIA — Product Scope (v1)

## Purpose

This document defines what is **in scope** for QUINTIA v1 and what is
**explicitly deferred** to future releases.

## v1 Scope

### Core Pipeline

The full 7-stage pipeline is in scope for v1:

| Stage | Responsibility |
|---|---|
| 1. Ontology | Map raw event data to domain concepts |
| 2. Process Graph | Build directed graph of activities and transitions |
| 3. Diagnostics | Detect bottlenecks, rework, SLA violations |
| 4. Scenarios | Generate what-if improvement scenarios |
| 5. Recalculation | Compute deterministic financial impact (LAW 4) |
| 6. Critic | Validate and rank scenarios |
| 7. Synthesis | Produce final report with recommendations |

### Financial Recalculation

- All financial outputs computed exclusively in `src/lib/financial/recalculator.ts`.
- Deterministic: identical inputs → identical outputs (LAW 4).
- Currency and rounding rules defined at the project level.

### Storage Abstraction

- **Memory adapter** — zero-config for local development.
- **Prisma adapter** — production persistence with PostgreSQL.
- Controlled by `STORAGE_MODE` environment variable.

### API Surface

- Next.js API routes under `src/app/api/`.
- JSON request/response with typed contracts.
- No authentication in v1 (single-tenant deployment).

### User Interface

- Process upload and visualisation.
- Diagnostic summary dashboard.
- Scenario comparison view.
- Report export (JSON).

### Testing

- Unit tests for every pipeline stage (Vitest).
- Financial determinism tests (property-based where applicable).
- Integration tests for API routes.

### Deployment

- Vercel serverless deployment.
- Environment configuration via Vercel dashboard.
- Preview deployments per pull request.

## Explicitly Deferred (Post-v1)

| Item | Rationale |
|---|---|
| Multi-tenancy | Adds auth and data-isolation complexity |
| Webhook / event integrations | Requires message-queue infrastructure |
| Custom ontology editor | UI complexity; v1 uses code-defined ontologies |
| PDF report export | Depends on server-side rendering pipeline |
| Real-time streaming | Pipeline is batch-oriented by design |
| Role-based access control | Not needed for single-tenant v1 |
| External LLM integration | Conflicts with deterministic rule-based engine |
| Self-hosted / Docker deployment | Vercel is the only supported runtime in v1 |
| Internationalisation (i18n) | English-only in v1 |
| Marketplace for ontologies | Horizon 3 feature (see VISION.md) |

## Acceptance Criteria for v1

1. A user can upload process data and receive a diagnostic report.
2. At least three scenario types are available for what-if analysis.
3. Financial recalculations pass determinism tests (LAW 4).
4. The application deploys to Vercel with zero manual steps beyond `git push`.
5. All pipeline stages have ≥ 80 % unit-test coverage.

## Dependencies

| Dependency | Version Policy |
|---|---|
| Next.js | Latest stable (16+) |
| TypeScript | Latest stable (5+) |
| Prisma | Latest stable |
| Vitest | Latest stable |

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial v1 scope |
