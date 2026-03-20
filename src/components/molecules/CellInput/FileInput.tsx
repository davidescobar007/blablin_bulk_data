import { FileText, X } from "lucide-react";
import { useState } from "react";

export interface FileInputProps {
  onChange: (file: File | null) => void;
  disabled?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export function FileInput({ onChange, disabled, fileUrl, fileName, fileType }: FileInputProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const isImage = fileType?.startsWith("image/") || false;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    }
  };

  const handleClear = () => {
    onChange(null);
    setPreview(null);
  };

  const displayPreview = preview || fileUrl;

  return (
    <div className="flex items-center gap-2">
      {(displayPreview || fileName) ? (
        <div className="flex items-center gap-2 flex-1">
          {displayPreview && isImage ? (
            <div className="relative group">
              <img
                src={displayPreview}
                alt="Preview"
                className="h-8 w-8 object-cover rounded border border-slate-300"
              />
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 max-w-[150px] truncate">
              <FileText className="w-3 h-3" />
              <span className="truncate">{fileName || "File"}</span>
            </div>
          )}
          {!disabled && (
            <button
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-red-600"
              title="Clear file"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        <input
          type="file"
          onChange={handleFileChange}
          disabled={disabled}
          className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
      {!(displayPreview || fileName) && fileUrl && (
        <button
          onClick={() => {
            window.open(fileUrl, "_blank");
          }}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="Open file"
        >
          <FileText className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
