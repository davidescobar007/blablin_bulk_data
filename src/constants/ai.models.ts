export const GEMINI_MODELS = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Modelo rápido y eficiente para tareas generales",
    category: "stable" as const,
    type: "text" as const,
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Modelo pro para tareas complejas y razonamiento",
    category: "stable" as const,
    type: "text" as const,
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash (Experimental)",
    description: "Modelo experimental con capacidades multimodales",
    category: "experimental" as const,
    type: "text" as const,
  },
  {
    id: "imagen-3.0-generate-001",
    name: "Imagen 3.0",
    description: "Modelo de generación de imágenes de alta calidad",
    category: "image" as const,
    type: "image" as const,
  },
  {
    id: "imagen-4.0-generate-001",
    name: "Imagen 4.0",
    description: "Modelo más avanzado para generación de imágenes",
    category: "experimental" as const,
    type: "image" as const,
  },
  {
    id: "gemini-3.1-flash-image-preview",
    name: "Gemini 3.1 Flash Image Preview",
    description: "Modelo multimodal para generar imágenes",
    category: "experimental" as const,
    type: "image" as const,
  },
] as const;

export type GeminiModelId = (typeof GEMINI_MODELS)[number]["id"];
