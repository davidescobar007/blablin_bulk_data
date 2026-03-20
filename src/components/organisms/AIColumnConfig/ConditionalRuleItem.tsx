import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PromptEditor } from "./PromptEditor";
import { VariableSelector } from "./VariableSelector";
import type { AIConditionRule, AIOperator } from "../../../types/pocketbase.types";

const OPERATORS: Array<{ value: AIOperator; label: string }> = [
  { value: "eq", label: "=" },
  { value: "neq", label: "≠" },
  { value: "gt", label: ">" },
  { value: "gte", label: "≥" },
  { value: "lt", label: "<" },
  { value: "lte", label: "≤" },
  { value: "contains", label: "contiene" },
  { value: "not_contains", label: "no contiene" },
];

interface ConditionalRuleItemProps {
  rule: AIConditionRule;
  availableColumns: string[];
  onUpdate: (rule: AIConditionRule) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ConditionalRuleItem({
  rule,
  availableColumns,
  onUpdate,
  onRemove,
  canRemove,
}: ConditionalRuleItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = <K extends keyof AIConditionRule>(
    key: K,
    value: AIConditionRule[K],
  ) => {
    onUpdate({ ...rule, [key]: value });
  };

  const handleToggleVariable = (variable: string) => {
    const currentVariables = rule.variableColumns || [];
    const newVariables = currentVariables.includes(variable)
      ? currentVariables.filter((v) => v !== variable)
      : [...currentVariables, variable];
    handleUpdate("variableColumns", newVariables);
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <select
            value={rule.column}
            onChange={(e) => handleUpdate("column", e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm flex-1"
          >
            <option value="">Seleccionar columna</option>
            {availableColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <select
            value={rule.operator}
            onChange={(e) => handleUpdate("operator", e.target.value as AIOperator)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm w-24"
          >
            {OPERATORS.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={String(rule.value)}
            onChange={(e) => {
              const numValue = parseFloat(e.target.value);
              handleUpdate("value", isNaN(numValue) ? e.target.value : numValue);
            }}
            placeholder="Valor"
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm flex-1"
          />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors"
          title={isExpanded ? "Colapsar" : "Expandir"}
        >
          {isExpanded ? "▼" : "▶"}
        </button>

        {canRemove && (
          <button
            onClick={onRemove}
            className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors"
            title="Eliminar regla"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Prompt condicional
            </label>
            <PromptEditor
              value={rule.prompt}
              onChange={(value) => handleUpdate("prompt", value)}
            />
          </div>

          <VariableSelector
            availableVariables={availableColumns}
            selectedVariables={rule.variableColumns}
            onToggle={handleToggleVariable}
          />
        </div>
      )}
    </div>
  );
}
