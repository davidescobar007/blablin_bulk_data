import { useState } from "react";

interface AddRecordsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (count: number) => void;
}

export function AddRecordsDialog({
  isOpen,
  onClose,
  onAdd,
}: AddRecordsDialogProps) {
  const [rowsToAdd, setRowsToAdd] = useState(1);

  const handleAdd = () => {
    onAdd(rowsToAdd);
    setRowsToAdd(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Add New Records
        </h3>
        <div className="mb-4">
          <label
            htmlFor="rowsToAdd"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Number of records to add
          </label>
          <input
            id="rowsToAdd"
            type="number"
            min="1"
            max="100"
            value={rowsToAdd}
            onChange={(e) =>
              setRowsToAdd(Number.parseInt(e.target.value) || 1)
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Records
          </button>
        </div>
      </div>
    </div>
  );
}
