import type { CellInputProps } from "./TextInput";

export function TextareaInput({ value, onChange, onBlur, disabled, rows = 3 }: CellInputProps & { rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      rows={rows}
      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
    />
  );
}

export function JsonInput(props: CellInputProps) {
  return <TextareaInput {...props} rows={3} />;
}

export function EditorInput(props: CellInputProps) {
  return <TextareaInput {...props} rows={5} />;
}
