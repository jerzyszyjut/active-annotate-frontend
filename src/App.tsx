import { useState } from "react";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";

function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <>
      {token ? (
        <DashboardPage token={token} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
