import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { financeApi } from "../../features/auth/api";

import "../../styles/RecoverPasswordForm.css";
import Logo from "../../assets/logo-finance.png";

interface RecoverPasswordFormProps {
  onBackToLogin: () => void;
  prefillEmail?: string;
}

export function RecoverPasswordForm({ onBackToLogin, prefillEmail }: RecoverPasswordFormProps) {
  const [recoverEmail, setRecoverEmail] = useState(prefillEmail ?? "");
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverMessage, setRecoverMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof prefillEmail === "string") setRecoverEmail(prefillEmail);
  }, [prefillEmail]);

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  async function handleRecoverSend() {
    try {
      setRecoverLoading(true);
      setRecoverMessage(null);

      const email = recoverEmail.trim();
      if (!isValidEmail(email)) {
        setRecoverMessage("Por favor, informe um e-mail válido.");
        return;
      }

     
      const message = await financeApi.resetPassword(email);
      setRecoverMessage(message ?? "Se o e-mail existir, enviamos instruções para redefinição.");
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message || err?.message;
      setRecoverMessage(apiMsg || "Erro ao recuperar a senha.");
      console.error("[RecoverPassword] reset error:", err);
    } finally {
      setRecoverLoading(false);
    }
  }

  return (
    <div className="recover-page">
      <div className="recover-container">
        <Card className="recover-card">
          <CardHeader>
            <CardTitle as="div" className="recover-title">
              Recuperar Senha
            </CardTitle>
          </CardHeader>

          <CardContent className="recover-content">
            <p className="recover-subtitle">
              Não se preocupe! Digite seu e-mail abaixo e enviaremos uma nova senha no seu e-mail.
            </p>

            <div className="recover-field">
              <Label htmlFor="recoverEmail" className="recover-label">
                E-mail
              </Label>
              <Input
                id="recoverEmail"
                type="email"
                value={recoverEmail}
                onChange={(e) => setRecoverEmail(e.target.value)}
                placeholder="seuemail@dominio.com"
                autoComplete="email"
                autoFocus
                className="recover-input input-custom-focus"
              />
            </div>

            {recoverMessage && (
              <p className="recover-message" role="status" aria-live="polite">
                {recoverMessage}
              </p>
            )}
          </CardContent>

          <CardFooter className="recover-footer">
            <div className="recover-actions">
              <Button type="button" onClick={onBackToLogin} className="btn-cancel">
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleRecoverSend}
                disabled={recoverLoading || !isValidEmail(recoverEmail)}
                className="btn-primary"
              >
                {recoverLoading ? "Enviando..." : "Enviar"}
              </Button>
            </div>

            <div className="recover-logo-wrap">
              <img src={Logo} alt="Finance Aplicativo Logo" className="recover-logo" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
