import { usePocketBase } from "../context/usePocketBase";
import { ChevronDown, Layers, RefreshCw, LogOut } from "lucide-react";

export function CollectionSelector() {
  const {
    collections,
    selectedCollection,
    selectCollection,
    disconnect,
    refreshRecords,
    isLoading,
  } = usePocketBase();

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectCollection(e.target.value);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-sm font-medium">Connected</span>
      </div>

      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-gray-500" />
        <select
          value={selectedCollection?.name || ""}
          onChange={handleCollectionChange}
          disabled={isLoading}
          className="min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            Select a collection
          </option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.name}>
              {collection.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 -ml-6 pointer-events-none" />
      </div>

      {selectedCollection && (
        <button
          onClick={refreshRecords}
          disabled={isLoading}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh records"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      )}

      <button
        onClick={disconnect}
        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        title="Disconnect"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
