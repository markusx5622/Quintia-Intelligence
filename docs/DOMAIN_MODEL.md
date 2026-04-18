# QUINTIA — Domain Model

## Purpose

This document describes the core domain entities in QUINTIA and their
relationships. All entities are defined as TypeScript types and flow through the
7-stage pipeline.

## Entity Overview

```
Project
  └── ProcessLog
        └── Event[]
              ├── Activity
              └── Transition
  └── Ontology
        └── Concept[]
        └── Rule[]
  └── ProcessGraph
        ├── Node[] (activities)
        └── Edge[] (transitions)
  └── Diagnostic[]
  └── Scenario[]
  └── FinancialResult[]
  └── Report
```

## Core Entities

### Project

Top-level container for a single analysis run.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `name` | `string` | Human-readable project name |
| `createdAt` | `string` | ISO 8601 timestamp |
| `config` | `ProjectConfig` | Currency, rounding, thresholds |

### ProcessLog

Raw event data uploaded by the user.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `projectId` | `string` | Parent project |
| `events` | `Event[]` | Ordered list of process events |

### Event

A single occurrence in a business process.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `caseId` | `string` | Groups events into a process instance |
| `activity` | `string` | Activity name |
| `timestamp` | `string` | ISO 8601 timestamp |
| `resource` | `string` | Actor / system that performed the activity |
| `attributes` | `Record<string, unknown>` | Extensible metadata |

### Ontology

A set of domain concepts and classification rules.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `concepts` | `Concept[]` | Domain concepts (e.g., "Approval", "Rework") |
| `rules` | `Rule[]` | Mapping rules from events to concepts |

### Concept

A named domain abstraction.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `label` | `string` | Human-readable name |
| `category` | `string` | Grouping (e.g., "value-add", "waste") |

### Rule

A deterministic mapping from event patterns to concepts.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `pattern` | `EventPattern` | Matching criteria |
| `conceptId` | `string` | Target concept |
| `confidence` | `number` | Rule confidence (0–1, deterministic) |

### ProcessGraph

Directed graph representing the discovered process.

| Field | Type | Description |
|---|---|---|
| `nodes` | `GraphNode[]` | Activities as nodes |
| `edges` | `GraphEdge[]` | Transitions between activities |

### Diagnostic

An identified issue or observation.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `type` | `DiagnosticType` | `bottleneck` · `rework` · `sla-violation` · `deviation` |
| `severity` | `Severity` | `low` · `medium` · `high` · `critical` |
| `description` | `string` | Human-readable explanation |
| `evidence` | `Evidence[]` | Supporting data references |

### Scenario

A what-if improvement proposal.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `diagnosticId` | `string` | Linked diagnostic |
| `description` | `string` | What changes in this scenario |
| `parameters` | `ScenarioParams` | Numeric assumptions |

### FinancialResult

Output of the deterministic recalculator (LAW 4).

| Field | Type | Description |
|---|---|---|
| `scenarioId` | `string` | Parent scenario |
| `savingsCents` | `number` | Projected savings in minor currency units |
| `costCents` | `number` | Implementation cost in minor currency units |
| `netImpactCents` | `number` | Net financial impact |
| `currency` | `string` | ISO 4217 currency code |

### Report

Final synthesised output.

| Field | Type | Description |
|---|---|---|
| `projectId` | `string` | Parent project |
| `diagnostics` | `Diagnostic[]` | All diagnostics |
| `scenarios` | `RankedScenario[]` | Scenarios ranked by the critic |
| `financials` | `FinancialResult[]` | Deterministic financial outputs |
| `generatedAt` | `string` | ISO 8601 timestamp |

## Relationships

- A **Project** contains one **ProcessLog**, one **Ontology**, and produces one **Report**.
- **Events** are classified into **Concepts** via **Rules**.
- The **ProcessGraph** is derived from **Events**.
- **Diagnostics** are derived from the **ProcessGraph**.
- **Scenarios** reference **Diagnostics**.
- **FinancialResults** are produced by `recalculator.ts` for each **Scenario**.
- The **Report** aggregates diagnostics, ranked scenarios, and financial results.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial domain model |
