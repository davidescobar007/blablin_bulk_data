import type { Column } from "./types";

interface ColumnSelectorProps {
  visibleColumnKeys: Set<string>;
  allColumns: Column[];
  toggleColumnVisibility: (columnKey: string) => void;
  selectAllColumns: () => void;
  clearAllColumns: () => void;
}

export function ColumnSelector({
  visibleColumnKeys,
  allColumns,
  toggleColumnVisibility,
  selectAllColumns,
  clearAllColumns,
}: ColumnSelectorProps) {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[200px]">
      <div className="p-2 border-b border-slate-200 flex gap-2">
        <button
          onClick={selectAllColumns}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={clearAllColumns}
          className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto p-2">
        {allColumns.map((col) => (
          <label
            key={col.key}
            className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              checked={visibleColumnKeys.has(col.key)}
              onChange={() => toggleColumnVisibility(col.key)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">{col.name}</span>
            {col.system && (
              <span className="text-xs text-slate-400 ml-auto">
                (system)
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
