import { Sparkles, Variable, Plus, X } from "lucide-react";
import { useState } from "react";

export interface VariableSelectorProps {
  availableVariables: string[];
  selectedVariables: string[];
  onToggle: (variable: string) => void;
}

export function VariableSelector({
  availableVariables,
  selectedVariables,
  onToggle,
}: VariableSelectorProps) {
  const [customVariable, setCustomVariable] = useState("");

  const handleAddCustomVariable = () => {
    const trimmed = customVariable.trim();
    if (trimmed && !selectedVariables.includes(trimmed)) {
      onToggle(trimmed);
      setCustomVariable("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCustomVariable();
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
        <Variable className="w-4 h-4" />
        Variables
      </label>
      <p className="text-xs text-slate-500 mb-2">
        Selecciona columnas o agrega variables personalizadas.
        Usa notación de punto para propiedades anidadas (ej: <code className="bg-slate-100 px-1 py-0.5 rounded">user.name</code>)
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {availableVariables.map((variable) => (
          <button
            key={variable}
            onClick={() => onToggle(variable)}
            className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${
              selectedVariables.includes(variable)
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {selectedVariables.includes(variable) && (
              <Sparkles className="w-3 h-3 inline mr-1" />
            )}
            {variable}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={customVariable}
            onChange={(e) => setCustomVariable(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: user.name, address.city"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            onClick={handleAddCustomVariable}
            disabled={!customVariable.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {selectedVariables.some((v) => v.includes(".")) && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Variables con propiedades anidadas:</strong>
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedVariables
                .filter((v) => v.includes("."))
                .map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {v}
                    <button
                      onClick={() => onToggle(v)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
