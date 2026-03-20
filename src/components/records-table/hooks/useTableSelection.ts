import { useState, useCallback, useEffect } from "react";
import type { TrackedRecord } from "../../../context/PocketBaseContext";
import type { CollectionModel } from "pocketbase";

interface UseTableSelectionReturn {
  selectedRows: string[];
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRowSelect: (rowId: string, checked: boolean) => void;
}

export function useTableSelection(
  trackedRecords: TrackedRecord[],
  selectedCollection: CollectionModel | null,
): UseTableSelectionReturn {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const allIds = trackedRecords.map((r) => r.id);
        setSelectedRows(allIds);
      } else {
        setSelectedRows([]);
      }
    },
    [trackedRecords],
  );

  const handleRowSelect = useCallback((rowId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) =>
        prev.includes(rowId) ? prev : [...prev, rowId]
      );
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== rowId));
    }
  }, []);

  useEffect(() => {
    setSelectedRows([]);
  }, [selectedCollection]);

  return {
    selectedRows,
    handleSelectAll,
    handleRowSelect,
  };
}
