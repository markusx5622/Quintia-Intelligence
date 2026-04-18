# ADR-NNN: [Title of Decision]

## Status

**[Proposed | Accepted | Deprecated | Superseded]**

Superseded by: ADR-XXX (if applicable)

## Date

YYYY-MM-DD

## Context

Describe the situation that requires a decision. Include:

- What problem or requirement triggered this decision?
- What constraints exist (technical, organisational, timeline)?
- What assumptions are being made?

Be factual and specific. Reference related documents, issues, or discussions.

## Decision

State the decision clearly and concisely.

> We will [do X] because [reason].

Include:

- What was chosen and why.
- How this aligns with QUINTIA's vision and architecture.
- Any trade-offs accepted.

## Alternatives Considered

### Alternative 1: [Name]

- **Description:** Brief explanation.
- **Pros:** What would have been good about this approach.
- **Cons:** Why it was not chosen.

### Alternative 2: [Name]

- **Description:** Brief explanation.
- **Pros:** What would have been good about this approach.
- **Cons:** Why it was not chosen.

## Consequences

### Positive

- What improves as a result of this decision?

### Negative

- What trade-offs or risks does this decision introduce?

### Neutral

- What changes without being clearly positive or negative?

## Compliance

Check all that apply:

- [ ] This decision is consistent with [VISION.md](./VISION.md).
- [ ] This decision does not violate [LAW_4.md](./LAW_4.md).
- [ ] This decision is within [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md) for the current version.
- [ ] This decision has been reviewed by the platform lead.

## Implementation Notes

Describe any specific implementation guidance:

- Files or modules affected.
- Migration steps required.
- Testing requirements.

## References

- Link to related issues, PRs, or documents.
- Link to external resources consulted.

---

## How to Use This Template

1. Copy this file to `docs/adr/ADR-NNN-short-title.md`.
2. Replace `NNN` with the next sequential number.
3. Fill in all sections.
4. Submit as a pull request for team review.
5. Update status to **Accepted** once approved.

### Naming Convention

```
ADR-001-use-vercel-for-hosting.md
ADR-002-storage-abstraction-pattern.md
ADR-003-rule-based-engine-over-llm.md
```

### When to Write an ADR

- Choosing or changing a framework, library, or service.
- Changing the pipeline architecture or adding/removing stages.
- Any decision that affects LAW 4 or financial computation.
- Modifying the storage abstraction or adding adapters.
- Deviating from the current product scope.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2025-07-17 | QUINTIA Team | Initial ADR template |
