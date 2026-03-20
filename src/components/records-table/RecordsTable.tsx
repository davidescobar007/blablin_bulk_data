import { useMemo, useState, useCallback, useEffect } from "react";
import { useReactTable, getCoreRowModel, type ColumnDef } from "@tanstack/react-table";
import { Loader2, AlertCircle, Table, CheckCircle, XCircle } from "lucide-react";
import { usePocketBase } from "../../context/usePocketBase";
import type { TrackedRecord } from "../../context/PocketBaseContext";
import { AISettingsDialog } from "../AISettingsDialog";
import { AIColumnConfigDialog } from "../AIColumnConfigDialog";
import { getDisplayColumns, getColumnSize } from "./utils";
import type { Column } from "./types";
import { useTableSelection } from "./hooks/useTableSelection";
import { useColumnVisibility } from "./hooks/useColumnVisibility";
import { useAIGeneration } from "./hooks/useAIGeneration";
import { CellEditor } from "./CellEditor";
import { ColumnSelector } from "./ColumnSelector";
import { PreviewPanel } from "./PreviewPanel";
import { AddRecordsDialog } from "./AddRecordsDialog";
import { AIBulkDialog } from "./AIBulkDialog";
import { TableActions } from "./TableActions";
import { TableBody, TableHeader } from "./TableBody";

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
  const [rowsToAdd, setRowsToAdd] = useState(1);

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
    bulkGeneratingColumn,
    showAIBulkDialog,
    setShowAIBulkDialog,
    handleGenerateAI,
  } = useAIGeneration(trackedRecords, selectedCollection, updateCell);

  const handleBulkGenerateAI = useCallback(
    async (columnName: string) => {
      if (!selectedCollection) return;

      const { getAIConfig } = usePocketBase();
      const config = getAIConfig(selectedCollection.name, columnName);
      if (!config) return;

      const selectedRecords = trackedRecords.filter((r) =>
        selectedRows.includes(r.id)
      );
      if (selectedRecords.length === 0) return;

      setShowAIBulkDialog(true);
    },
    [trackedRecords, selectedRows, selectedCollection, setShowAIBulkDialog],
  );

  const { client } = usePocketBase();

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
        cell: ({ row }: any) => {
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
      ...displayColumns.map((col) => ({
        accessorKey: col.key,
        header: col.name,
        size: getColumnSize(col),
        minSize: 50,
        maxSize: 1000,
        enableResizing: true,
        cell: ({ row }: any) => {
          const value = row.original.data[col.key];
          const cellKey = `${row.original.id}-${col.key}`;
          const isExpanded = expandedCells[cellKey];
          const isPreview = previewMode[cellKey];

          return (
            <CellEditor
              record={row.original}
              column={col}
              value={value}
              isExpanded={isExpanded}
              isPreview={isPreview}
              onToggleExpand={() => {
                setExpandedCells((prev) => ({
                  ...prev,
                  [cellKey]: !isExpanded,
                }));
              }}
              onTogglePreview={() => {
                setPreviewMode((prev) => ({
                  ...prev,
                  [cellKey]: !isPreview,
                }));
              }}
              onUpdate={(newValue) => {
                updateCell(row.original.id, col.key, newValue);
              }}
              onCellFocus={(recordId, field, value, column) => {
                setSelectedCell({
                  recordId,
                  field,
                  value,
                  column,
                });
              }}
              onLoadRelationOptions={loadRelationOptions}
              relationOptions={relationOptions}
              onGenerateAI={handleGenerateAI}
              aiGenerating={aiGenerating}
              client={client}
            />
          );
        },
      })),
    ],
    [displayColumns, updateCell, getColumnSize, loadRelationOptions, relationOptions, aiGenerating, handleGenerateAI, selectedRows, handleSelectAll, handleRowSelect, expandedCells, previewMode],
  );

  const table = useReactTable({
    data: trackedRecords,
    columns: columnDefinitions,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const handleAddRows = useCallback(() => {
    addNewRows(rowsToAdd);
    setShowAddDialog(false);
    setRowsToAdd(1);
  }, [rowsToAdd, addNewRows]);

  const handleSaveChanges = useCallback(async () => {
    await saveAllChanges();
  }, [saveAllChanges]);

  const handleDiscardChanges = useCallback(() => {
    discardChanges();
    setExpandedCells({});
    setPreviewMode({});
  }, [discardChanges]);

  useEffect(() => {
    if (saveResult) {
      const timer = setTimeout(() => {
        clearSaveResult();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [saveResult, clearSaveResult]);

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
      <TableActions
        hasChanges={hasChanges}
        isSaving={isSaving}
        selectedRowsCount={selectedRows.length}
        showColumnSelector={showColumnSelector}
        setShowColumnSelector={setShowColumnSelector}
        setShowAISettings={setShowAISettings}
        onAddRecords={() => setShowAddDialog(true)}
        onDiscardChanges={handleDiscardChanges}
        onSaveChanges={handleSaveChanges}
        onShowAIBulkDialog={() => setShowAIBulkDialog(true)}
      />

      {saveResult && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              Changes saved successfully
            </p>
            <p className="text-xs text-green-600">
              {saveResult.success} records updated
              {saveResult.failed > 0 && `, ${saveResult.failed} failed`}
            </p>
          </div>
          <button
            onClick={clearSaveResult}
            className="p-1 hover:bg-green-100 rounded transition-colors"
          >
            <XCircle className="w-5 h-5 text-green-600" />
          </button>
        </div>
      )}

      {Object.keys(aiGenerating).length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg animate-pulse">
          <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-800">
              Generating AI content...
            </p>
            <p className="text-xs text-purple-600">
              {Object.keys(aiGenerating).length} cell
              {Object.keys(aiGenerating).length > 1 ? "s" : ""} being generated
            </p>
          </div>
        </div>
      )}

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
              <TableHeader
                table={table}
                setConfiguringColumn={setConfiguringColumn}
                onShowAIColumnConfig={() => setShowAIColumnConfig(true)}
              />
              <TableBody table={table} trackedRecords={trackedRecords} />
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
        onClose={() => setShowAIColumnConfig(false)}
        columnName={configuringColumn || ""}
        collectionSchema={selectedCollection?.schema}
      />

      <AIBulkDialog
        isOpen={showAIBulkDialog}
        onClose={() => setShowAIBulkDialog(false)}
        selectedRowsCount={selectedRows.length}
        displayColumns={displayColumns}
        bulkGeneratingColumn={bulkGeneratingColumn}
        onGenerate={handleBulkGenerateAI}
      />
    </div>
  );
}
