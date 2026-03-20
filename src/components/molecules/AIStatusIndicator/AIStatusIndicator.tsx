import { Loader2 } from "lucide-react";

export interface AIStatusIndicatorProps {
  generatingCells: Record<string, boolean>;
}

export function AIStatusIndicator({ generatingCells }: AIStatusIndicatorProps) {
  const count = Object.keys(generatingCells).length;

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg animate-pulse">
      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
      <div className="flex-1">
        <p className="text-sm font-medium text-purple-800">
          Generating AI content...
        </p>
        <p className="text-xs text-purple-600">
          {count} cell{count > 1 ? "s" : ""} being generated
        </p>
      </div>
    </div>
  );
}
