import type { OntologyOutput } from '../types/contracts';

// ---------------------------------------------------------------------------
// Keyword dictionaries
// ---------------------------------------------------------------------------

const ROLE_KEYWORDS = [
  'manager', 'director', 'analyst', 'coordinator', 'specialist', 'agent',
  'officer', 'lead', 'supervisor', 'administrator', 'clerk', 'engineer',
  'architect', 'developer', 'consultant', 'auditor', 'controller',
  'representative', 'technician', 'operator', 'team lead', 'vp',
  'vice president', 'cfo', 'cto', 'ceo', 'chief', 'head of',
  'support agent', 'procurement officer', 'project manager',
];

const SYSTEM_KEYWORDS = [
  'erp', 'crm', 'sap', 'salesforce', 'jira', 'servicenow', 'sharepoint',
  'email', 'slack', 'teams', 'database', 'portal', 'platform', 'system',
  'software', 'application', 'tool', 'excel', 'spreadsheet', 'dashboard',
  'api', 'integration', 'workflow engine', 'ticketing system',
  'inventory system', 'billing system', 'helpdesk', 'intranet',
];

const ARTIFACT_KEYWORDS = [
  'report', 'form', 'document', 'invoice', 'receipt', 'request',
  'purchase order', 'ticket', 'contract', 'proposal', 'specification',
  'approval', 'notification', 'email', 'record', 'log', 'certificate',
  'memo', 'template', 'checklist', 'schedule', 'budget', 'quote',
  'complaint', 'incident report', 'change request',
];

const BOTTLENECK_KEYWORDS = [
  'delay', 'slow', 'waiting', 'backlog', 'bottleneck', 'manual',
  'approval', 'escalation', 'rework', 'error', 'exception', 'reject',
  'overdue', 'stuck', 'blocked', 'pending', 'handoff', 'hand-off',
  'queue', 'lag', 'overtime', 'missed deadline', 'duplicate',
];

// ---------------------------------------------------------------------------
// Extraction helpers
// ---------------------------------------------------------------------------

function extractByKeywords(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      found.add(kw);
    }
  }

  return Array.from(found).sort();
}

function extractEntities(text: string): string[] {
  const entities = new Set<string>();

  // Capitalised noun phrases (simple heuristic: 2–4 capitalised words in a row)
  const capsPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/g;
  let m: RegExpExecArray | null;
  while ((m = capsPattern.exec(text)) !== null) {
    const phrase = m[1].trim();
    // Skip very common sentence starters
    if (!['The', 'This', 'That', 'If', 'When', 'Our', 'After', 'Then', 'Once'].includes(phrase)) {
      entities.add(phrase);
    }
  }

  // Department-like nouns
  const deptPattern = /\b([\w\s]{2,30}?)\s+(?:department|team|unit|division|group)\b/gi;
  while ((m = deptPattern.exec(text)) !== null) {
    entities.add(m[0].trim());
  }

  return Array.from(entities).slice(0, 20).sort();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function extractOntology(narrative: string): OntologyOutput {
  return {
    entities: extractEntities(narrative),
    roles: extractByKeywords(narrative, ROLE_KEYWORDS),
    systems: extractByKeywords(narrative, SYSTEM_KEYWORDS),
    artifacts: extractByKeywords(narrative, ARTIFACT_KEYWORDS),
    bottleneck_candidates: extractByKeywords(narrative, BOTTLENECK_KEYWORDS),
  };
}
