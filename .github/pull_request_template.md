## Description

<!-- Brief summary of the changes -->

## Changes

-

## Checklist

- [ ] **Law 4 compliance**: Financial outputs originate only from `src/lib/financial/recalculator.ts`
- [ ] **No external dependencies**: No new external LLM, queue, or orchestration services added
- [ ] **Contracts stable**: No breaking changes to `src/lib/types/contracts.ts` without version bump
- [ ] **Tests**: Added or updated tests for changed functionality
- [ ] **Build passes**: `npm run build` succeeds
- [ ] **Tests pass**: `npm run test` succeeds
- [ ] **Storage abstraction**: Business logic does not directly depend on a specific storage adapter
