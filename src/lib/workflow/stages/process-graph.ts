import type { ProcessGraphOutput } from '../../types/contracts';
import { buildProcessGraph } from '../../analysis/graph-builder';

export function runProcessGraphStage(narrative: string): ProcessGraphOutput {
  return buildProcessGraph(narrative);
}
