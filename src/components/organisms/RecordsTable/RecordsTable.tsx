import { useMemo, useState, useCallback, useEffect } from "react";
import { useReactTable, getCoreRowModel, type ColumnDef } from "@tanstack/react-table";
import { Loader2, AlertCircle, Table, Wand2 } from "lucide-react";
import { usePocketBase } from "../../../context/usePocketBase";
import type { TrackedRecord, AIColumnConfig } from "../../../types/pocketbase.types";
import type { Column } from "../../../types/records.types";
import { RecordsTableActions } from "./RecordsTableActions";
import { RecordsTableBody } from "./RecordsTableBody";
import { SaveNotification } from "../../molecules/SaveNotification";
import { AIStatusIndicator } from "../../molecules/AIStatusIndicator";
import { AISettingsDialog } from "../../AISettingsDialog";
import { AIColumnConfigDialog } from "../../organisms/AIColumnConfig";
import { AddRecordsDialog } from "../../records-table/AddRecordsDialog";
import { AIBulkDialog } from "../../records-table/AIBulkDialog";
import { ColumnSelector } from "../../records-table/ColumnSelector";
import { PreviewPanel } from "../../records-table/PreviewPanel";
import { useTableSelection } from "../../records-table/hooks/useTableSelection";
import { useColumnVisibility } from "../../records-table/hooks/useColumnVisibility";
import { useAIGeneration } from "../../records-table/hooks/useAIGeneration";
import { getDisplayColumns } from "../../../utils/formatters";
import { flexRender } from "@tanstack/react-table";

