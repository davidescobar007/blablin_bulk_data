import { Filter } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  activeFilterCount: number;
  hasActiveFilters: boolean;
}

export function FilterButton({ onClick, activeFilterCount, hasActiveFilters }: FilterButtonProps) {
  console.log('[FilterButton] Rendered:', { onClick, activeFilterCount, hasActiveFilters });
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
