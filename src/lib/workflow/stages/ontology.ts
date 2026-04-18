import type { OntologyOutput } from '../../types/contracts';
import { extractOntology } from '../../analysis/extractors';

export function runOntologyStage(narrative: string): OntologyOutput {
  return extractOntology(narrative);
}
