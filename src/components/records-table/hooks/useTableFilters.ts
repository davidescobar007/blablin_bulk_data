import { useState, useMemo, useCallback } from "react";
import type { TrackedRecord } from "../../../types/pocketbase.types";
import type { Column } from "../types";
import type { ColumnFilter, FilterState } from "../filter-types";
import { applyColumnFilter, applyGlobalSearch } from "../filter-utils";

interface UseTableFiltersProps {
  records: TrackedRecord[];
  columns: Column[];
}

export function useTableFilters({ records, columns }: UseTableFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    globalSearch: "",
    columnFilters: {},
    showFilterDrawer: false,
  });

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const { globalSearch: searchTerm, columnFilters } = filters;

      const matchesGlobalSearch = applyGlobalSearch(record, searchTerm, columns);

      const matchesColumnFilters = Object.entries(columnFilters).every(
        ([columnKey, filter]) => {
          const column = columns.find((col) => col.key === columnKey);
          return applyColumnFilter(
            record,
            columnKey,
            filter.operator,
            filter.value,
            filter.valueTo,
            column?.type,
          );
        },
      );

      return matchesGlobalSearch && matchesColumnFilters;
    });
  }, [records, filters, columns]);

  const setGlobalSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, globalSearch: value }));
  }, []);

  const setColumnFilter = useCallback(
    (columnKey: string, filter: ColumnFilter | null) => {
      setFilters((prev) => {
        const newColumnFilters = { ...prev.columnFilters };
        if (filter) {
          newColumnFilters[columnKey] = filter;
        } else {
          delete newColumnFilters[columnKey];
        }
        return { ...prev, columnFilters: newColumnFilters };
      });
    },
    [],
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      globalSearch: "",
      columnFilters: {},
      showFilterDrawer: filters.showFilterDrawer,
    });
  }, [filters.showFilterDrawer]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.globalSearch.trim() !== "" ||
      Object.keys(filters.columnFilters).length > 0
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.globalSearch.trim() !== "") count++;
    count += Object.keys(filters.columnFilters).length;
    return count;
  }, [filters]);

  const setShowFilterDrawer = useCallback((show: boolean) => {
    setFilters((prev) => ({ ...prev, showFilterDrawer: show }));
  }, []);

  return {
    filters,
    filteredRecords,
    setGlobalSearch,
    setColumnFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
    setShowFilterDrawer,
  };
}
