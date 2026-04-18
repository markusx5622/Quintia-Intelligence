# QUINTIA — Pipeline Stage Contracts

## Purpose

Each stage in the 7-stage pipeline has a typed input/output contract. This
document specifies those contracts so that stages can be developed, tested, and
replaced independently.

## Contract Principles

1. **Typed boundaries** — every stage input and output is a TypeScript type.
2. **No side effects** — stages are pure functions of their inputs.
3. **Deterministic** — same input always produces same output.
4. **Fail-fast** — invalid input throws a typed error, never silently degrades.

## Stage 1 — Ontology

Maps raw events to domain concepts using classification rules.

```typescript
// Input
interface OntologyInput {
  events: Event[];
  ontology: Ontology;
}

// Output
interface OntologyOutput {
  classifiedEvents: ClassifiedEvent[];
  unmappedEvents: Event[];
  coverage: number; // 0–1
}
```

**Invariants:**
- `classifiedEvents.length + unmappedEvents.length === events.length`
- `coverage === classifiedEvents.length / events.length`

## Stage 2 — Process Graph

Builds a directed graph from classified events.

```typescript
// Input
interface ProcessGraphInput {
  classifiedEvents: ClassifiedEvent[];
}

// Output
interface ProcessGraphOutput {
  graph: ProcessGraph;
  stats: GraphStats; // node count, edge count, variants
}
```

**Invariants:**
- Every `ClassifiedEvent.activity` maps to exactly one `GraphNode`.
- Edge frequencies are non-negative integers.

## Stage 3 — Diagnostics

Detects issues in the process graph.

```typescript
// Input
interface DiagnosticsInput {
  graph: ProcessGraph;
  classifiedEvents: ClassifiedEvent[];
  thresholds: DiagnosticThresholds;
}

// Output
interface DiagnosticsOutput {
  diagnostics: Diagnostic[];
}
```

**Invariants:**
- Each diagnostic has a unique `id`.
- `severity` is one of `low | medium | high | critical`.

## Stage 4 — Scenarios

Generates what-if improvement scenarios for each diagnostic.

```typescript
// Input
interface ScenariosInput {
  diagnostics: Diagnostic[];
  graph: ProcessGraph;
}

// Output
interface ScenariosOutput {
  scenarios: Scenario[];
}
```

**Invariants:**
- Every scenario references a valid `diagnosticId`.
- `parameters` contains only numeric values.

## Stage 5 — Recalculation

Computes deterministic financial impact for each scenario (**LAW 4**).

```typescript
// Input
interface RecalculationInput {
  scenarios: Scenario[];
  costs: CostParams;
}

// Output
interface RecalculationOutput {
  results: FinancialResult[];
}
```

**Invariants:**
- Computed exclusively in `src/lib/financial/recalculator.ts`.
- `results.length === scenarios.length` (one result per scenario).
- All monetary values are in minor currency units (cents).
- Output is deterministic: `f(x) === f(x)` for all `x`.

## Stage 6 — Critic

Validates and ranks scenarios by feasibility and impact.

```typescript
// Input
interface CriticInput {
  scenarios: Scenario[];
  financials: FinancialResult[];
  diagnostics: Diagnostic[];
}

// Output
interface CriticOutput {
  rankedScenarios: RankedScenario[];
  rejected: RejectedScenario[];
}
```

**Invariants:**
- `rankedScenarios` is sorted by `score` descending.
- `rankedScenarios.length + rejected.length === scenarios.length`.

## Stage 7 — Synthesis

Produces the final report combining all pipeline outputs.

```typescript
// Input
interface SynthesisInput {
  projectId: string;
  diagnostics: Diagnostic[];
  rankedScenarios: RankedScenario[];
  financials: FinancialResult[];
}

// Output
interface SynthesisOutput {
  report: Report;
}
```

**Invariants:**
- `report.generatedAt` is set at synthesis time.
- `report.financials` is passed through unchanged from stage 5.

## Error Handling

Each stage may throw a `PipelineStageError`:

```typescript
interface PipelineStageError {
  stage: string;       // e.g., "diagnostics"
  code: string;        // machine-readable error code
  message: string;     // human-readable description
  input?: unknown;     // offending input (sanitised)
}
```

## Testing Strategy

- Each stage is tested in isolation with fixture inputs.
- Contract tests verify that stage N's output satisfies stage N+1's input type.
- Determinism tests run each stage multiple times and assert identical output.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial pipeline contracts |
