import { useState } from "react";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { RecordsMonth } from "./components/records/RecordsMonth";
import { Toaster, toast } from "sonner";
import backgroundImage from "figma:asset/background-login.png";

type Page = "login" | "register" | "app";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const handleLogin = async (email: string, password: string) => {
    // Simulate API call
    try {
      if (email && password) {
        setTimeout(() => {
          const name = email.split("@")[0];
          setUserName(name.charAt(0).toUpperCase() + name.slice(1));
          setIsAuthenticated(true);
          setCurrentPage("app");
          toast.success("Login realizado com sucesso!");
        }, 500);
      } else {
        toast.error("Credenciais inválidas");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    }
  };

  const handleRegister = async (email: string, password: string, confirmPassword: string) => {
    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    // Simulate API call
    try {
      if (email && password) {
        setTimeout(() => {
          toast.success("Conta criada com sucesso!");
          setCurrentPage("login");
        }, 500);
      } else {
        toast.error("Preencha todos os campos");
      }
    } catch (error) {
      toast.error("Erro ao criar conta");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    setCurrentPage("login");
    toast.success("Logout realizado com sucesso!");
  };

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
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />
      <div className="relative z-10">
        {currentPage === "login" && (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentPage("register")}
          />
        )}
        {currentPage === "register" && (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentPage("login")}
          />
        )}
        {currentPage === "app" && isAuthenticated && (
          <RecordsMonth onLogout={handleLogout} userName={userName} />
        )}
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
