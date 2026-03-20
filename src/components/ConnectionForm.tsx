import { useState, useEffect } from "react";
import { usePocketBase } from "../context/usePocketBase";
import { Database, Loader2, Key, Mail, Lock } from "lucide-react";

export function ConnectionForm() {
  const { connect, connectWithToken, isLoading, error } = usePocketBase();

  // Load saved values from localStorage on mount using lazy initialization
  const [pocketbaseUrl, setPocketbaseUrl] = useState(
    () => localStorage.getItem("pocketbase_url") || "",
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem("pocketbase_email") || "",
  );
  const [password, setPassword] = useState("");
  const [apiToken, setApiToken] = useState(
    () => localStorage.getItem("pocketbase_token") || "",
  );
  const [authMode, setAuthMode] = useState<"password" | "token">(
    () =>
      (localStorage.getItem("pocketbase_auth_mode") as
        | "password"
        | "token"
        | null) || "password",
  );
  const [localError, setLocalError] = useState("");

  // Save values to localStorage when they change
  useEffect(() => {
    if (pocketbaseUrl) localStorage.setItem("pocketbase_url", pocketbaseUrl);
    if (email) localStorage.setItem("pocketbase_email", email);
    if (apiToken) localStorage.setItem("pocketbase_token", apiToken);
    localStorage.setItem("pocketbase_auth_mode", authMode);
  }, [pocketbaseUrl, email, apiToken, authMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!pocketbaseUrl) {
      setLocalError("Please enter a PocketBase URL");
      return;
    }

    // Validate URL format
    try {
      new URL(pocketbaseUrl);
    } catch {
      setLocalError("Please enter a valid URL");
      return;
    }

    if (authMode === "password") {
      if (!email || !password) {
        setLocalError("Please fill in all fields");
        return;
      }
      await connect(pocketbaseUrl, email, password);
    } else {
      if (!apiToken) {
        setLocalError("Please enter your API token");
        return;
      }
      await connectWithToken(pocketbaseUrl, apiToken);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Database className="w-5 h-5" />
        Connect to PocketBase
      </h2>

      {/* Auth Mode Toggle */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setAuthMode("password")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            authMode === "password"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Mail className="w-4 h-4 inline-block mr-1" />
          Email / Password
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("token")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            authMode === "token"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Key className="w-4 h-4 inline-block mr-1" />
          API Token
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PocketBase URL
          </label>
          <input
            type="url"
            value={pocketbaseUrl}
            onChange={(e) => setPocketbaseUrl(e.target.value)}
            placeholder="http://127.0.0.1:8090"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {authMode === "password" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin API Token
            </label>
            <input
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="Enter your PocketBase Admin API token"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Create an API token in your PocketBase dashboard under Settings →
              API Keys
            </p>
          </div>
        )}

        {(localError || error) && (
          <p className="text-red-500 text-sm">{localError || error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              {authMode === "password" ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              Connect
            </>
          )}
        </button>
      </form>
    </div>
  );
}
