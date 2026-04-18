# QUINTIA — Process Intelligence Platform

## What Is QUINTIA?

QUINTIA is a **process intelligence platform** that transforms raw business-process
data into actionable financial diagnostics, improvement scenarios, and
deterministic recalculations — all without relying on external large-language
models.

It is built with **Next.js**, **TypeScript**, and deployed on **Vercel**.

## Core Value Proposition

| Capability | Description |
|---|---|
| **Semantic Analysis** | Rule-based ontology maps process events to domain concepts. |
| **Diagnostics** | Automated detection of bottlenecks, rework loops, and SLA violations. |
| **Scenario Modelling** | What-if scenarios with deterministic financial impact. |
| **Deterministic Finance** | All monetary outputs computed by a single, auditable recalculator (LAW 4). |
| **No External LLM** | Every inference is explainable through rules — no opaque model calls. |

## 7-Stage Pipeline

```
Ontology → Process Graph → Diagnostics → Scenarios → Recalculation → Critic → Synthesis
```

Each stage has typed input/output contracts. See [PIPELINE_CONTRACTS.md](./PIPELINE_CONTRACTS.md).

## Key Design Principles

1. **Determinism first** — identical inputs always produce identical outputs.
2. **Auditability** — every recommendation traces back to a rule and a data point.
3. **Separation of concerns** — storage, computation, and presentation are decoupled.
4. **Progressive disclosure** — the UI starts simple; depth is available on demand.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend / API | Next.js 16+ (App Router) |
| Language | TypeScript (strict mode) |
| Hosting | Vercel (serverless) |
| Storage (dev) | In-memory adapter |
| Storage (prod) | Prisma adapter |
| CI | GitHub Actions |

## Repository Layout

```
src/
  app/            # Next.js pages and API routes
  lib/
    engine/       # 7-stage pipeline implementation
    financial/    # Deterministic recalculator (LAW 4)
    storage/      # Adapter-based persistence
  components/     # React UI components
docs/             # Project documentation
tests/            # Vitest test suites
```

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run test         # Vitest
npm run lint         # ESLint
```

Set `STORAGE_MODE=memory` for local development or `STORAGE_MODE=prisma` for
production persistence.

## Documentation Index

| Document | Purpose |
|---|---|
| [VISION.md](./VISION.md) | Long-term product vision |
| [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md) | v1 scope and deferred items |
| [LAW_4.md](./LAW_4.md) | Deterministic finance law |
| [DOMAIN_MODEL.md](./DOMAIN_MODEL.md) | Domain entities |
| [PIPELINE_CONTRACTS.md](./PIPELINE_CONTRACTS.md) | Stage contracts |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel deployment guide |
| [RUNBOOK.md](./RUNBOOK.md) | Operational runbook |
| [ADR_TEMPLATE.md](./ADR_TEMPLATE.md) | Architecture Decision Record template |
| [COPILOT_MASTER_PROMPT.md](./COPILOT_MASTER_PROMPT.md) | Copilot governance master prompt |

## License

Proprietary — see repository root for licensing details.
