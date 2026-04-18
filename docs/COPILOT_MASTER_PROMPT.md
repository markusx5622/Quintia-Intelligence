# QUINTIA — Copilot Master Prompt

## Purpose

This document defines the rules and context that govern GitHub Copilot's
behaviour when working in the QUINTIA codebase. It is the single source of
truth for all Copilot agents and skills.

## System Identity

You are a code assistant working on **QUINTIA**, a process intelligence platform.
QUINTIA uses a **rule-based semantic engine** — not an external LLM — to analyse
business processes and produce deterministic financial outputs.

## Technology Context

| Aspect | Detail |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Hosting | Vercel (serverless) |
| Testing | Vitest |
| Linting | ESLint |
| Storage | Adapter pattern — `STORAGE_MODE` env var |
| Financial | `src/lib/financial/recalculator.ts` (LAW 4) |

## Inviolable Laws

### LAW 4 — Deterministic Financial Outputs

> All financial outputs are deterministic and computed exclusively in
> `src/lib/financial/recalculator.ts`.

**Rules for Copilot:**

1. **Never** generate monetary computation outside `src/lib/financial/recalculator.ts`.
2. **Never** introduce `Math.random()`, date-dependent logic, or external API
   calls into the recalculator.
3. If you detect financial logic outside the recalculator, **flag it** and
   suggest moving it.
4. Use integer arithmetic (cents / minor units) for all monetary values.
5. The recalculator must remain a **pure function** — no side effects.

## Pipeline Rules

The 7-stage pipeline must follow these contracts:

```
Ontology → Process Graph → Diagnostics → Scenarios → Recalculation → Critic → Synthesis
```

1. Each stage is a **pure function** with typed input and output.
2. Stage outputs must satisfy the next stage's input contract.
3. No stage may skip ahead or access another stage's internals.
4. Error handling uses `PipelineStageError`.

## Storage Rules

1. The environment variable is **`STORAGE_MODE`** (not `STORAGE_ADAPTER`).
2. Valid values: `memory` (development) or `prisma` (production).
3. All adapters implement the `StorageAdapter` interface.
4. Never hard-code a storage implementation — always go through the adapter.

## Code Style

1. TypeScript strict mode — no `any` types unless unavoidable.
2. Prefer `interface` over `type` for object shapes.
3. Use explicit return types on exported functions.
4. Keep functions small and single-purpose.
5. Comment only when the "why" is non-obvious; avoid restating the code.

## Testing Rules

1. Every pipeline stage needs unit tests.
2. Financial determinism tests: run N times, assert identical output.
3. Use Vitest — do not introduce other test frameworks.
4. Test files go in `tests/` mirroring `src/` structure.

## File Ownership

| Path | Responsibility |
|---|---|
| `src/lib/engine/` | Pipeline stages |
| `src/lib/financial/recalculator.ts` | Financial computation (LAW 4) |
| `src/lib/storage/` | Storage adapters |
| `src/app/api/` | API routes |
| `src/app/` (pages) | UI pages |
| `src/components/` | React components |
| `tests/` | Test suites |
| `docs/` | Documentation |
| `.copilot/` | Copilot governance |

## What Copilot Must Not Do

- Generate code that calls external LLMs or AI APIs.
- Produce financial calculations outside the recalculator.
- Use `STORAGE_ADAPTER` instead of `STORAGE_MODE`.
- Add dependencies without checking for vulnerabilities.
- Skip TypeScript strict checks or use `@ts-ignore` without justification.
- Introduce non-deterministic behaviour in the pipeline.

## Reference Documents

- [LAW_4.md](./LAW_4.md) — financial determinism law
- [PIPELINE_CONTRACTS.md](./PIPELINE_CONTRACTS.md) — stage contracts
- [DOMAIN_MODEL.md](./DOMAIN_MODEL.md) — domain entities
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Vercel deployment

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial master prompt |
