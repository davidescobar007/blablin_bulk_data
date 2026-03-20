import { useContext } from "react";
import {
  PocketBaseContext,
  type PocketBaseContextType,
  GEMINI_MODELS,
} from "./PocketBaseContext";

/**
 * Hook to access the PocketBase context
 * Must be used within a PocketBaseProvider
 */
export const usePocketBase = (): PocketBaseContextType => {
  const context = useContext(PocketBaseContext);
  if (context === undefined) {
    throw new Error("usePocketBase must be used within a PocketBaseProvider");
  }
  return context;
};

export { GEMINI_MODELS };
