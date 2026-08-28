"use client";
import { useEffect, useState } from "react";
import { apiRegister, getApiErrorMessage, getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/common/Button";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) router.replace("/dashboard");
  }, [auth.isAuthenticated, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);
    try {
      const res = await apiRegister({
        email,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName,
        last_name: lastName,
        organization: organization || undefined,
      });
      if (!res.success) {
        setError(getErrorMessage(res, "No se pudo crear la cuenta"));
        setLoading(false);
        return;
      }
      if (res.requires_verification) {
        setStatus("Cuenta creada. Verifica tu email para activar.");
        setTimeout(() => router.push("/auth/login"), 1200);
        return;
      }
      if (res.tokens?.access && res.tokens.refresh && res.user) {
        auth.login(res.tokens, res.user);
        router.push("/dashboard");
      } else {
        setStatus("Cuenta creada. Inicia sesión para continuar.");
        setTimeout(() => router.push("/auth/login"), 1200);
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "No se pudo crear la cuenta"));
    } finally {
      setLoading(false);
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Crear cuenta</h2>
            <p className="text-sm text-gray-600 mb-6">Regístrate para comenzar</p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                <input
                  id="password-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organización (opcional)</label>
                <input
                  id="organization"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                />
              </div>
              {error && <div className="text-danger-600 text-sm">{String(error)}</div>}
              {status && <div className="text-secondary-700 text-sm">{String(status)}</div>}
              <Button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
                {loading ? "Creando cuenta..." : "Registrarse"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <Link href="/auth/login" className="text-primary-600">¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}