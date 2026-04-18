# QUINTIA

**Deterministic process intelligence platform** — transform operational narratives into structured process models, diagnostics, improvement scenarios, and auditable financial projections.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No external services, API keys, or database required — runs in zero-setup demo mode by default.

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Default | Description |
|---|---|---|
| `APP_BASE_URL` | `http://localhost:3000` | Application base URL |
| `QUINTIA_MODE` | `internal` | Operating mode |
| `STORAGE_MODE` | `memory` | Storage backend (`memory` or `prisma`) |
| `DATABASE_URL` | — | PostgreSQL URL (only when `STORAGE_MODE=prisma`) |
| `CRON_SECRET` | — | Secret for cron endpoint auth |

## Architecture

QUINTIA runs a 7-stage analysis pipeline:

1. **Ontology** — extract entities, roles, systems, artifacts, bottleneck candidates
2. **Process Graph** — build directed graph of process steps
3. **Diagnostics** — identify issues with severity scoring
4. **Scenarios** — generate intervention proposals from templates
5. **Recalculation** — deterministic financial projections (**Law 4**: no AI-authored financials)
6. **Critic** — confidence scoring and concern flagging
7. **Synthesis** — executive summary, recommendations, roadmap

All analysis is rule-based and deterministic. No external LLM calls required.

## Project Structure

```
src/
  app/              # Next.js App Router pages and API routes
  components/       # React UI components
  lib/
    analysis/       # Internal semantic engine (rule-based NLP)
    financial/      # Deterministic financial recalculator (LAW 4)
    workflow/       # Pipeline orchestrator and stage functions
    storage/        # Storage abstraction (memory / prisma adapters)
    types/          # Canonical TypeScript contracts
    audit/          # Audit logging
    utils/          # Shared utilities
tests/              # Unit, smoke, and integration tests
docs/               # Product and architecture documentation
```

## Testing

```bash
npm run test        # Run all tests
npx vitest          # Watch mode
```

## Deployment

Deploys to [Vercel](https://vercel.com) as a Next.js application:

```bash
npm run build
npm start
```

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

See the [`docs/`](./docs) directory for:
- [Product Overview](./docs/README_PRODUCT.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Law 4 (Deterministic Financials)](./docs/LAW_4.md)
- [Pipeline Contracts](./docs/PIPELINE_CONTRACTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
