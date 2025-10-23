import { useEffect, useState } from "react";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { RecordsMonth } from "./components/records/RecordsMonth";
import { Toaster, toast } from "sonner";
import backgroundImage from "figma:asset/background-login.png";
import {
  login as apiLogin,
  register as apiRegister,
  getSession,
  Logout,
} from "@/features/auth/api";

type Page = "login" | "register" | "app";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
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
          setCurrentPage("app");
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
      setCurrentPage("app");
      toast.success("Login realizado com sucesso!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Credenciais inválidas");
    }
  }

  // agora recebe fullName em camelCase e mapeia para full_name no payload
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
      await apiRegister({ email, password, full_name: fullName }); // 👈 chave snake_case
      setIsAuthenticated(true);
      setCurrentPage("app");
      setUserName(fullName && fullName.trim() ? fullName.trim() : toDisplayName(email));
      toast.success("Conta criada e sessão iniciada!");
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
      setCurrentPage("login");
      toast.success("Logout realizado com sucesso!");
    }
  }

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
        {checkingSession ? (
          <div className="min-h-screen grid place-items-center text-white/80">Carregando…</div>
        ) : currentPage === "login" ? (
          <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage("register")} />
        ) : currentPage === "register" ? (
          <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage("login")} />
        ) : (
          isAuthenticated && <RecordsMonth onLogout={handleLogout} userName={userName} />
        )}
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
