# Quintia

Quintia is a process intelligence platform that transforms operational narratives into structured process models, diagnostics, scenarios, and deterministic financial outputs.

## Core Guarantees
- Financial outputs are deterministic (Law 4).
- LLM providers only generate qualitative structured outputs.
- Pipeline execution is observable, resumable, and auditable.
- Provider abstraction prevents lock-in to any single model vendor.

## Tech Stack
- Next.js
- TypeScript
- Prisma
- PostgreSQL
- Inngest
- Vercel
- GitHub Actions
- GitHub Copilot

## Commands
- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run vercel-build`

## Local Development
1. Copy `.env.example` to `.env.local`
2. Install dependencies
3. Run Prisma generate/migrations
4. Start the app

## Deployment
Deployment target is Vercel. See `docs/DEPLOYMENT.md`.
