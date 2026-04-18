# LAW 4 Skill — Deterministic Financial Outputs

## Purpose

This skill enforces LAW 4 across the QUINTIA codebase: all financial outputs
must be deterministic and computed exclusively in
`src/lib/financial/recalculator.ts`.

## Rules

1. **Single source of truth** — `src/lib/financial/recalculator.ts` is the only
   file that may compute monetary values.
2. **Pure function** — the recalculator must have no side effects, no I/O, and
   no dependency on external state.
3. **Deterministic** — identical inputs must always produce identical outputs.
4. **Integer arithmetic** — use cents (minor currency units) to avoid
   floating-point drift.
5. **No randomness** — `Math.random()` is forbidden.
6. **No time dependency** — calculations must not depend on `Date.now()` or
   wall-clock time.

## Detection Patterns

Flag code that matches these patterns outside `src/lib/financial/`:

- Variables named `cost`, `price`, `savings`, `revenue`, `amount`, `total`.
- Arithmetic on currency-like values.
- String formatting with `$`, `€`, `£`, or `¥` symbols.
- References to `CostParams`, `FinancialResult`, or `savingsCents`.

## Suggested Fix

When financial logic is found outside the recalculator:

1. Move the computation into `src/lib/financial/recalculator.ts`.
2. Export a new function or extend an existing one.
3. Call the recalculator from the original location.
4. Add a determinism test in `tests/`.

## Test Requirements

Every change to the recalculator must include:

- A test that runs the function 10+ times with the same input and asserts
  identical output.
- Boundary tests for zero, negative, and very large values.
- A test verifying integer-only arithmetic (no fractional cents).

## Reference

- `docs/LAW_4.md` — full law specification
- `src/lib/financial/recalculator.ts` — the recalculator module
