import { Loader2, Wand2, XCircle, Check as CheckIcon, Settings } from "lucide-react";
import type { Column } from "./types";
import { usePocketBase } from "../../context/usePocketBase";

interface AIBulkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRowsCount: number;
  displayColumns: Column[];
  bulkGeneratingColumn: string | null;
  onGenerate: (columnName: string) => void;
}

export function AIBulkDialog({
  isOpen,
  onClose,
  selectedRowsCount,
  displayColumns,
  bulkGeneratingColumn,
  onGenerate,
}: AIBulkDialogProps) {
  const { selectedCollection, getAIConfig } = usePocketBase();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
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

        <p className="text-sm text-slate-600 mb-4">
          Generate content for {selectedRowsCount} selected rows.
        </p>

        <div className="space-y-2">
          {displayColumns
            .filter((col) => !col.system && col.key !== "id")
            .map((col) => {
              const hasConfig =
                selectedCollection &&
                getAIConfig(selectedCollection.name, col.key);
              return (
                <button
                  key={col.key}
                  onClick={() => onGenerate(col.key)}
                  disabled={!hasConfig || bulkGeneratingColumn === col.key}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    bulkGeneratingColumn === col.key
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : hasConfig
                        ? "border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700"
                        : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{col.name}</span>
                    {hasConfig ? (
                      bulkGeneratingColumn === col.key ? (
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      ) : (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      )
                    ) : (
                      <Settings className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {col.type}
                  </span>
                </button>
              );
            })}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
