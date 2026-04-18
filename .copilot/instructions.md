# QUINTIA — Copilot Instructions

## Project Overview

QUINTIA is a process intelligence platform built with Next.js, TypeScript, and
deployed on Vercel. It uses a rule-based semantic engine (no external LLM) to
analyse business processes and produce deterministic financial outputs.

## Inviolable Rules

### LAW 4 — Deterministic Financial Outputs

All financial computation happens exclusively in
`src/lib/financial/recalculator.ts`. Never generate monetary logic elsewhere.

### Storage Variable

The environment variable is `STORAGE_MODE` (not `STORAGE_ADAPTER`).
Valid values: `memory` | `prisma`.

### No External LLM

QUINTIA uses a rule-based engine. Do not generate code that calls OpenAI,
Anthropic, or any external AI/LLM API.

## Architecture

- **Pipeline:** Ontology → Process Graph → Diagnostics → Scenarios → Recalculation → Critic → Synthesis
- **Engine:** `src/lib/engine/` — pure functions with typed contracts
- **Finance:** `src/lib/financial/recalculator.ts` — LAW 4
- **Storage:** `src/lib/storage/` — adapter pattern via `STORAGE_MODE`
- **API:** `src/app/api/` — Next.js API routes
- **UI:** `src/app/` pages + `src/components/`
- **Tests:** `tests/` — Vitest

## Code Style

- TypeScript strict mode; avoid `any`.
- Explicit return types on exported functions.
- Prefer `interface` over `type` for object shapes.
- Comment only the "why", not the "what".

## Testing

- Use Vitest exclusively.
- Every pipeline stage must have unit tests.
- Financial code must have determinism tests.

## Key Documents

- `docs/LAW_4.md` — financial determinism law
- `docs/PIPELINE_CONTRACTS.md` — stage input/output contracts
- `docs/ARCHITECTURE.md` — system architecture
- `docs/DOMAIN_MODEL.md` — domain entities
- `docs/COPILOT_MASTER_PROMPT.md` — full Copilot context
