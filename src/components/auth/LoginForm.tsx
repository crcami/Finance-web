import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { AnimatedTitle } from "./AnimatedTitle";
import { Eye, EyeOff } from "lucide-react";
import "../../styles/StyleButton.css";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <AnimatedTitle />
      <div className="w-full max-w-[480px]">
        <Card className="backdrop-blur-sm bg-[#FFFFFFCC] border-[#FFFFFF33] shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle as="div" className="title--login">
              Login
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="rounded-lg bg-white"
                  placeholder="Digite seu e-mail"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="login-password">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="rounded-lg bg-white login-password__input"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-controls="password"
                    onClick={() => setShowPassword((v) => !v)}
                    className="login-password__toggle"
                  >
                    {showPassword ? (
                      <EyeOff className="login-password__icon" />
                    ) : (
                      <Eye className="login-password__icon" />
                    )}
                  </button>
                </div>

                <div className="text-right -mt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/auth/recover", { state: { prefillEmail: email } })}
                    className="text-[#11224E] hover:underline text-sm font-medium"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-6">
              <Button type="submit" className="w-full bg-[#3B82F6] hover:bg-[#2563EB]">
                Entrar
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-white/90">
            Não tem registro?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-[#C2E2FA] hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-white/60">
          <a href="#" className="hover:underline">Política de Privacidade</a>
          {" • "}
          <a href="#" className="hover:underline">Termos de Uso</a>
        </div>
      </div>
    </div>
  );
}