export function RecordsTable() {
  const {
    selectedCollection,
    trackedRecords,
    isLoading,
    error,
    updateCell,
    addNewRows,
    discardChanges,
    hasChanges,
    isSaving,
    saveResult,
    saveAllChanges,
    clearSaveResult,
    client,
    getAIConfig,
    setAIConfig,
  } = usePocketBase();

  const [relationOptions, setRelationOptions] = useState<
    Record<string, { id: string; [key: string]: unknown }[]>
  >({});
  const [isLoadingRelations, setIsLoadingRelations] = useState(false);
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({});
  const [previewMode, setPreviewMode] = useState<Record<string, boolean>>({});
  const [selectedCell, setSelectedCell] = useState<{
    recordId: string;
    field: string;
    value: unknown;
    column: Column;
  } | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showAIColumnConfig, setShowAIColumnConfig] = useState(false);
  const [configuringColumn, setConfiguringColumn] = useState<string | null>(null);
  const [aiConfig, setAiConfig] = useState<AIColumnConfig | null>(null);

  const { selectedRows, handleSelectAll, handleRowSelect } = useTableSelection(
    trackedRecords,
    selectedCollection,
  );

  const {
    visibleColumnKeys,
    showColumnSelector,
    setShowColumnSelector,
    allColumns,
    displayColumns,
    toggleColumnVisibility,
    selectAllColumns,
    clearAllColumns,
  } = useColumnVisibility(selectedCollection, getDisplayColumns);

  const {
    aiGenerating,
    showAIBulkDialog,
    setShowAIBulkDialog,
    handleGenerateAI,
  } = useAIGeneration(trackedRecords, selectedCollection, updateCell);

  const loadRelationOptions = useCallback(async (collectionId: string) => {
    if (relationOptions[collectionId] || isLoadingRelations) return;

    setIsLoadingRelations(true);
    try {
      if (!client) return;
      const records = await client.collection(collectionId).getFullList();
      setRelationOptions((prev) => ({
        ...prev,
        [collectionId]: records,
      }));
    } catch (err) {
      console.error("Failed to load relation options:", err);
    } finally {
      setIsLoadingRelations(false);
    }
  }, [relationOptions, isLoadingRelations, client]);

  const columnDefinitions = useMemo<ColumnDef<TrackedRecord>[]>(
    () => [
      {
        id: "select",
        accessorKey: "__select__",
        size: 24,
        minSize: 24,
        maxSize: 24,
        header: () => {
          const allSelected =
            selectedRows.length > 0 &&
            selectedRows.length === trackedRecords.length;
          return (
            <div className="flex items-center justify-center w-full h-full">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-3 h-3 flex-shrink-0"
              />
            </div>
          );
        },
        cell: ({ row }: { row: { original: { id: string } } }) => {
          const isChecked = selectedRows.includes(row.original.id);
          return (
            <div className="flex items-center justify-center w-full h-full">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleRowSelect(row.original.id, e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-3 h-3 flex-shrink-0"
              />
            </div>
          );
        },
        meta: {
          cellClassName: "px-1 py-2",
          headerClassName: "px-1 py-3",
        },
      },
      ...displayColumns.map((column) => ({
        id: column.key,
        accessorKey: `data.${column.key}`,
        header: column.name,
        size: 150,
        meta: {
          cellClassName: "px-4 py-2",
          headerClassName: "px-4 py-3",
        },
      })),
    ],
    [selectedRows, trackedRecords.length, handleSelectAll, handleRowSelect, displayColumns],
  );

  const table = useReactTable({
    data: trackedRecords,
    columns: columnDefinitions,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const handleAddRows = useCallback(() => {
    addNewRows(1);
    setShowAddDialog(false);
  }, [addNewRows]);

  const handleSaveChanges = useCallback(async () => {
    await saveAllChanges();
  }, [saveAllChanges]);

  const handleDiscardChanges = useCallback(() => {
    discardChanges();
    setExpandedCells({});
    setPreviewMode({});
  }, [discardChanges]);

  const handleCellFocus = useCallback((recordId: string, field: string, value: unknown, column: Column) => {
    setSelectedCell({ recordId, field, value, column });
  }, []);

  useEffect(() => {
    if (saveResult) {
      const timer = setTimeout(() => {
        clearSaveResult();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [saveResult, clearSaveResult]);

  const handleBulkGenerateAI = useCallback(async (columnName?: string) => {
    if (!selectedCollection) return;

    const config = getAIConfig(selectedCollection.name, columnName || "");
    if (!config) return;

    const selectedRecords = trackedRecords.filter((r) =>
      selectedRows.includes(r.id)
    );
    if (selectedRecords.length === 0) return;

    setShowAIBulkDialog(true);
  }, [trackedRecords, selectedRows, selectedCollection, setShowAIBulkDialog, getAIConfig]);

  const handleShowAIColumnConfig = useCallback((columnName: string) => {
    if (selectedCollection) {
      const config = getAIConfig(selectedCollection.name, columnName);
      setConfiguringColumn(columnName);
      setAiConfig(config);
      setShowAIColumnConfig(true);
    }
  }, [selectedCollection, getAIConfig, setShowAIColumnConfig]);

  const handleSaveAIConfig = useCallback((config: AIColumnConfig | null) => {
    if (selectedCollection && configuringColumn) {
      setAIConfig(selectedCollection.name, configuringColumn, config);
    }
  }, [selectedCollection, configuringColumn, setAIConfig]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-slate-600">Loading records...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-3 text-red-600">{error}</span>
      </div>
    );
  }

  if (trackedRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <Table className="w-12 h-12 mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600 mb-4">No records in this collection</p>
        <button
          onClick={() => setShowAddDialog(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Records
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RecordsTableActions
        hasChanges={hasChanges}
        isSaving={isSaving}
        selectedRowsCount={selectedRows.length}
        showColumnSelector={showColumnSelector}
        onAddRecords={handleAddRows}
        onDiscardChanges={handleDiscardChanges}
        onSaveChanges={handleSaveChanges}
        onToggleColumnSelector={() => setShowColumnSelector(!showColumnSelector)}
        onShowAISettings={() => setShowAISettings(true)}
        onShowAIBulkDialog={handleBulkGenerateAI}
      />

      {saveResult && (
        <SaveNotification
          success={saveResult.success}
          failed={saveResult.failed}
          onDismiss={clearSaveResult}
        />
      )}

      <AIStatusIndicator generatingCells={aiGenerating} />

      <div className="flex gap-4">
        <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden relative">
          {showColumnSelector && (
            <div className="absolute top-0 left-0 z-10">
              <ColumnSelector
                visibleColumnKeys={visibleColumnKeys}
                allColumns={allColumns}
                toggleColumnVisibility={toggleColumnVisibility}
                selectAllColumns={selectAllColumns}
                clearAllColumns={clearAllColumns}
              />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
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
                                      onClick={() => handleShowAIColumnConfig(header.column.id)}
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
              <RecordsTableBody
                table={table}
                displayColumns={displayColumns}
                updateCell={updateCell}
                client={client}
                relationOptions={relationOptions}
                loadRelationOptions={loadRelationOptions}
                onCellFocus={handleCellFocus}
                onGenerateAI={handleGenerateAI}
                aiGenerating={aiGenerating}
                expandedCells={expandedCells}
                previewMode={previewMode}
                setExpandedCells={setExpandedCells}
                setPreviewMode={setPreviewMode}
              />
            </table>
          </div>
        </div>

        <PreviewPanel
          selectedCell={selectedCell}
          onClose={() => setSelectedCell(null)}
        />
      </div>

      <AddRecordsDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddRows}
      />

      <AISettingsDialog
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />

      <AIColumnConfigDialog
        isOpen={showAIColumnConfig}
        onClose={() => {
          setShowAIColumnConfig(false);
          setConfiguringColumn(null);
        }}
        columnName={configuringColumn || ""}
        collectionSchema={selectedCollection?.schema}
        config={aiConfig}
        onSave={handleSaveAIConfig}
      />

      <AIBulkDialog
        isOpen={showAIBulkDialog}
        onClose={() => setShowAIBulkDialog(false)}
        selectedRowsCount={selectedRows.length}
        displayColumns={displayColumns}
        bulkGeneratingColumn={null}
        onGenerate={handleBulkGenerateAI}
      />
    </div>
  );
}
