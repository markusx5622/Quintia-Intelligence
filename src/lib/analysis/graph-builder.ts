import type { ProcessGraphOutput, ProcessGraphNode, ProcessGraphEdge } from '../types/contracts';

// ---------------------------------------------------------------------------
// Action verb detection
// ---------------------------------------------------------------------------

const ACTION_VERBS = [
  'submit', 'review', 'approve', 'reject', 'send', 'sent', 'receive', 'process',
  'check', 'verify', 'create', 'update', 'assign', 'escalate', 'notify',
  'log', 'record', 'forward', 'complete', 'close', 'open', 'resolve',
  'inspect', 'validate', 'prepare', 'dispatch', 'route', 'routed', 'transfer',
  'evaluate', 'assess', 'confirm', 'sign', 'authorize', 'deny',
  'request', 'initiate', 'start', 'begin', 'finish', 'deliver',
  'report', 'reported', 'investigate', 'monitor', 'triage', 'categorize', 'classify',
  'prioritize', 'diagnose', 'remediate', 'deploy', 'patch', 'restore',
  'reviewed', 'assigned', 'escalated', 'forwarded', 'logged', 'resolved',
];

// ---------------------------------------------------------------------------
// Bottleneck / problem indicators — these are NOT process steps
// ---------------------------------------------------------------------------

const BOTTLENECK_INDICATORS = [
  'bottleneck', 'causes delay', 'this causes', 'the main problem',
  'the main issue', 'the main bottleneck', 'leading to', 'results in',
  'missed sla', 'duplicated work', 'unclear ownership', 'incomplete',
  'lack of', 'insufficient', 'causes delays', 'missed deadline',
];

// ---------------------------------------------------------------------------
// Branching / conditional indicators
// ---------------------------------------------------------------------------

const BRANCH_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\b(?:network|infrastructure)\s+(?:issues?|problems?|incidents?)\b/i, label: 'network/infrastructure' },
  { pattern: /\b(?:security)[\s-]+(?:related|issues?|incidents?|threats?)\b/i, label: 'security-related' },
  { pattern: /\b(?:critical)\s+(?:incidents?|issues?|cases?|severity)\b/i, label: 'critical incidents' },
  { pattern: /\b(?:high)\s+(?:severity|priority|impact)\b/i, label: 'high severity' },
  { pattern: /\b(?:if|when)\s+(?:the\s+)?(?:amount|value|cost)\s+(?:exceeds?|over|above)\b/i, label: 'threshold exceeded' },
  { pattern: /\b(?:if|when)\s+(?:over|above|more than)\s+[\$€£]\s*[\d,]+\b/i, label: 'amount threshold' },
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

function isBottleneckSentence(sentence: string): boolean {
  const lower = sentence.toLowerCase();
  return BOTTLENECK_INDICATORS.some((ind) => lower.includes(ind));
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
  // Branching / routing / conditional
  if (/\b(are\s+(?:sent|routed|forwarded|escalated)\s+to)\b/.test(lower)) return 'decision';
  if (/\b(is\s+(?:sent|routed|forwarded|escalated)\s+to)\b/.test(lower)) return 'decision';
  if (/\b(if|whether|decision|condition|depending)\b/.test(lower)) return 'decision';
  if (/\b(start|begin|initiate|report(?:ed)?(?:\s+through)?)\b/.test(lower)) return 'start';
  if (/\b(end|finish|complete|close|deliver|resolve)\b/.test(lower)) return 'end';
  if (/\b(review(?:ed|s)?(?:\s+by)?|approv(?:e|al))\b/.test(lower)) return 'review';
  if (/\b(escalat(?:e|ed|ion)\s+to)\b/.test(lower)) return 'escalation';
  return 'process';
}

/**
 * Detect branching targets from a sentence (e.g. "network issues → infrastructure team").
 */
