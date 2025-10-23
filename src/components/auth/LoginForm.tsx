import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { AnimatedTitle } from "./AnimatedTitle";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            <CardTitle>Entrar</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-lg bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-lg bg-white"
                />
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
