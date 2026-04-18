# QUINTIA — System Architecture

## Purpose

This document describes the high-level architecture of QUINTIA, its layers,
data flow, and key design decisions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   Vercel Edge                    │
├─────────────────────────────────────────────────┤
│              Next.js App Router                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Pages   │  │   API    │  │  Server       │  │
│  │  (UI)    │  │  Routes  │  │  Components   │  │
│  └────┬─────┘  └────┬─────┘  └───────┬───────┘  │
│       │              │                │          │
│  ┌────▼──────────────▼────────────────▼───────┐  │
│  │              Engine Layer                   │  │
│  │  ┌─────────────────────────────────────┐   │  │
│  │  │         7-Stage Pipeline            │   │  │
│  │  │  Ontology → Graph → Diagnostics →   │   │  │
│  │  │  Scenarios → Recalc → Critic →      │   │  │
│  │  │  Synthesis                          │   │  │
│  │  └─────────────────────────────────────┘   │  │
│  │  ┌──────────────────┐                      │  │
│  │  │  Recalculator    │  ← LAW 4             │  │
│  │  │  (financial/)    │                      │  │
│  │  └──────────────────┘                      │  │
│  └────────────────────┬───────────────────────┘  │
│                       │                          │
│  ┌────────────────────▼───────────────────────┐  │
│  │           Storage Abstraction              │  │
│  │  ┌────────────┐    ┌────────────────────┐  │  │
│  │  │  Memory    │    │  Prisma Adapter    │  │  │
│  │  │  Adapter   │    │  (PostgreSQL)      │  │  │
│  │  └────────────┘    └────────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Layers

### Presentation Layer

- **Next.js App Router** handles routing, server-side rendering, and API routes.
- React Server Components render the UI; client components handle interactivity.
- API routes expose JSON endpoints under `src/app/api/`.

### Engine Layer

- The 7-stage pipeline lives in `src/lib/engine/`.
- Each stage is a pure function with typed contracts (see [PIPELINE_CONTRACTS.md](./PIPELINE_CONTRACTS.md)).
- The **recalculator** (`src/lib/financial/recalculator.ts`) is the sole
  authority for financial computation (**LAW 4**).

### Storage Layer

- Abstracted behind a common interface.
- Adapter selected at runtime by `STORAGE_MODE` environment variable:
  - `memory` — in-memory store for development and tests.
  - `prisma` — PostgreSQL via Prisma for production.
- All adapters implement the same `StorageAdapter` interface.

## Data Flow

```
User uploads ProcessLog
  → API route validates input
  → Engine runs 7-stage pipeline
    → Stage 1–4: analysis (ontology, graph, diagnostics, scenarios)
    → Stage 5: recalculation (LAW 4 — deterministic)
    → Stage 6–7: critic + synthesis
  → Report persisted via storage adapter
  → Report returned to UI
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Rule-based engine (no LLM) | Determinism, auditability, compliance |
| Single recalculator module | LAW 4 — financial integrity |
| Storage abstraction | Decouples persistence from logic; enables testing |
| Serverless on Vercel | Zero infrastructure management; auto-scaling |
| TypeScript strict mode | Catches errors at compile time |
| Vitest for testing | Fast, native ESM support, compatible with Next.js |

## Security Considerations

- No authentication in v1 (single-tenant deployment behind Vercel access controls).
- No secrets in client-side code.
- Environment variables managed via Vercel dashboard (never committed).
- Prisma connection strings stored as encrypted environment variables.

## Performance

- Pipeline stages are CPU-bound and run in serverless function context.
- Vercel function timeout: 60 seconds (sufficient for v1 data sizes).
- In-memory adapter has no I/O overhead for development.
- Prisma adapter uses connection pooling for production.

## Extensibility

- New pipeline stages can be inserted by implementing the stage interface.
- New storage adapters implement `StorageAdapter`.
- New diagnostic types are added by extending the rule set.

## Related Documents

- [PIPELINE_CONTRACTS.md](./PIPELINE_CONTRACTS.md) — stage I/O contracts
- [DOMAIN_MODEL.md](./DOMAIN_MODEL.md) — entity definitions
- [LAW_4.md](./LAW_4.md) — financial determinism law
- [DEPLOYMENT.md](./DEPLOYMENT.md) — deployment guide

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial architecture document |