function detectBranchTarget(sentence: string): { label: string; condition: string } | null {
  for (const bp of BRANCH_PATTERNS) {
    if (bp.pattern.test(sentence)) {
      return { label: labelFromSentence(sentence), condition: bp.label };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function buildProcessGraph(narrative: string): ProcessGraphOutput {
  const sentences = splitSentences(narrative);

  // Separate process-step sentences from bottleneck/problem sentences
  const stepSentences: string[] = [];
  const bottleneckSentences: string[] = [];
  for (const s of sentences) {
    if (isBottleneckSentence(s)) {
      bottleneckSentences.push(s);
    } else if (isProcessStep(s)) {
      stepSentences.push(s);
    }
  }

  // Fallback: if nothing matched, use non-bottleneck sentences
  const steps = stepSentences.length > 0
    ? stepSentences
    : sentences.filter((s) => !isBottleneckSentence(s)).slice(0, 10);

  // Build nodes
  const nodes: ProcessGraphNode[] = steps.map((s, i) => ({
    id: `step-${i + 1}`,
    label: labelFromSentence(s),
    type: detectNodeType(s),
  }));

  // Build edges — detect branching structure instead of pure linear chain
  const edges: ProcessGraphEdge[] = [];

  // Identify which nodes are branch targets (decision/escalation nodes that
  // follow a shared predecessor like severity assignment or triage)
  const branchSourceIndices: Set<number> = new Set();
  const branchTargetMap: Map<number, string> = new Map(); // nodeIndex → condition label

  for (let i = 0; i < steps.length; i++) {
    const branch = detectBranchTarget(steps[i]);
    if (branch) {
      branchTargetMap.set(i, branch.condition);
    }
  }

  // Find clusters of consecutive branch targets — they share the node before them
  if (branchTargetMap.size >= 2) {
    const branchIndices = Array.from(branchTargetMap.keys()).sort((a, b) => a - b);
    // Group consecutive or near-consecutive indices (within gap of 1)
    const groups: number[][] = [];
    let currentGroup = [branchIndices[0]];

    for (let g = 1; g < branchIndices.length; g++) {
      if (branchIndices[g] - branchIndices[g - 1] <= 2) {
        currentGroup.push(branchIndices[g]);
      } else {
        groups.push(currentGroup);
        currentGroup = [branchIndices[g]];
      }
    }
    groups.push(currentGroup);

    for (const group of groups) {
      // The source node is the one just before the first branch target
      const sourceIdx = group[0] > 0 ? group[0] - 1 : 0;
      branchSourceIndices.add(sourceIdx);
      for (const targetIdx of group) {
        branchSourceIndices.add(targetIdx); // mark these so linear chain skips them
      }
    }

    // Create branching edges
    for (const group of groups) {
      const sourceIdx = group[0] > 0 ? group[0] - 1 : 0;
      for (const targetIdx of group) {
        edges.push({
          from: nodes[sourceIdx].id,
          to: nodes[targetIdx].id,
          label: branchTargetMap.get(targetIdx) || undefined,
        });
      }
    }
  }

  // Build remaining linear chain for non-branch nodes
  let lastLinearId: string | null = null;
  for (let i = 0; i < nodes.length; i++) {
    // Skip nodes that are branch targets (they already have incoming edges)
    if (branchTargetMap.has(i) && branchSourceIndices.size > 0) {
      // After a branch target, if there is a next non-branch node, connect from branch to it
      if (i + 1 < nodes.length && !branchTargetMap.has(i + 1)) {
        // Only add if not already connected
        const alreadyConnected = edges.some((e) => e.from === nodes[i].id && e.to === nodes[i + 1].id);
        if (!alreadyConnected) {
          edges.push({ from: nodes[i].id, to: nodes[i + 1].id, label: undefined });
        }
      }
      continue;
    }

    if (lastLinearId !== null) {
      const alreadyConnected = edges.some((e) => e.from === lastLinearId && e.to === nodes[i].id);
      if (!alreadyConnected) {
        edges.push({ from: lastLinearId, to: nodes[i].id, label: undefined });
      }
    }
    lastLinearId = nodes[i].id;
  }

  // Build summary
  const branchCount = branchTargetMap.size;
  const decisionCount = nodes.filter((n) => n.type === 'decision' || n.type === 'escalation').length;
  const bottleneckNote = bottleneckSentences.length > 0
    ? ` ${bottleneckSentences.length} bottleneck/problem statement(s) were excluded from the graph and routed to diagnostics.`
    : '';

  const graph_summary =
    nodes.length > 0
      ? `Process graph with ${nodes.length} steps and ${edges.length} transitions` +
        (branchCount > 0 ? ` including ${branchCount} conditional branch(es)` : '') +
        (decisionCount > 0 ? ` and ${decisionCount} decision/escalation point(s)` : '') +
        `.${bottleneckNote}`
      : 'No process steps could be identified from the narrative.';

  return { nodes, edges, graph_summary };
}
