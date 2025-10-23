import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { AnimatedTitle } from "./AnimatedTitle";
import logoImage from "figma:asset/logo-finance.png";

interface RegisterFormProps {
  onRegister: (email: string, password: string, confirmPassword: string) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(email, password, confirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Card de Registro */}
        <div className="order-2 lg:order-1">
          <AnimatedTitle text="Registre-se" fontSize="2.5rem" className="mb-6" align="left" />
          <Card className="backdrop-blur-md bg-[#FFFFFFDD] border-[#FFFFFF44] shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle>Criar conta</CardTitle>
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="rounded-lg bg-white"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button type="submit" className="w-full bg-[#3B82F6] hover:bg-[#2563EB]">
                  Cadastrar
                </Button>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#3B82F6] hover:underline"
                >
                  Voltar ao login
                </button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Card Informativo */}
        <div className="order-1 lg:order-2">
          <div className="mb-6 h-[60px]"></div>
          <Card className="backdrop-blur-md bg-[#FFFFFFDD] border-[#FFFFFF44] shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#1A2A4F]" style={{ fontWeight: 700 }}>
                Meu Aplicativo de Finanças
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-gray-700 leading-relaxed">
                Usar o nosso aplicativo é ganhar clareza e controle do seu dinheiro no dia a dia. 
                A tela principal mostra o mês atual em uma visão simples e organizada, com seus 
                lançamentos ordenados por data. Você navega com um clique para meses anteriores ou 
                futuros, adiciona novos registros em segundos e ainda pode editar, confirmar 
                pagamentos/recebimentos ou excluir itens sem complicação.
              </p>
              <div className="flex justify-center pb-4">
                <img 
                  src={logoImage} 
                  alt="Logo Meu Aplicativo de Finanças" 
                  className="max-w-[200px] w-full h-auto object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
