import { GEMINI_MODELS } from "../../../constants/ai.models";

export interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        AI Model
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {[
          { models: GEMINI_MODELS.filter(m => m.category === 'stable' && m.type === 'text'), label: 'Stable Text Models' },
          { models: GEMINI_MODELS.filter(m => m.category === 'experimental' && m.type === 'text'), label: 'Experimental Text Models' },
          { models: GEMINI_MODELS.filter(m => m.category === 'image'), label: 'Image Models' },
          { models: GEMINI_MODELS.filter(m => m.category === 'experimental' && m.type === 'image'), label: 'Experimental Image Models' },
        ].map((group, groupIndex) => {
          if (group.models.length === 0) return null;
          return (
            <optgroup key={`${group.label}-${groupIndex}`} label={group.label}>
              {group.models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
      <p className="text-xs text-slate-500 mt-1">
        Selecciona el modelo. Los modelos experimentales pueden tener mejor rendimiento pero menor estabilidad.
      </p>
    </div>
  );
}
