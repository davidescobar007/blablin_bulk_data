export interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptEditor({ value, onChange }: PromptEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Prompt Template (Markdown supported)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Generate content about {topic_name} for {level} level...`}
        rows={8}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
      />
      <p className="text-xs text-slate-500 mt-1">
        Usa la sintaxis <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{"{variable}"}</code> para los placeholders.
        <br />
        Soporta propiedades anidadas con notación de punto (ej: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{"{user.name}"}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{"{address.city}"}</code>)
      </p>
    </div>
  );
}

export interface FormatInstructionsProps {
  value: string;
  onChange: (value: string) => void;
}

export function FormatInstructions({ value, onChange }: FormatInstructionsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Format Instructions (Optional)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`IMPORTANT: Return ONLY essential content without:
- Introductions or explanations
- Conversational filler ("Here's your material...", "As an expert...")
- Unnecessary formatting or excessive emojis
- Meta-commentary or cultural notes

Just provide direct, clean content needed for the study material.`}
        rows={6}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
      />
      <p className="text-xs text-slate-500 mt-1">
        Instructions to control format and content of AI responses
      </p>
    </div>
  );
}

export interface PreviewPromptProps {
  prompt: string;
  selectedVariables: string[];
}

export function PreviewPrompt({ prompt, selectedVariables }: PreviewPromptProps) {
  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <p className="text-xs font-medium text-slate-700 mb-2">Preview:</p>
      <code className="text-xs font-mono text-slate-600 whitespace-pre-wrap break-all">
        {selectedVariables.reduce(
          (preview, v) =>
            preview.replace(new RegExp(`\\{${v}\\}`, "g"), `{${v}: value}`),
          prompt || "(empty prompt)",
        )}
      </code>
    </div>
  );
}
