# QUINTIA — Long-Term Vision

## Purpose

This document articulates the long-term vision for QUINTIA as a process
intelligence platform. It guides architectural decisions, roadmap prioritisation,
and contributor alignment.

## Vision Statement

> QUINTIA will be the reference platform for **deterministic, auditable process
> intelligence** — enabling organisations to understand, diagnose, and optimise
> their business processes with full financial transparency and zero reliance on
> opaque AI models.

## Strategic Pillars

### 1. Deterministic Intelligence

Every output — from a diagnostic flag to a dollar amount — is reproducible and
traceable to its source data and governing rule. This is non-negotiable (see
[LAW_4.md](./LAW_4.md)).

### 2. Rule-Based Semantic Engine

QUINTIA uses a curated ontology and rule engine rather than statistical or
generative models. This provides:

- **Explainability** — every conclusion cites the rule that produced it.
- **Stability** — results do not drift with model retraining.
- **Compliance** — deterministic outputs satisfy audit requirements.

### 3. Process-Centric Domain Model

The platform is built around **processes**, not generic data. The domain model
(ontology, process graphs, activities, transitions) reflects how organisations
actually operate.

### 4. Financial Integrity

All monetary calculations flow through a single, tested recalculator module
(`src/lib/financial/recalculator.ts`). No other code path may produce financial
figures.

### 5. Cloud-Native Simplicity

Deployed as a serverless Next.js application on Vercel, QUINTIA avoids
infrastructure complexity. The storage abstraction (`STORAGE_MODE`) lets
developers run locally with an in-memory adapter while production uses Prisma.

## Long-Term Goals

| Horizon | Goal |
|---|---|
| **H1 (v1)** | Core pipeline, deterministic recalculation, single-tenant deployment. |
| **H2 (v2)** | Multi-tenant support, webhook integrations, extended scenario library. |
| **H3 (v3)** | Marketplace for custom ontologies, federated process mining across orgs. |
| **H4** | Industry-specific editions (finance, healthcare, supply chain). |

## Anti-Goals

These are things QUINTIA deliberately does **not** pursue:

- **External LLM integration** — the engine is rule-based by design.
- **Real-time streaming** — the pipeline operates on batch snapshots.
- **Self-hosted infrastructure** — Vercel serverless is the target runtime.
- **General-purpose BI** — QUINTIA is process intelligence, not a dashboard tool.

## Guiding Metrics

| Metric | Target |
|---|---|
| Pipeline determinism | 100 % reproducible outputs for identical inputs |
| Recalculation accuracy | Zero floating-point drift across runs |
| Deployment time | < 90 seconds from push to production |
| Cold-start latency | < 2 seconds for any API route |

## Alignment

All architecture decisions, feature proposals, and pull requests should be
evaluated against this vision. Use the [ADR_TEMPLATE.md](./ADR_TEMPLATE.md) for
any decision that materially affects the platform direction.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial vision document |
