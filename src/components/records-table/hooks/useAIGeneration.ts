import { useState, useCallback } from "react";
import { usePocketBase } from "../../../context/usePocketBase";
import { generateAIContent, generateAIImage } from "../../../context/useAI";
import type { TrackedRecord } from "../../../context/PocketBaseContext";
import type { CollectionModel } from "pocketbase";
import type { AIConditionRule } from "../../../types/pocketbase.types";

interface UseAIGenerationReturn {
  aiGenerating: Record<string, boolean>;
  bulkGeneratingColumn: string | null;
  showAIBulkDialog: boolean;
  setShowAIBulkDialog: (show: boolean) => void;
  handleGenerateAI: (recordId: string, columnName: string) => Promise<void>;
}

function evaluateCondition(
  rule: AIConditionRule,
  recordData: Record<string, unknown>,
): boolean {
  const fieldValue = recordData[rule.column];
  
  switch (rule.operator) {
    case "eq":
      return fieldValue === rule.value;
    case "neq":
      return fieldValue !== rule.value;
    case "gt":
      return typeof fieldValue === "number" &&
             typeof rule.value === "number" &&
             fieldValue > rule.value;
    case "gte":
      return typeof fieldValue === "number" &&
             typeof rule.value === "number" &&
             fieldValue >= rule.value;
    case "lt":
      return typeof fieldValue === "number" &&
             typeof rule.value === "number" &&
             fieldValue < rule.value;
    case "lte":
      return typeof fieldValue === "number" &&
             typeof rule.value === "number" &&
             fieldValue <= rule.value;
    case "contains":
      return typeof fieldValue === "string" &&
             typeof rule.value === "string" &&
             fieldValue.includes(rule.value);
    case "not_contains":
      return typeof fieldValue === "string" &&
             typeof rule.value === "string" &&
             !fieldValue.includes(rule.value);
    default:
      return false;
  }
}

function findMatchingRule(
  conditionalRules: AIConditionRule[],
  recordData: Record<string, unknown>,
): AIConditionRule | null {
  for (const rule of conditionalRules) {
    if (evaluateCondition(rule, recordData)) {
      return rule;
    }
  }
  return null;
}

export function useAIGeneration(
  trackedRecords: TrackedRecord[],
  selectedCollection: CollectionModel | null,
  updateCell: (rowId: string, field: string, value: unknown) => void,
): UseAIGenerationReturn {
  const [aiGenerating, setAIGenerating] = useState<Record<string, boolean>>({});
  const [showAIBulkDialog, setShowAIBulkDialog] = useState(false);

  const { aiApiKey, getAIConfig } = usePocketBase();

  const handleGenerateAI = useCallback(
    async (recordId: string, columnName: string) => {
      if (!aiApiKey || !selectedCollection) return;

      const config = getAIConfig(selectedCollection.name, columnName);
      if (!config) return;

      const record = trackedRecords.find((r) => r.id === recordId);
      if (!record) return;

      let prompt = config.defaultPrompt;
      let variableColumns = config.defaultVariableColumns;

      if (config.conditionalRules && config.conditionalRules.length > 0) {
        const matchingRule = findMatchingRule(config.conditionalRules, record.data);
        if (matchingRule) {
          prompt = matchingRule.prompt;
          variableColumns = matchingRule.variableColumns;
        }
      }

      if (!prompt) return;

      setAIGenerating((prev) => ({
        ...prev,
        [`${recordId}-${columnName}`]: true,
      }));

      try {
        if (config.generateImage) {
          const file = await generateAIImage(
            aiApiKey,
            prompt,
            variableColumns,
            record.data,
            config.model || "gemini-3.1-flash-image-preview",
          );
          updateCell(recordId, columnName, file);
        } else {
          const content = await generateAIContent(
            aiApiKey,
            prompt,
            variableColumns,
            record.data,
            config.formatInstructions,
            config.model || "gemini-2.5-flash",
          );
          updateCell(recordId, columnName, content);
        }
      } catch (error) {
        console.error("AI generation failed:", error);
      } finally {
        setAIGenerating((prev) => {
          const next = { ...prev };
          delete next[`${recordId}-${columnName}`];
          return next;
        });
      }
    },
    [aiApiKey, selectedCollection, getAIConfig, trackedRecords, updateCell],
  );
 
  return {
    aiGenerating,
    bulkGeneratingColumn: null,
    showAIBulkDialog,
    setShowAIBulkDialog,
    handleGenerateAI,
  };
}
