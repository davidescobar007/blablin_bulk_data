export async function convertToWebP(
  file: File,
  quality: number = 0.9
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  const image = await createImageFromFile(file);

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  ctx.drawImage(image, 0, 0);

  const webpDataUrl = canvas.toDataURL("image/webp", quality);

  const response = await fetch(webpDataUrl);
  const blob = await response.blob();

  const newFileName = file.name.replace(/\.(png|jpe?g)$/i, ".webp");
  return new File([blob], newFileName, { type: "image/webp" });
}

async function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    const url = URL.createObjectURL(file);
    img.src = url;
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
