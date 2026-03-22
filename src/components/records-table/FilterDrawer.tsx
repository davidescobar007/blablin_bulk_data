import { Search, Filter as FilterIcon, XCircle } from "lucide-react";
import { Drawer } from "../atoms/Drawer";
import type { FilterState, ColumnFilter } from "./filter-types";
import type { Column } from "./types";
import { FilterRow } from "./FilterRow";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onGlobalSearchChange: (value: string) => void;
  onColumnFilterChange: (columnKey: string, filter: ColumnFilter | null) => void;
  onClearAll: () => void;
  displayColumns: Column[];
  relationOptions?: Record<string, { id: string; [key: string]: unknown }[]>;
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onGlobalSearchChange,
  onColumnFilterChange,
  onClearAll,
  displayColumns,
  relationOptions,
}: FilterDrawerProps) {
  const hasActiveFilters =
    filters.globalSearch.trim() !== "" ||
    Object.keys(filters.columnFilters).length > 0;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Filters" width="400px">
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Search className="w-4 h-4 inline mr-1" />
            Global Search
          </label>
          <input
            type="text"
            value={filters.globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            placeholder="Search in all columns..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-slate-700">
              <FilterIcon className="w-4 h-4 inline mr-1" />
              Column Filters
            </label>
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <XCircle className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-3">
            {displayColumns.map((column) => (
              <FilterRow
                key={column.key}
                column={column}
                filter={filters.columnFilters[column.key] || null}
                onFilterChange={(filter) => onColumnFilterChange(column.key, filter)}
                relationOptions={relationOptions}
              />
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
