import { Plus, Trash2, Save, Loader2, Columns, Settings, Wand2, Filter } from "lucide-react";

interface TableActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  selectedRowsCount: number;
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
  setShowAISettings: (show: boolean) => void;
  onAddRecords: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  onShowAIBulkDialog: () => void;
  onShowFilters?: () => void;
  activeFilterCount?: number;
  hasActiveFilters?: boolean;
}

// Inline FilterButton component to avoid import issues
interface FilterButtonProps {
  onClick: () => void;
  activeFilterCount: number;
  hasActiveFilters: boolean;
}

function InlineFilterButton({ onClick, activeFilterCount, hasActiveFilters }: FilterButtonProps) {
  console.log('[InlineFilterButton] Rendered:', { onClick, activeFilterCount, hasActiveFilters });
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
    >
      <Filter className="w-4 h-4" />
      Filters
      {activeFilterCount > 0 && (
        <span
          className={`absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full ${
            hasActiveFilters ? "bg-blue-500" : "bg-slate-400"
          }`}
        >
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}

export function TableActions({
  hasChanges,
  isSaving,
  selectedRowsCount,
  showColumnSelector,
  setShowColumnSelector,
  setShowAISettings,
  onAddRecords,
  onDiscardChanges,
  onSaveChanges,
  onShowAIBulkDialog,
  onShowFilters,
  activeFilterCount = 0,
  hasActiveFilters = false,
}: TableActionsProps) {
  console.log('[TableActions] Rendered');
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={onAddRecords}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Records
        </button>
        {hasChanges && (
          <button
            onClick={onDiscardChanges}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Discard Changes
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Columns className="w-4 h-4" />
            Columns
          </button>
        </div>
        {onShowFilters && (
          <InlineFilterButton
            onClick={onShowFilters}
            activeFilterCount={activeFilterCount}
            hasActiveFilters={hasActiveFilters}
          />
        )}
        <button
          onClick={() => setShowAISettings(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
          AI Settings
        </button>
        {selectedRowsCount > 0 && (
          <button
            onClick={onShowAIBulkDialog}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Generate AI ({selectedRowsCount})
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hasChanges && (
          <button
            onClick={onSaveChanges}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
