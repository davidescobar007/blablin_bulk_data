import { Mail, Key } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface AuthModeToggleProps {
  mode: "password" | "token";
  onModeChange: (mode: "password" | "token") => void;
  disabled?: boolean;
}

export function AuthModeToggle({ mode, onModeChange, disabled }: AuthModeToggleProps) {
  return (
    <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
      <button
        type="button"
        onClick={() => onModeChange("password")}
        disabled={disabled}
        className={cn(
          "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
          mode === "password"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <Mail className="w-4 h-4 inline-block mr-1" />
        Email / Password
      </button>
      <button
        type="button"
        onClick={() => onModeChange("token")}
        disabled={disabled}
        className={cn(
          "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
          mode === "token"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <Key className="w-4 h-4 inline-block mr-1" />
        API Token
      </button>
    </div>
  );
}
