import { useState, useCallback, useEffect, useMemo } from "react";
import type { CollectionModel } from "pocketbase";
import type { Column } from "../types";

interface UseColumnVisibilityReturn {
  visibleColumnKeys: Set<string>;
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
  allColumns: Column[];
  displayColumns: Column[];
  toggleColumnVisibility: (columnKey: string) => void;
  selectAllColumns: () => void;
  clearAllColumns: () => void;
}

export function useColumnVisibility(
  selectedCollection: CollectionModel | null,
  getDisplayColumns: (collection: CollectionModel | null) => Column[],
): UseColumnVisibilityReturn {
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<string>>(new Set());
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const allColumns = useMemo(
    () => getDisplayColumns(selectedCollection),
    [selectedCollection, getDisplayColumns],
  );

  const displayColumns = useMemo(() => {
    if (visibleColumnKeys.size === 0) {
      return allColumns;
    }
    return allColumns.filter((col) => visibleColumnKeys.has(col.key));
  }, [allColumns, visibleColumnKeys]);

  useEffect(() => {
    if (selectedCollection) {
      const savedConfig = localStorage.getItem(
        `pocketbase-columns-${selectedCollection.name}`,
      );
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig) as string[];
          // Filter saved config to only include columns that exist in allColumns
          const existingColumns = allColumns.map((c) => c.key);
          const validSavedColumns = parsed.filter((key) =>
            existingColumns.includes(key)
          );
          // Add any new columns that aren't in saved config
          const allColumnKeys = new Set([...validSavedColumns, ...existingColumns]);
          setVisibleColumnKeys(allColumnKeys);
        } catch {
          setVisibleColumnKeys(new Set(allColumns.map((c) => c.key)));
        }
      } else {
        setVisibleColumnKeys(new Set(allColumns.map((c) => c.key)));
      }
    } else {
      setVisibleColumnKeys(new Set());
    }
  }, [selectedCollection, allColumns]);

  useEffect(() => {
    if (selectedCollection) {
      localStorage.setItem(
        `pocketbase-columns-${selectedCollection.name}`,
        JSON.stringify(Array.from(visibleColumnKeys)),
      );
    }
  }, [selectedCollection, visibleColumnKeys]);

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setVisibleColumnKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  }, []);

  const selectAllColumns = useCallback(() => {
    setVisibleColumnKeys(new Set(allColumns.map((c) => c.key)));
  }, [allColumns]);

  const clearAllColumns = useCallback(() => {
    setVisibleColumnKeys(new Set());
  }, []);

  return {
    visibleColumnKeys,
    showColumnSelector,
    setShowColumnSelector,
    allColumns,
    displayColumns,
    toggleColumnVisibility,
    selectAllColumns,
    clearAllColumns,
  };
}
