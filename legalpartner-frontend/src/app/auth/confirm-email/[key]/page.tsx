"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { apiVerifyEmail, getApiErrorMessage, getErrorMessage } from "@/lib/api";

type Status = "verifying" | "ok" | "error";

/**
 * Destino del enlace del correo de verificación (…/confirm-email/<key>/).
 * Envía la clave a POST /api/auth/verify-email/ y muestra el resultado.
 */
export default function ConfirmEmailPage() {
  const params = useParams();
  const key = typeof params?.key === "string" ? params.key : Array.isArray(params?.key) ? params.key[0] : "";
  const [status, setStatus] = useState<Status>(key ? "verifying" : "error");
  const [message, setMessage] = useState<string>(key ? "" : "Falta la clave de verificación.");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    apiVerifyEmail(key)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setStatus("ok");
          setMessage(res.message || "Email verificado exitosamente.");
        } else {
          setStatus("error");
          setMessage(getErrorMessage(res, "Clave de verificación inválida o expirada."));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(getApiErrorMessage(err, "Clave de verificación inválida o expirada."));
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificación de email</h2>
            {status === "verifying" && (
              <p className="flex items-center gap-2 text-sm text-gray-600" role="status">
                <Loader2 className="h-4 w-4 animate-spin" /> Verificando tu email…
              </p>
            )}
            {status === "ok" && <p className="text-sm text-secondary-700" role="status">{message}</p>}
            {status === "error" && <p className="text-sm text-danger-600" role="alert">{message}</p>}
            <div className="mt-6 text-center text-sm">
              <Link href="/auth/login" className="text-primary-600">
                {status === "ok" ? "Iniciar sesión" : "Volver al inicio de sesión"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
