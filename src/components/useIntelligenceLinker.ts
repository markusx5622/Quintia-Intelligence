'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  SelectionState,
  IntelligenceModel,
} from '@/src/lib/types/view-models';
import { EMPTY_SELECTION } from '@/src/lib/types/view-models';

/**
 * Hook for managing interactive cross-selection state between
 * process graph, diagnostics, and scenario comparison panels.
 */
export function useIntelligenceLinker(model: IntelligenceModel | null) {
  const [selection, setSelection] = useState<SelectionState>(EMPTY_SELECTION);

  const selectNode = useCallback(
    (nodeId: string) => {
      if (!model) return;
      if (selection.type === 'node' && selection.id === nodeId) {
        setSelection(EMPTY_SELECTION);
        return;
      }

      const node = model.graphNodes.find((n) => n.id === nodeId);
      if (!node) return;

      // Highlight related issues and scenarios
      const highlightedIssueIds = node.relatedIssueIds;
      const highlightedScenarioIds = node.relatedScenarioIds;

      // Highlight edges that connect to this node
      const highlightedEdgeKeys = model.graphEdges
        .filter((e) => e.from === nodeId || e.to === nodeId)
        .map((e) => `${e.from}->${e.to}`);

      setSelection({
        type: 'node',
        id: nodeId,
        highlightedNodeIds: [nodeId],
        highlightedIssueIds,
        highlightedScenarioIds,
        highlightedEdgeKeys,
      });
    },
    [model, selection],
  );

  const selectIssue = useCallback(
    (issueId: string) => {
      if (!model) return;
      if (selection.type === 'issue' && selection.id === issueId) {
        setSelection(EMPTY_SELECTION);
        return;
      }

      const issue = model.issues.find((i) => i.id === issueId);
      if (!issue) return;

      const highlightedNodeIds = issue.affectedNodeIds;
      const highlightedScenarioIds = issue.linkedScenarioIds;

      // Highlight edges whose source or target is an affected node
      const highlightedEdgeKeys = model.graphEdges
        .filter(
          (e) =>
            highlightedNodeIds.includes(e.from) ||
            highlightedNodeIds.includes(e.to),
        )
        .map((e) => `${e.from}->${e.to}`);

      setSelection({
        type: 'issue',
        id: issueId,
        highlightedNodeIds,
        highlightedIssueIds: [issueId],
        highlightedScenarioIds,
        highlightedEdgeKeys,
      });
    },
    [model, selection],
  );

  const selectScenario = useCallback(
    (scenarioId: string) => {
      if (!model) return;
      if (selection.type === 'scenario' && selection.id === scenarioId) {
        setSelection(EMPTY_SELECTION);
        return;
      }

      const scenario = model.scenarios.find((s) => s.id === scenarioId);
      if (!scenario) return;

      const highlightedIssueIds = scenario.linkedIssueIds;

      // Get all nodes affected by the linked issues
      const highlightedNodeIds = [
        ...new Set(
          model.issues
            .filter((i) => highlightedIssueIds.includes(i.id))
            .flatMap((i) => i.affectedNodeIds),
        ),
      ];

      const highlightedEdgeKeys = model.graphEdges
        .filter(
          (e) =>
            highlightedNodeIds.includes(e.from) ||
            highlightedNodeIds.includes(e.to),
        )
        .map((e) => `${e.from}->${e.to}`);

      setSelection({
        type: 'scenario',
        id: scenarioId,
        highlightedNodeIds,
        highlightedIssueIds,
        highlightedScenarioIds: [scenarioId],
        highlightedEdgeKeys,
      });
    },
    [model, selection],
  );

  const clearSelection = useCallback(() => {
    setSelection(EMPTY_SELECTION);
  }, []);

  const hasSelection = selection.type !== null;

  return useMemo(
    () => ({
      selection,
      selectNode,
      selectIssue,
      selectScenario,
      clearSelection,
      hasSelection,
    }),
    [selection, selectNode, selectIssue, selectScenario, clearSelection, hasSelection],
  );
}
