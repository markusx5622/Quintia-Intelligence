# LAW 4 — Deterministic Financial Outputs

## Statement

> **LAW 4:** All financial outputs in QUINTIA are deterministic. They are
> computed exclusively in `src/lib/financial/recalculator.ts`. No other code
> path may produce, modify, or approximate monetary values.

## Why This Law Exists

Financial figures drive business decisions. If two runs of the same pipeline on
the same data produce different numbers, the platform cannot be trusted. LAW 4
eliminates this risk by construction.

| Concern | How LAW 4 Addresses It |
|---|---|
| **Reproducibility** | Same inputs always yield same outputs — no randomness, no model variance. |
| **Auditability** | A single file is the source of truth; auditors review one module. |
| **Testability** | Determinism tests are straightforward property-based checks. |
| **Blast radius** | Financial bugs are confined to one module, simplifying triage. |

## The Recalculator

**Location:** `src/lib/financial/recalculator.ts`

This module is the **sole authority** for all monetary computation. It:

1. Receives typed scenario data and cost parameters.
2. Applies deterministic arithmetic (no floating-point shortcuts).
3. Returns typed financial results with full traceability.

### Design Constraints

- **No external calls** — the recalculator must not fetch data or call APIs.
- **No randomness** — no `Math.random()`, no sampling, no stochastic methods.
- **No date-dependent logic** — calculations must not depend on wall-clock time.
- **Pure function** — output depends only on input parameters.
- **Integer arithmetic preferred** — use cents/minor units to avoid IEEE 754 drift.

## Enforcement

### Code Review

Every pull request is checked against LAW 4:

- Does the PR introduce monetary computation outside `recalculator.ts`? → **Reject.**
- Does it add non-deterministic logic inside the recalculator? → **Reject.**

### Automated Checks

| Check | Implementation |
|---|---|
| Determinism test | Run recalculator N times with same input; assert identical output. |
| Isolation lint | Grep for currency symbols / financial keywords outside the recalculator. |
| Purity test | Assert no side effects (no I/O, no mutation of external state). |

### Copilot Governance

The `.copilot/skills/law4-skill.md` instructs GitHub Copilot to:

- Never generate financial computation outside `recalculator.ts`.
- Flag any code that appears to duplicate recalculator logic.
- Suggest moving monetary code into the recalculator when detected.

## Examples

### ✅ Correct

```typescript
// src/lib/financial/recalculator.ts
export function recalculate(scenario: Scenario, costs: CostParams): FinancialResult {
  const savingsCents = scenario.reducedCycles * costs.costPerCycleCents;
  return { savingsCents, currency: costs.currency };
}
```

### ❌ Violation

```typescript
// src/app/api/report/route.ts  ← WRONG LOCATION
const savings = scenario.reducedCycles * costPerCycle; // LAW 4 violation
```

## Exceptions

There are **no exceptions** to LAW 4. If a new financial calculation is needed,
it must be added to `recalculator.ts`.

If a compelling reason arises to change this policy, file an ADR using the
[ADR_TEMPLATE.md](./ADR_TEMPLATE.md) and obtain explicit team approval.

## Related Documents

- [PIPELINE_CONTRACTS.md](./PIPELINE_CONTRACTS.md) — recalculation stage contract
- [ARCHITECTURE.md](./ARCHITECTURE.md) — where the recalculator fits
- [COPILOT_MASTER_PROMPT.md](./COPILOT_MASTER_PROMPT.md) — Copilot enforcement rules

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial LAW 4 specification |
