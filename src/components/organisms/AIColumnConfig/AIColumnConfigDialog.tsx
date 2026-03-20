import { useState, useEffect, useCallback } from "react";
import { Wand2, Image as ImageIcon, Plus } from "lucide-react";
import { Modal } from "../../atoms/Modal";
import { Button } from "../../atoms/Button";
import { PromptEditor, FormatInstructions, PreviewPrompt } from "./PromptEditor";
import { VariableSelector } from "./VariableSelector";
import { ModelSelector } from "./ModelSelector";
import { ConditionalRuleItem } from "./ConditionalRuleItem";
import type { AIColumnConfig, AIConditionRule } from "../../../types/pocketbase.types";

export interface AIColumnConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  columnName: string;
  collectionSchema?: Array<{ name: string; type: string }>;
  config: AIColumnConfig | null;
  onSave: (config: AIColumnConfig | null) => void;
}

export function AIColumnConfigDialog({
  isOpen,
  onClose,
  columnName,
  collectionSchema = [],
  config,
  onSave,
}: AIColumnConfigDialogProps) {
  const [defaultPrompt, setDefaultPrompt] = useState("");
  const [defaultVariableColumns, setDefaultVariableColumns] = useState<string[]>([]);
  const [formatInstructions, setFormatInstructions] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [generateImage, setGenerateImage] = useState(false);
  const [imageCompressionQuality, setImageCompressionQuality] = useState(0.7);
  const [conditionalRules, setConditionalRules] = useState<AIConditionRule[]>([]);

  const initializeState = useCallback(() => {
    if (config) {
      setDefaultPrompt(config.defaultPrompt || "");
      setDefaultVariableColumns(config.defaultVariableColumns || []);
      setFormatInstructions(config.formatInstructions || "");
      setSelectedModel(config.model || "gemini-2.5-flash");
      setGenerateImage(config.generateImage || false);
      setImageCompressionQuality(config.imageCompressionQuality || 0.7);
      setConditionalRules(config.conditionalRules || []);
    } else {
      setDefaultPrompt("");
      setDefaultVariableColumns([]);
      setFormatInstructions("");
      setSelectedModel("gemini-2.5-flash");
      setGenerateImage(false);
      setImageCompressionQuality(0.7);
      setConditionalRules([]);
    }
  }, [config]);

  useEffect(() => {
    if (isOpen) {
      initializeState();
    }
  }, [isOpen, initializeState]);

  const availableVariables = collectionSchema.map((f) => f.name);
  const availableColumns = collectionSchema.map((f) => f.name);

  const handleToggleDefaultVariable = (variable: string) => {
    setDefaultVariableColumns((prev) =>
      prev.includes(variable)
        ? prev.filter((v) => v !== variable)
        : [...prev, variable],
    );
  };

  const handleAddConditionalRule = () => {
    const newRule: AIConditionRule = {
      id: `rule-${Date.now()}`,
      column: availableColumns[0] || "",
      operator: "eq",
      value: "",
      prompt: "",
      variableColumns: [],
    };
    setConditionalRules((prev) => [...prev, newRule]);
  };

  const handleUpdateConditionalRule = (index: number, updatedRule: AIConditionRule) => {
    setConditionalRules((prev) =>
      prev.map((rule, i) => (i === index ? {
        ...updatedRule,
        variableColumns: updatedRule.variableColumns || [],
      } : rule))
    );
  };

  const handleRemoveConditionalRule = (index: number) => {
    setConditionalRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (defaultPrompt.trim() || conditionalRules.length > 0) {
      onSave({
        defaultPrompt: defaultPrompt.trim(),
        defaultVariableColumns,
        formatInstructions: formatInstructions.trim() || undefined,
        model: selectedModel,
        generateImage,
        imageCompressionQuality: generateImage ? imageCompressionQuality : undefined,
        conditionalRules: conditionalRules.length > 0 ? conditionalRules : undefined,
      });
    } else {
      onSave(null);
    }
    onClose();
  };

  const handleClear = () => {
    setDefaultPrompt("");
    setDefaultVariableColumns([]);
    setFormatInstructions("");
    setSelectedModel("gemini-2.5-flash");
    setGenerateImage(false);
    setImageCompressionQuality(0.7);
    setConditionalRules([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-600" />
          <span>Configure AI for "{columnName}"</span>
        </div>
      }
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Prompt por defecto
          </label>
          <PromptEditor value={defaultPrompt} onChange={setDefaultPrompt} />
        </div>

        <VariableSelector
          availableVariables={availableVariables}
          selectedVariables={defaultVariableColumns}
          onToggle={handleToggleDefaultVariable}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">
              Reglas condicionales
            </label>
            <button
              onClick={handleAddConditionalRule}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Agregar regla
            </button>
          </div>

          {conditionalRules.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No hay reglas condicionales. Agrega una para ejecutar prompts diferentes según condiciones.
            </p>
          ) : (
            <div className="space-y-3">
              {conditionalRules.map((rule, index) => (
                <ConditionalRuleItem
                  key={rule.id}
                  rule={rule}
                  availableColumns={availableColumns}
                  onUpdate={(updatedRule) => handleUpdateConditionalRule(index, updatedRule)}
                  onRemove={() => handleRemoveConditionalRule(index)}
                  canRemove={true}
                />
              ))}
            </div>
          )}
        </div>

        <ModelSelector value={selectedModel} onChange={setSelectedModel} />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="generateImage"
            checked={generateImage}
            onChange={(e) => setGenerateImage(e.target.checked)}
            className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="generateImage" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <ImageIcon className="w-4 h-4" />
            Generar imagen
          </label>
        </div>
        <p className="text-xs text-slate-500 -mt-1">
          Marca esta opción para generar imágenes en lugar de texto (para columnas de tipo file)
        </p>

        {generateImage && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Calidad de compresión
              </label>
              <span className="text-sm text-slate-600 font-mono">
                {Math.round(imageCompressionQuality * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={imageCompressionQuality}
              onChange={(e) =>
                setImageCompressionQuality(parseFloat(e.target.value))
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-xs text-slate-500">
              Valores más bajos = archivos más pequeños pero menor calidad. Default:
              70%
            </p>
          </div>
        )}

        {!generateImage && (
          <FormatInstructions
            value={formatInstructions}
            onChange={setFormatInstructions}
          />
        )}

        {defaultVariableColumns.length > 0 && (
          <PreviewPrompt
            prompt={defaultPrompt}
            selectedVariables={defaultVariableColumns}
          />
        )}
      </div>

      <div className="flex justify-between gap-2 mt-6">
        <Button
          onClick={handleClear}
          variant="danger"
        >
          Clear AI Config
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!defaultPrompt.trim() && conditionalRules.length === 0}
            variant="primary"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </Modal>
  );
}
