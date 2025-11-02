import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { apiClient } from "@/api/client";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.login(username, password);
      onLogin(response.token);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to Active Annotate
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button
            onClick={handleLogin}
            disabled={loading}
            fullWidth
            color="primary"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
