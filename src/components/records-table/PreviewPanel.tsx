import { XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Column } from "./types";
import { formatCellValue } from "./utils";

interface PreviewPanelProps {
  selectedCell: {
    recordId: string;
    field: string;
    value: unknown;
    column: Column;
  } | null;
  onClose: () => void;
}

export function PreviewPanel({ selectedCell, onClose }: PreviewPanelProps) {
  if (!selectedCell) return null;

  return (
    <div className="w-96 border-l border-slate-200 bg-slate-50 p-4 overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Preview
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded transition-colors"
            title="Close preview"
          >
            <XCircle className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-slate-600">
            <span className="font-medium">Record ID:</span>{" "}
            {selectedCell.recordId}
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium">Field:</span>{" "}
            {selectedCell.field}
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium">Type:</span>{" "}
            {selectedCell.column.type}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">
            Content
          </h4>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            {selectedCell.column.type === "json" ? (
              <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap overflow-x-auto">
                {typeof selectedCell.value === "object"
                  ? JSON.stringify(selectedCell.value, null, 2)
                  : formatCellValue(selectedCell.value)}
              </pre>
            ) : selectedCell.column.type === "editor" || selectedCell.column.type === "text" ? (
              <div className="prose prose-sm max-w-none prose-slate">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-slate-900 mb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold text-slate-800 mb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-slate-800 mb-1">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm text-slate-700 mb-2">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-sm text-slate-700 mb-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-sm text-slate-700 mb-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-1">{children}</li>
                    ),
                    code: ({ className, children, ...props }: any) => (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-slate-100 text-slate-800 px-3 py-2 rounded text-xs font-mono whitespace-pre-wrap overflow-x-auto mb-2">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-slate-300 pl-4 text-sm text-slate-600 italic mb-2">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-slate-900">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-slate-700">
                        {children}
                      </em>
                    ),
                    hr: () => <hr className="border-slate-200 my-3" />,
                    table: ({ children }) => (
                      <table className="w-full text-sm border-collapse border border-slate-200 mb-2">
                        {children}
                      </table>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-slate-50">{children}</thead>
                    ),
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => (
                      <tr className="border-b border-slate-200">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-2 py-1 text-left font-semibold text-slate-700 border border-slate-200">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-2 py-1 text-slate-700 border border-slate-200">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {formatCellValue(selectedCell.value)}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-700">
                {formatCellValue(selectedCell.value) || (
                  <span className="text-slate-400 italic">Empty</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
