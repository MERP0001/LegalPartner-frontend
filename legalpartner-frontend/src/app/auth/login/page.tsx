"use client";
import { useEffect, useState } from "react";
import { apiLogin, apiResendVerification, getApiErrorData, getApiErrorMessage, getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/common/Button";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Email pendiente de verificar (el backend responde 403 con requires_verification)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const auth = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) router.replace('/dashboard');
  }, [auth.isAuthenticated, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingEmail(null);
    setResendMsg(null);
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      if (!res.success) {
        setError(getErrorMessage(res, "Credenciales inválidas"));
        setLoading(false);
        return;
      }
      if (res.requires_verification) {
        setPendingEmail(res.email || email);
        setError(getErrorMessage(res, "Verifica tu email antes de iniciar sesión"));
        setLoading(false);
        return;
      }
      if (res.tokens?.access && res.tokens.refresh && res.user) {
        auth.login(res.tokens, res.user);
        router.push("/dashboard");
      } else {
        setError("Respuesta de login inválida");
      }
    } catch (err: unknown) {
      // El 403 de "email sin verificar" llega como excepción de axios
      const data = getApiErrorData(err);
      if (data?.requires_verification) {
        setPendingEmail(data.email || email);
      }
      setError(getApiErrorMessage(err, "Credenciales inválidas"));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!pendingEmail) return;
    setResendMsg(null);
    try {
      const res = await apiResendVerification(pendingEmail);
      setResendMsg(res.message || "Correo de verificación reenviado.");
    } catch (err) {
      setResendMsg(getApiErrorMessage(err, "No se pudo reenviar el correo"));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="h-2 bg-danger-600" />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto card-premium">
          <div className="card-premium-inner p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">LegalPartner</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Bienvenido</h2>
            <p className="text-sm text-gray-600 mb-6">Inicia sesión para continuar</p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                  required
                />
              </div>
              {error && (
                <div className="text-danger-600 text-sm">{String(error)}</div>
              )}
              {pendingEmail && (
                <div className="text-sm">
                  <button type="button" onClick={onResend} className="text-primary-600 underline">
                    Reenviar correo de verificación a {pendingEmail}
                  </button>
                  {resendMsg && <div className="mt-1 text-gray-600">{resendMsg}</div>}
                </div>
              )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
            >
              {loading ? "Ingresando..." : "Log In"}
            </Button>
            </form>
            <div className="mt-4 text-center text-sm flex items-center justify-center gap-4">
              <Link href="/" className="text-primary-600">Volver al inicio</Link>
              <span className="text-gray-400">•</span>
              <Link href="/auth/register" className="text-primary-600">Crear cuenta</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}