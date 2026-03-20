import type { CellInputProps } from "./TextInput";

function formatDateForInput(value: unknown, includeTime?: boolean): string {
  if (!value) return "";

  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const dateStr = date.toISOString().split("T")[0];
      if (includeTime) {
        const timeStr = date.toTimeString().slice(0, 5);
        return `${dateStr}T${timeStr}`;
      }
      return dateStr;
    }
    return value as string;
  }

  return "";
}

function parseDateFromInput(
  value: string,
  includeTime?: boolean,
): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (isNaN(date.getTime())) return null;

  if (includeTime) {
    return date.toISOString().replace("T", " ").slice(0, 19);
  }

  return value.split("T")[0];
}

export function DateInput({ value, onChange, onBlur, disabled, includeTime }: CellInputProps & { includeTime?: boolean }) {
  return (
    <input
      type={includeTime ? "datetime-local" : "date"}
      value={formatDateForInput(value, includeTime)}
      onChange={(e) => {
        const newValue = parseDateFromInput(e.target.value, includeTime);
        onChange(newValue || "");
      }}
      onBlur={onBlur}
      disabled={disabled}
      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
