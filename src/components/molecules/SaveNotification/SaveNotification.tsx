import { CheckCircle, XCircle } from "lucide-react";

export interface SaveNotificationProps {
  success: number;
  failed: number;
  onDismiss: () => void;
}

export function SaveNotification({ success, failed, onDismiss }: SaveNotificationProps) {
  return (
    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle className="w-5 h-5 text-green-600" />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-800">
          Changes saved successfully
        </p>
        <p className="text-xs text-green-600">
          {success} records updated
          {failed > 0 && `, ${failed} failed`}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-green-100 rounded transition-colors"
      >
        <XCircle className="w-5 h-5 text-green-600" />
      </button>
    </div>
  );
}
