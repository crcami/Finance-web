// src/App.tsx
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import backgroundImage from "figma:asset/background-login.png";
import { Toaster, toast } from "sonner";

import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { RecoverPasswordForm } from "./components/auth/RecoverPasswordForm";
import { RecordsMonth } from "./components/records/RecordsMonth";

import {
  login as apiLogin,
  register as apiRegister,
  getSession,
  Logout,
} from "@/features/auth/api";

/** Layout wrapper that keeps background and Toaster around all routes */
function AppShell() {
  return (
    <div
      className="min-h-screen bg-[#0B1220] relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="absolute inset-0 backdrop-blur-[14px]"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      />
      <div className="relative z-10">
        <Outlet />
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

/** Simple auth guard for the /app route */
function RequireAuth({
  isAuthenticated,
  checkingSession,
  children,
}: {
  isAuthenticated: boolean;
  checkingSession: boolean;
  children: React.ReactNode;
}) {
  if (checkingSession) {
    return <div className="min-h-screen grid place-items-center text-white/80">Carregando…</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
}

/** Route element that renders LoginForm and handles routing without creating a Page component */
function LoginRoute({
  isAuthenticated,
  onLogin,
}: {
  isAuthenticated: boolean;
  onLogin: (email: string, password: string) => void;
}) {
  const navigate = useNavigate();

  // If already authenticated, go straight to app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <LoginForm
      onLogin={onLogin}
      onSwitchToRegister={() => navigate("/auth/register")}
      // If you add "onSwitchToRecover" prop to your LoginForm, pass it here:
      // onSwitchToRecover={(email) => navigate("/auth/recover", { state: { prefillEmail: email } })}
    />
  );
}

/** Route element that renders RegisterForm and handles routing without creating a Page component */
function RegisterRoute({
  isAuthenticated,
  onRegister,
}: {
  isAuthenticated: boolean;
  onRegister: (email: string, password: string, confirmPassword: string, fullName?: string) => void;
}) {
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <RegisterForm
      onRegister={onRegister}
      onSwitchToLogin={() => navigate("/auth/login")}
    />
  );
}

/** Route element for RecoverPasswordForm, supports pre-filling email via route state */
function RecoverRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail =
    (location.state as { prefillEmail?: string } | null)?.prefillEmail ?? "";

  return (
    <RecoverPasswordForm
      onBackToLogin={() => navigate("/auth/login")}
      prefillEmail={prefillEmail} // this prop is optional in your component
    />
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setCheckingSession(false);
      return;
    }
    (async () => {
      try {
        const s = await getSession();
        if (s.authenticated) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        setCheckingSession(false);
      }
    })();
  }, []);

  function toDisplayName(email: string) {
    const name = email.split("@")[0] ?? "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  async function handleLogin(email: string, password: string) {
    try {
      await apiLogin({ email, password });
      setUserName(toDisplayName(email));
      setIsAuthenticated(true);
      toast.success("Login realizado com sucesso!");
      // Redirection happens in <LoginRoute/> via <Navigate />
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Credenciais inválidas");
    }
  }

  async function handleRegister(
    email: string,
    password: string,
    confirmPassword: string,
    fullName?: string
  ) {
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    try {
      await apiRegister({ email, password, full_name: fullName });
      setIsAuthenticated(true);
      setUserName(fullName && fullName.trim() ? fullName.trim() : toDisplayName(email));
      toast.success("Conta criada e sessão iniciada!");
      // Redirection happens in <RegisterRoute/> via <Navigate />
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Erro ao criar conta");
    }
  }

  async function handleLogout() {
    try {
      await Logout();
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      setUserName("");
      toast.success("Logout realizado com sucesso!");
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            path="/auth/login"
            element={<LoginRoute isAuthenticated={isAuthenticated} onLogin={handleLogin} />}
          />
          <Route
            path="/auth/register"
            element={<RegisterRoute isAuthenticated={isAuthenticated} onRegister={handleRegister} />}
          />
          <Route path="/auth/recover" element={<RecoverRoute />} />
          <Route
            path="/app"
            element={
              <RequireAuth
                isAuthenticated={isAuthenticated}
                checkingSession={checkingSession}
              >
                <RecordsMonth onLogout={handleLogout} userName={userName} />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
