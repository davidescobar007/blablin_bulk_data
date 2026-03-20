import { GoogleGenAI } from "@google/genai";
import { convertToWebP } from "../utils/imageConversion";

/**
 * Intenta parsear un valor que podría ser un string JSON
 * @param value - El valor a parsear
 * @returns El valor parseado como objeto, o el valor original si no es JSON
 */
function parseIfJSON(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      // No es JSON válido, retornar el valor original
      return value;
    }
  }
  return value;
}

/**
 * Obtiene el valor de una propiedad anidada en un objeto usando notación de punto
 * @param obj - El objeto raíz (puede ser null/undefined o un string JSON)
 * @param path - El camino a la propiedad (ej: "user.name", "address.street")
 * @returns El valor como string, o cadena vacía si no se encuentra
 */
function getNestedValue(obj: unknown, path: string): string {
  if (obj === null || obj === undefined) {
    return "";
  }

  // Si no hay punto, es una propiedad de primer nivel
  if (path.indexOf('.') === -1) {
    return String(obj);
  }

  // Intentar parsear si es un string JSON (común en PocketBase)
  const parsedObj = parseIfJSON(obj);

  const keys = path.split('.');
  let current: any = parsedObj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return "";
    }

    if (typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return "";
    }
  }

  return String(current);
}

/**
 * Extrae todas las variables del prompt usando regex
 * @param prompt - El prompt que puede contener {variable}
 * @returns Array de paths de variables encontrados (ej: ["user.name", "topic", "address.city"])
 */
function extractVariablePaths(prompt: string): string[] {
  const regex = /\{([^}]+)\}/g;
  const paths: string[] = [];
  let match;

  while ((match = regex.exec(prompt)) !== null) {
    paths.push(match[1]);
  }

  return paths;
}

/**
 * Obtiene las columnas base disponibles a partir de los paths de variables
 * @param variableColumns - Array de columnas seleccionadas (puede incluir paths anidados)
 * @returns Array de columnas base únicas (ej: ["user", "topic"] de ["user.name", "user.address", "topic"])
 */
function getAvailableBasePaths(variableColumns: string[]): string[] {
  const basePaths = new Set<string>();

  variableColumns.forEach((path) => {
    const firstDot = path.indexOf('.');
    if (firstDot !== -1) {
      // Es un path anidado, extraer la columna base
      basePaths.add(path.substring(0, firstDot));
    } else {
      // Es una columna de primer nivel
      basePaths.add(path);
    }
  });

  return Array.from(basePaths);
}

/**
 * Reemplaza todas las variables en el prompt con sus valores correspondientes
 * Soporta tanto propiedades de primer nivel como anidadas
 * @param prompt - El prompt original con variables como {variable}
 * @param variableColumns - Las columnas seleccionadas para el reemplazo
 * @param rowData - Los datos de la fila actual
 * @returns El prompt con todas las variables reemplazadas
 */
function replaceVariablesInPrompt(
  prompt: string,
  variableColumns: string[],
  rowData: Record<string, unknown>,
): string {
  console.log("[replaceVariablesInPrompt] Input:", {
    prompt,
    variableColumns,
    rowDataKeys: Object.keys(rowData),
  });

  // Extraer todas las variables del prompt
  const extractedPaths = extractVariablePaths(prompt);
  console.log("[replaceVariablesInPrompt] Extracted paths:", extractedPaths);

  // Obtener las columnas base disponibles
  const basePaths = getAvailableBasePaths(variableColumns);
  console.log("[replaceVariablesInPrompt] Base paths:", basePaths);

  let finalPrompt = prompt;

  // Reemplazar cada variable encontrada
  extractedPaths.forEach((path) => {
    const firstDot = path.indexOf('.');
    const basePath = firstDot !== -1 ? path.substring(0, firstDot) : path;

    console.log("[replaceVariablesInPrompt] Processing path:", path, "- basePath:", basePath);

    // Solo reemplazar si la columna base está disponible
    if (basePaths.includes(basePath)) {
      console.log("[replaceVariablesInPrompt] Base path found, attempting to get value");
      console.log("[replaceVariablesInPrompt] rowData[basePath]:", rowData[basePath]);

      // Para variables de primer nivel (sin punto), usar directamente el valor de la columna
      if (firstDot === -1) {
        const value = rowData[basePath];
        const stringValue = value != null ? String(value) : "";
        console.log("[replaceVariablesInPrompt] Simple value:", stringValue);
        finalPrompt = finalPrompt.replace(
          new RegExp(`\\{${path}\\}`, "g"),
          stringValue,
        );
      } else {
        // Para propiedades anidadas (con punto), usar getNestedValue
        // getNestedValue() navegará desde el raíz usando el path completo
        const value = getNestedValue(rowData, path);
        console.log("[replaceVariablesInPrompt] Nested value:", value);
        finalPrompt = finalPrompt.replace(
          new RegExp(`\\{${path}\\}`, "g"),
          value,
        );
      }
    } else {
      console.log("[replaceVariablesInPrompt] Base path not found, skipping");
    }
  });

  console.log("[replaceVariablesInPrompt] Final prompt:", finalPrompt);

  return finalPrompt;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function generateAIContent(
  apiKey: string,
  prompt: string,
  variableColumns: string[],
  rowData: Record<string, unknown>,
  formatInstructions?: string,
  model: string = "gemini-2.5-flash",
): Promise<string> {
  if (!apiKey) {
    throw new Error("AI API Key not configured");
  }

  // Usar la nueva función para reemplazar variables
  const finalPrompt = replaceVariablesInPrompt(prompt, variableColumns, rowData);

  const promptWithInstructions = formatInstructions && formatInstructions.trim()
    ? finalPrompt + "\n\n" + formatInstructions
    : finalPrompt;

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: promptWithInstructions,
    });
    return response.text || "";
  } catch (error) {
    console.error("AI generation error:", error);
    throw error;
  }
}

