import type { CellInputProps } from "./TextInput";

export function SelectInput({
  value,
  onChange,
  disabled,
  options,
}: CellInputProps & { options?: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options?.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function RelationInput({
  value,
  onChange,
  disabled,
  options,
}: CellInputProps & {
  options?: Array<{ id: string; [key: string]: unknown }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select...</option>
      {options?.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.id}
        </option>
      ))}
    </select>
  );
}
