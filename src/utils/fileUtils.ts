export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 bytes";

  const k = 1024;
  const sizes = ["bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
