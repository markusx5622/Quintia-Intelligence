import type { StorageAdapter } from './types';
import { MemoryAdapter } from './memory-adapter';

let instance: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (!instance) {
    const mode = process.env.STORAGE_MODE || 'memory';
    switch (mode) {
      case 'memory':
        instance = new MemoryAdapter();
        break;
      case 'prisma':
        throw new Error(
          'Prisma adapter not yet implemented. Set STORAGE_MODE=memory or leave unset.',
        );
      default:
        throw new Error(`Unknown storage adapter: ${mode}`);
    }
  }
  return instance;
}

/** Reset singleton — for testing only. */
export function resetStorage(): void {
  instance = null;
}
