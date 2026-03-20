import { useState, useEffect, useCallback } from "react";
import { usePocketBase } from "../../../context/usePocketBase";

export interface ConnectionFormData {
  pocketbaseUrl: string;
  email: string;
  password: string;
  apiToken: string;
  authMode: "password" | "token";
  localError: string;
}

export function useConnectionForm() {
  const { connect, connectWithToken, isLoading, error } = usePocketBase();

  const getInitialFormData = useCallback((): ConnectionFormData => ({
    pocketbaseUrl: localStorage.getItem("pocketbase_url") || "",
    email: localStorage.getItem("pocketbase_email") || "",
    password: "",
    apiToken: localStorage.getItem("pocketbase_token") || "",
    authMode: ((localStorage.getItem("pocketbase_auth_mode") as "password" | "token" | null) || "password"),
    localError: "",
  }), []);

  const [formData, setFormData] = useState<ConnectionFormData>(getInitialFormData);

  useEffect(() => {
    if (formData.pocketbaseUrl) {
      localStorage.setItem("pocketbase_url", formData.pocketbaseUrl);
    }
    if (formData.email) {
      localStorage.setItem("pocketbase_email", formData.email);
    }
    if (formData.apiToken) {
      localStorage.setItem("pocketbase_token", formData.apiToken);
    }
    localStorage.setItem("pocketbase_auth_mode", formData.authMode);
  }, [formData.pocketbaseUrl, formData.email, formData.apiToken, formData.authMode]);

  const setPocketbaseUrl = useCallback((url: string) => {
    setFormData((prev) => ({ ...prev, pocketbaseUrl: url, localError: "" }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setFormData((prev) => ({ ...prev, email, localError: "" }));
  }, []);

  const setPassword = useCallback((password: string) => {
    setFormData((prev) => ({ ...prev, password, localError: "" }));
  }, []);

  const setApiToken = useCallback((token: string) => {
    setFormData((prev) => ({ ...prev, apiToken: token, localError: "" }));
  }, []);

  const setAuthMode = useCallback((mode: "password" | "token") => {
    setFormData((prev) => ({ ...prev, authMode: mode, localError: "" }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, localError: "" }));

    if (!formData.pocketbaseUrl) {
      setFormData((prev) => ({ ...prev, localError: "Please enter a PocketBase URL" }));
      return;
    }

    try {
      new URL(formData.pocketbaseUrl);
    } catch {
      setFormData((prev) => ({ ...prev, localError: "Please enter a valid URL" }));
      return;
    }

    if (formData.authMode === "password") {
      if (!formData.email || !formData.password) {
        setFormData((prev) => ({ ...prev, localError: "Please fill in all fields" }));
        return;
      }
      await connect(formData.pocketbaseUrl, formData.email, formData.password);
    } else {
      if (!formData.apiToken) {
        setFormData((prev) => ({ ...prev, localError: "Please enter your API token" }));
        return;
      }
      await connectWithToken(formData.pocketbaseUrl, formData.apiToken);
    }
  }, [formData, connect, connectWithToken]);

  return {
    formData,
    setPocketbaseUrl,
    setEmail,
    setPassword,
    setApiToken,
    setAuthMode,
    handleSubmit,
    isLoading,
    error: formData.localError || error,
  };
}