export async function generateAIImage(
  apiKey: string,
  prompt: string,
  variableColumns: string[],
  rowData: Record<string, unknown>,
  model: string = "gemini-3.1-flash-image-preview",
): Promise<File> {
  if (!apiKey) {
    throw new Error("AI API Key not configured");
  }

  // Usar la nueva función para reemplazar variables
  const finalPrompt = replaceVariablesInPrompt(prompt, variableColumns, rowData);

  const ai = new GoogleGenAI({ apiKey });

  try {
    console.log("[useAI] Generating image with model:", model);
    console.log("[useAI] Prompt:", finalPrompt);

    const isGenerateImagesModel = model.startsWith(
      "gemini-3.1-flash-image-preview",
    );

    if (isGenerateImagesModel) {
      console.log("[useAI] Using generateContent() method for imagen model");
      const response = await ai.models.generateContent({
        model,
        contents: finalPrompt,
        config: {
          responseModalities: ["Image"],
          imageConfig: {
            aspectRatio: "4:3",
            imageSize: "1K",
          },
        },
      });

      console.log(
        "[useAI] generateContent response:",
        JSON.stringify(response, null, 2),
      );

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No content generated");
      }

      const candidate = response.candidates[0];
      console.log("[useAI] Candidate:", candidate);

      if (
        !candidate.content ||
        !candidate.content.parts ||
        candidate.content.parts.length === 0
      ) {
        throw new Error("No content parts generated");
      }

      console.log("[useAI] Content parts:", candidate.content?.parts);

      for (const part of candidate.content.parts) {
        console.log("[useAI] Part:", part);

        if (part.inlineData && part.inlineData.data) {
          const imageData = part.inlineData.data;
          console.log("[useAI] Found inline data, length:", imageData.length);

          const imageBytes = base64ToUint8Array(imageData);
          const fileName = `generated_${Date.now()}.png`;
          const file = new File([imageBytes.buffer as ArrayBuffer], fileName, {
            type: "image/png",
          });

          console.log(
            "[useAI] Created file:",
            fileName,
            "Size:",
            imageBytes.length,
            "bytes",
          );

          const webPFile = await convertToWebP(file, 0.92);

          console.log("[useAI] Converted to WebP:", {
            original: file.size,
            webp: webPFile.size,
            reduction: `${((1 - webPFile.size / file.size) * 100).toFixed(1)}%`,
          });

          return webPFile;
        }
      }

      throw new Error("No image data found in response");
    } else {
      console.log("[useAI] Using generateContent() method");
      const response = await ai.models.generateContent({
        model,
        contents: finalPrompt,
      });

      console.log(
        "[useAI] generateContent response:",
        JSON.stringify(response, null, 2),
      );

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No content generated");
      }

      const candidate = response.candidates[0];
      console.log("[useAI] Candidate:", candidate);

      if (
        !candidate.content ||
        !candidate.content.parts ||
        candidate.content.parts.length === 0
      ) {
        throw new Error("No content parts generated");
      }

      console.log("[useAI] Content parts:", candidate.content?.parts);

      for (const part of candidate.content.parts) {
        console.log("[useAI] Part:", part);

        if (part.inlineData && part.inlineData.data) {
          const imageData = part.inlineData.data;
          console.log("[useAI] Found inline data, length:", imageData.length);

          const imageBytes = base64ToUint8Array(imageData);
          const fileName = `generated_${Date.now()}.png`;
          const file = new File([imageBytes.buffer as ArrayBuffer], fileName, {
            type: "image/png",
          });

          console.log(
            "[useAI] Created file:",
            fileName,
            "Size:",
            imageBytes.length,
            "bytes",
          );

          const webPFile = await convertToWebP(file, 0.92);

          console.log("[useAI] Converted to WebP:", {
            original: file.size,
            webp: webPFile.size,
            reduction: `${((1 - webPFile.size / file.size) * 100).toFixed(1)}%`,
          });

          return webPFile;
        }
      }

      throw new Error("No image data found in response");
    }
  } catch (error) {
    console.error("[useAI] AI image generation error:", error);
    throw error;
  }
}
