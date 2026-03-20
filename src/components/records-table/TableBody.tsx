import { flexRender } from "@tanstack/react-table";
import type { TrackedRecord } from "../../context/PocketBaseContext";
import { getRowStateColor } from "./utils";
import { Wand2 } from "lucide-react";

interface TableBodyProps {
  table: any;
  trackedRecords: TrackedRecord[];
}

export function TableBody({ table, trackedRecords }: TableBodyProps) {
  if (trackedRecords.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={999} className="text-center py-12 text-slate-500">
            No records in this collection
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-slate-200">
      {table.getRowModel().rows.map((row: any) => (
        <tr
          key={row.id}
          className={`border border-slate-200 ${getRowStateColor(
            row.original.state,
            !!row.original.error,
          )}`}
        >
          {row.getVisibleCells().map((cell: any) => {
            const cellClassName = cell.column.columnDef.meta?.cellClassName || "px-4 py-2";
            return (
              <td
                key={cell.id}
                className={`${cellClassName} text-sm text-slate-700`}
                style={{ width: cell.column.getSize() }}
              >
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext(),
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}

interface TableHeaderProps {
  table: any;
  setConfiguringColumn: (column: string | null) => void;
  onShowAIColumnConfig: () => void;
}

export function TableHeader({ table, setConfiguringColumn, onShowAIColumnConfig }: TableHeaderProps) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200">
      {table.getHeaderGroups().map((headerGroup: any) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header: any) => {
            const headerClassName = header.column.columnDef.meta?.headerClassName || "px-4 py-3";
            const isSelectColumn = header.column.id === "select";

            return (
              <th
                key={header.id}
                className={`${headerClassName} text-left text-xs font-semibold text-slate-500 uppercase tracking-wider relative`}
                style={{ width: header.getSize() }}
              >
                {isSelectColumn ? (
                  <div className="flex items-center justify-center w-full h-full">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {!header.isPlaceholder &&
                        header.column.id !== "state" && (
                          <button
                            onClick={() => {
                              setConfiguringColumn(header.column.id);
                              onShowAIColumnConfig();
                            }}
                            className="ml-1 p-1 rounded hover:bg-purple-100 text-slate-400 hover:text-purple-600 transition-colors"
                            title="Configure AI for this column"
                          >
                            <Wand2 className="w-3 h-3" />
                          </button>
                        )}
                    </div>
                    {header.column.getCanResize() && (
                      <div
                        {...{
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors ${
                            header.column.getIsResizing()
                              ? "bg-blue-500"
                              : ""
                          }`,
                        }}
                      >
                        <div className="w-0.5 h-full bg-slate-300" />
                      </div>
                    )}
                  </div>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}