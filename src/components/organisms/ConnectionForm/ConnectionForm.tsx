import { Database, Lock, Key } from "lucide-react";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import { AuthModeToggle } from "../../molecules/AuthModeToggle";
import { useConnectionForm } from "./useConnectionForm";

export function ConnectionForm() {
  const {
    formData,
    setPocketbaseUrl,
    setEmail,
    setPassword,
    setApiToken,
    setAuthMode,
    handleSubmit,
    isLoading,
    error,
  } = useConnectionForm();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Database className="w-5 h-5" />
        Connect to PocketBase
      </h2>

      <AuthModeToggle
        mode={formData.authMode}
        onModeChange={setAuthMode}
        disabled={isLoading}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="url"
          label="PocketBase URL"
          value={formData.pocketbaseUrl}
          onChange={(e) => setPocketbaseUrl(e.target.value)}
          placeholder="http://127.0.0.1:8090"
          disabled={isLoading}
          error={error || undefined}
        />

        {formData.authMode === "password" ? (
          <>
            <Input
              type="email"
              label="Admin Email"
              value={formData.email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={isLoading}
            />
            <Input
              type="password"
              label="Admin Password"
              value={formData.password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </>
        ) : (
          <Input
            type="password"
            label="Admin API Token"
            value={formData.apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Enter your PocketBase Admin API token"
            disabled={isLoading}
            helperText="Create an API token in your PocketBase dashboard under Settings → API Keys"
          />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          variant="primary"
          icon={formData.authMode === "password" ? <Lock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
          className="w-full"
        >
          {isLoading ? "Connecting..." : "Connect"}
        </Button>
      </form>
    </div>
  );
}
