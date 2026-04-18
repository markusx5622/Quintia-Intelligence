# Storage Skill — Storage Abstraction

## Purpose

This skill guides development and use of the storage abstraction layer in
QUINTIA.

## Architecture

QUINTIA uses an adapter pattern for persistence. The active adapter is
selected at runtime by the `STORAGE_MODE` environment variable.

```
STORAGE_MODE=memory  →  MemoryAdapter   (dev/test)
STORAGE_MODE=prisma  →  PrismaAdapter   (production)
```

> **Critical:** The env var is `STORAGE_MODE`, not `STORAGE_ADAPTER`.

## StorageAdapter Interface

All adapters must implement this interface:

```typescript
interface StorageAdapter {
  getProject(id: string): Promise<Project | null>;
  saveProject(project: Project): Promise<void>;
  getReport(projectId: string): Promise<Report | null>;
  saveReport(report: Report): Promise<void>;
  listProjects(): Promise<Project[]>;
  deleteProject(id: string): Promise<void>;
}
```

## Adapter Selection

```typescript
function createAdapter(): StorageAdapter {
  const mode = process.env.STORAGE_MODE ?? 'memory';
  switch (mode) {
    case 'memory': return new MemoryAdapter();
    case 'prisma': return new PrismaAdapter();
    default: throw new Error(`Unknown STORAGE_MODE: ${mode}`);
  }
}
```

## Rules

1. **Never import a concrete adapter directly** — always use the factory.
2. **Never hard-code persistence logic** in pipeline stages or API routes.
3. Pipeline stages must not call storage — the orchestrator handles I/O.
4. Tests should use `STORAGE_MODE=memory`.

## Adding a New Adapter

1. Create `src/lib/storage/<name>-adapter.ts`.
2. Implement the `StorageAdapter` interface.
3. Register in the factory with a new `STORAGE_MODE` value.
4. Add integration tests.
5. Update `docs/ARCHITECTURE.md` and `docs/DEPLOYMENT.md`.

## Testing

```typescript
describe('MemoryAdapter', () => {
  it('round-trips a project', async () => {
    const adapter = new MemoryAdapter();
    await adapter.saveProject(testProject);
    const result = await adapter.getProject(testProject.id);
    expect(result).toStrictEqual(testProject);
  });
});
```

## Reference

- `src/lib/storage/` — adapter implementations
- `docs/ARCHITECTURE.md` — storage layer in system context
