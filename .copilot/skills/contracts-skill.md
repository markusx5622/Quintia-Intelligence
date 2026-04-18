# Contracts Skill — Pipeline Stage Contracts

## Purpose

This skill ensures pipeline stage contracts are respected when modifying or
extending the QUINTIA pipeline.

## Contract Summary

| Stage | Input Type | Output Type |
|---|---|---|
| Ontology | `OntologyInput` | `OntologyOutput` |
| Process Graph | `ProcessGraphInput` | `ProcessGraphOutput` |
| Diagnostics | `DiagnosticsInput` | `DiagnosticsOutput` |
| Scenarios | `ScenariosInput` | `ScenariosOutput` |
| Recalculation | `RecalculationInput` | `RecalculationOutput` |
| Critic | `CriticInput` | `CriticOutput` |
| Synthesis | `SynthesisInput` | `SynthesisOutput` |

## Key Invariants

- Stage N output type must satisfy Stage N+1 input type.
- All stages are pure functions — no side effects.
- Recalculation stage (Stage 5) is governed by LAW 4.
- Error handling uses `PipelineStageError`.

## When Modifying a Contract

1. Update the TypeScript types for the affected stage(s).
2. Update all adjacent stages that consume or produce the changed type.
3. Update `docs/PIPELINE_CONTRACTS.md` with the new contract.
4. Run existing tests: `npm run test`.
5. Add or update contract tests verifying type compatibility.

## Contract Tests Pattern

```typescript
import { describe, it, expect } from 'vitest';

describe('contract: ontology → process-graph', () => {
  it('ontology output satisfies process-graph input', () => {
    const ontologyOutput = runOntology(fixtures.ontologyInput);
    // Should not throw — types are compatible
    const graphOutput = runProcessGraph({
      classifiedEvents: ontologyOutput.classifiedEvents,
    });
    expect(graphOutput.graph.nodes.length).toBeGreaterThan(0);
  });
});
```

## Common Violations

| Violation | Fix |
|---|---|
| Stage returns extra fields | Keep output minimal; add to type if needed |
| Stage expects field not in previous output | Add field to upstream output type |
| Stage mutates its input | Clone before modification |
| Financial logic in a non-recalculation stage | Move to recalculator (LAW 4) |

## Reference

- `docs/PIPELINE_CONTRACTS.md` — full contract specifications
- `src/lib/engine/` — stage implementations
