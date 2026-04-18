import { describe, it, expect, beforeEach } from 'vitest';
import { getStorage, resetStorage } from '@/src/lib/storage/factory';

describe('Storage Factory', () => {
  beforeEach(() => {
    resetStorage();
  });

  it('returns a storage adapter', () => {
    const storage = getStorage();
    expect(storage).toBeDefined();
    expect(typeof storage.createProject).toBe('function');
    expect(typeof storage.getProject).toBe('function');
    expect(typeof storage.createJob).toBe('function');
  });

  it('returns same instance on subsequent calls', () => {
    const a = getStorage();
    const b = getStorage();
    expect(a).toBe(b);
  });

  it('memory adapter: can create and retrieve a project', async () => {
    const storage = getStorage();
    const now = new Date().toISOString();
    const project = await storage.createProject({
      id: 'test-1',
      name: 'Test Project',
      description: 'Desc',
      narrative: 'Some narrative',
      createdAt: now,
      updatedAt: now,
    });

    expect(project.id).toBe('test-1');

    const fetched = await storage.getProject('test-1');
    expect(fetched).not.toBeNull();
    expect(fetched!.name).toBe('Test Project');
  });

  it('resetStorage creates fresh instance', async () => {
    const storage = getStorage();
    await storage.createProject({
      id: 'x',
      name: 'X',
      description: '',
      narrative: '',
      createdAt: '',
      updatedAt: '',
    });

    resetStorage();
    const fresh = getStorage();
    const result = await fresh.getProject('x');
    expect(result).toBeNull();
  });
});
