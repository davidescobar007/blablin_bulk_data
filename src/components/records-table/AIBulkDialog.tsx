import { useState } from "react";
import { Wand2, XCircle, Check as CheckIcon } from "lucide-react";
import type { Column } from "./types";
import { usePocketBase } from "../../context/usePocketBase";

interface AIBulkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRowsCount: number;
  displayColumns: Column[];
  onGenerate: (columnNames: string[]) => void;
}

export function AIBulkDialog({
  isOpen,
  onClose,
  selectedRowsCount,
  displayColumns,
  onGenerate,
}: AIBulkDialogProps) {
  const { selectedCollection, getAIConfig } = usePocketBase();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  if (!isOpen) return null;

  const availableColumns = displayColumns.filter(
    (col) =>
      !col.system &&
      col.key !== "id" &&
      selectedCollection &&
      getAIConfig(selectedCollection.name, col.key)
  );

  const toggleColumn = (columnKey: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((c) => c !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleGenerate = () => {
    if (selectedColumns.length > 0) {
      onGenerate(selectedColumns);
    }
  };

  const handleSelectAll = () => {
    if (selectedColumns.length === availableColumns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(availableColumns.map((col) => col.key));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Bulk Generate with AI
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <XCircle className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-shrink-0">
          <p className="text-sm text-slate-600">
            Generate content for {selectedRowsCount} selected rows.
          </p>
          {availableColumns.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              {selectedColumns.length === availableColumns.length
                ? "Deselect all columns"
                : `Select all columns (${availableColumns.length})`}
            </button>
          )}
        </div>

        <div className="px-6 overflow-y-auto flex-1">
          {availableColumns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">
                No columns with AI configuration found.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Configure AI prompts for columns to use this feature.
              </p>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {availableColumns.map((col) => {
                const isSelected = selectedColumns.includes(col.key);
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => toggleColumn(col.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer w-4 h-4 flex-shrink-0"
                        autoComplete="off"
                        data-form-type="other"
                        aria-label={`Select ${col.name}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{col.name}</span>
                          <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        </div>
                        <span className="text-xs text-slate-500">
                          {col.type}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex-shrink-0">
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={selectedColumns.length === 0}
              className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Generate ({selectedColumns.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
