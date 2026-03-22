import { Columns } from "lucide-react";
import { Drawer } from "../atoms/Drawer";
import type { Column } from "./types";

interface ColumnDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  visibleColumnKeys: Set<string>;
  allColumns: Column[];
  toggleColumnVisibility: (columnKey: string) => void;
  selectAllColumns: () => void;
  clearAllColumns: () => void;
}

export function ColumnDrawer({
  isOpen,
  onClose,
  visibleColumnKeys,
  allColumns,
  toggleColumnVisibility,
  selectAllColumns,
  clearAllColumns,
}: ColumnDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Columns" width="400px">
      <div className="p-6 space-y-6">
        <div className="flex gap-2">
          <button
            onClick={selectAllColumns}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Select All
          </button>
          <button
            onClick={clearAllColumns}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Columns className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Visible Columns ({visibleColumnKeys.size} / {allColumns.length})
            </span>
          </div>

          <div className="space-y-2">
            {allColumns.map((col) => (
              <label
                key={col.key}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200"
              >
                <input
                  type="checkbox"
                  checked={visibleColumnKeys.has(col.key)}
                  onChange={() => toggleColumnVisibility(col.key)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  autoComplete="off"
                  data-form-type="other"
                />
                <div className="flex-1">
                  <span className="text-sm text-slate-700">{col.name}</span>
                  {col.system && (
                    <span className="ml-2 text-xs text-slate-400">
                      (system)
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {col.type}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
