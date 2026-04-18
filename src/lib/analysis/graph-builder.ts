import type { ProcessGraphOutput, ProcessGraphNode, ProcessGraphEdge } from '../types/contracts';

// ---------------------------------------------------------------------------
// Action verb detection
// ---------------------------------------------------------------------------

const ACTION_VERBS = [
  'submit', 'review', 'approve', 'reject', 'send', 'receive', 'process',
  'check', 'verify', 'create', 'update', 'assign', 'escalate', 'notify',
  'log', 'record', 'forward', 'complete', 'close', 'open', 'resolve',
  'inspect', 'validate', 'prepare', 'dispatch', 'route', 'transfer',
  'evaluate', 'assess', 'confirm', 'sign', 'authorize', 'deny',
  'request', 'initiate', 'start', 'begin', 'finish', 'deliver',
];

// ---------------------------------------------------------------------------
// Sentence splitting + step extraction
// ---------------------------------------------------------------------------

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

function isProcessStep(sentence: string): boolean {
  const lower = sentence.toLowerCase();
  return ACTION_VERBS.some((v) => lower.includes(v));
}

function labelFromSentence(sentence: string): string {
  // Strip leading numbering like "1.", "Step 2:", etc.
  let clean = sentence.replace(/^(?:step\s*)?\d+[.:)\-]\s*/i, '').trim();
  // Truncate for readability
  if (clean.length > 80) clean = clean.slice(0, 77) + '...';
  return clean;
}

function detectNodeType(sentence: string): string {
  const lower = sentence.toLowerCase();
  if (/\b(if|whether|decision|condition|check)\b/.test(lower)) return 'decision';
  if (/\b(start|begin|initiate)\b/.test(lower)) return 'start';
  if (/\b(end|finish|complete|close|deliver)\b/.test(lower)) return 'end';
  return 'process';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function buildProcessGraph(narrative: string): ProcessGraphOutput {
  const sentences = splitSentences(narrative);
  const stepSentences = sentences.filter(isProcessStep);

  // Fallback: if nothing matched, use all sentences
  const steps = stepSentences.length > 0 ? stepSentences : sentences.slice(0, 10);

  const nodes: ProcessGraphNode[] = steps.map((s, i) => ({
    id: `step-${i + 1}`,
    label: labelFromSentence(s),
    type: detectNodeType(s),
  }));

  const edges: ProcessGraphEdge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      from: nodes[i].id,
      to: nodes[i + 1].id,
      label: undefined,
    });
  }

  const graph_summary =
    nodes.length > 0
      ? `Process graph with ${nodes.length} steps and ${edges.length} transitions.`
      : 'No process steps could be identified from the narrative.';

  return { nodes, edges, graph_summary };
}
