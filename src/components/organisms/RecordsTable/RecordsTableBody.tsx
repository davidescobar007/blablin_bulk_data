import type { Column } from "../../../types/records.types";
import { CellEditor } from "../../records-table/CellEditor";

export interface TableBodyProps {
  table: any; // TanStack Table instance with complex types
  displayColumns: Column[];
  updateCell: (rowId: string, field: string, value: unknown) => void;
  client: any; // PocketBase client
  relationOptions: Record<string, { id: string; [key: string]: unknown }[]>;
  loadRelationOptions: (collectionId: string) => void;
  onCellFocus: (recordId: string, field: string, value: unknown, column: Column) => void;
  onGenerateAI: (recordId: string, columnName: string) => void;
  aiGenerating: Record<string, boolean>;
  expandedCells: Record<string, boolean>;
  previewMode: Record<string, boolean>;
  setExpandedCells: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setPreviewMode: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function RecordsTableBody({
  table,
  displayColumns,
  updateCell,
  client,
  relationOptions,
  loadRelationOptions,
  onCellFocus,
  onGenerateAI,
  aiGenerating,
  expandedCells,
  previewMode,
  setExpandedCells,
  setPreviewMode,
}: TableBodyProps) {
  return (
    <tbody className="divide-y divide-slate-200">
      {table.getRowModel().rows.map((row: any) => (
        <tr
          key={row.id}
          className="border border-slate-200 bg-slate-50 hover:bg-slate-100 border-l-4 border-slate-300"
        >
          {row.getVisibleCells().map((cell: any) => {
            const cellClassName = cell.column.columnDef.meta?.cellClassName || "px-4 py-2";
            const displayColumn = displayColumns.find(col => col.key === cell.column.id);

            return (
              <td
                key={cell.id}
                className={`${cellClassName} text-sm text-slate-700`}
                style={{ width: cell.column.getSize() }}
              >
                {displayColumn ? (
                  <CellEditor
                    record={row.original}
                    column={displayColumn}
                    value={row.original.data[displayColumn.key]}
                    isExpanded={expandedCells[`${row.original.id}-${displayColumn.key}`]}
                    isPreview={previewMode[`${row.original.id}-${displayColumn.key}`]}
                    onToggleExpand={() => {
                      const cellKey = `${row.original.id}-${displayColumn.key}`;
                      setExpandedCells((prev: Record<string, boolean>) => ({
                        ...prev,
                        [cellKey]: !prev[cellKey],
                      }));
                    }}
                    onTogglePreview={() => {
                      const cellKey = `${row.original.id}-${displayColumn.key}`;
                      setPreviewMode((prev: Record<string, boolean>) => ({
                        ...prev,
                        [cellKey]: !prev[cellKey],
                      }));
                    }}
                    onUpdate={(newValue: unknown) => {
                      updateCell(row.original.id, displayColumn.key, newValue);
                    }}
                    onCellFocus={onCellFocus}
                    onLoadRelationOptions={loadRelationOptions}
                    relationOptions={relationOptions}
                    onGenerateAI={onGenerateAI}
                    aiGenerating={aiGenerating}
                    client={client}
                  />
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
