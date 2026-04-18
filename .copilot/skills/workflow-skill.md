# Workflow Skill — Pipeline Development

## Purpose

This skill guides development of the 7-stage pipeline in QUINTIA, ensuring
stages follow typed contracts and remain pure, deterministic functions.

## Pipeline Stages

```
1. Ontology → 2. Process Graph → 3. Diagnostics →
4. Scenarios → 5. Recalculation → 6. Critic → 7. Synthesis
```

## Stage Implementation Rules

1. Each stage is a **pure function** — no side effects, no I/O.
2. Input and output types are defined per `docs/PIPELINE_CONTRACTS.md`.
3. Stages must not access other stages' internals.
4. Error handling uses `PipelineStageError`.
5. All stages are deterministic — same input → same output.

## Creating a New Stage

```typescript
// src/lib/engine/<stage-name>.ts

import type { StageInput, StageOutput } from './types';

export function runStage(input: StageInput): StageOutput {
  // Pure, deterministic logic
  return output;
}
```

## Testing a Stage

```typescript
// tests/lib/engine/<stage-name>.test.ts

import { describe, it, expect } from 'vitest';
import { runStage } from '@/lib/engine/<stage-name>';

describe('<stage-name>', () => {
  it('produces correct output for valid input', () => {
    const input = { /* fixture */ };
    const output = runStage(input);
    expect(output).toMatchObject({ /* expected */ });
  });

  it('is deterministic', () => {
    const input = { /* fixture */ };
    const a = runStage(input);
    const b = runStage(input);
    expect(a).toStrictEqual(b);
  });
});
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Stage calls a database | Use storage adapter at the orchestrator level |
| Stage computes financial values | Move to recalculator (LAW 4) |
| Stage uses `Date.now()` | Pass timestamp as input parameter |
| Stage mutates input | Clone input before modifying |

## Reference

- `docs/PIPELINE_CONTRACTS.md` — stage contracts
- `src/lib/engine/` — pipeline implementation
