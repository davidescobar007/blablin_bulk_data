import { type ChangeEvent } from "react";

export interface CellInputProps {
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TextInput({ value, onChange, onBlur, disabled, placeholder }: CellInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export function EmailInput({ value, onChange, onBlur, disabled, placeholder }: CellInputProps) {
  return (
    <input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export function UrlInput({ value, onChange, onBlur, disabled, placeholder }: CellInputProps) {
  return (
    <input
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export function NumberInput({ value, onChange, onBlur, disabled, placeholder }: CellInputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export function BoolInput({ value, onChange, disabled }: CellInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(String(e.target.checked));
  };

  return (
    <input
      type="checkbox"
      checked={Boolean(value)}
      onChange={handleChange}
      disabled={disabled}
      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
  );
}
