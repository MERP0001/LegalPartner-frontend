"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadDocument, getOcrStatus } from "@/lib/api";
import { getApiErrorMessage, getErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/store/authStore";
import Protected from "@/components/layout/Protected";
import StartAnalysisForm from "@/components/analysis/StartAnalysisForm";
import type { Document, DocumentStatus } from "@/types";
import { Loader2 } from "lucide-react";
import { CONTRACT_TYPE_OPTIONS } from "@/lib/labels";

const OCR_POLL_INTERVAL_MS = 2000;


export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<Document | null>(null);
  // Estado OCR del documento subido; el análisis solo puede iniciarse cuando está "processed"
  const [ocrStatus, setOcrStatus] = useState<DocumentStatus | null>(null);
  const auth = useAuthStore();
  const router = useRouter();

  // Sondear GET /documents/{id}/ocr_status/ hasta que el OCR termine o falle
  useEffect(() => {
    if (!uploadedDocument) return;
    if (ocrStatus === "processed" || ocrStatus === "failed") return;
    let cancelled = false;
    const check = async () => {
      try {
        const res = await getOcrStatus(uploadedDocument.document_id);
        if (!cancelled && res.success && res.current_status) setOcrStatus(res.current_status);
      } catch {
        // Error transitorio de red: se reintenta en el siguiente tick
      }
    };
    check();
    const timer = setInterval(check, OCR_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [uploadedDocument, ocrStatus]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setUploadedDocument(null);
    setOcrStatus(null);
    if (!file) {
      setStatus("Selecciona un archivo");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadDocument(file, type || undefined);
      if (res?.success && res.data) {
        setStatus(res?.message || "Documento subido exitosamente");
        setUploadedDocument(res.data);
        setOcrStatus(res.data.document_status);
        setFile(null);
        setType("");
      } else {
        setStatus(getErrorMessage(res, "No se pudo subir el documento"));
      }
    } catch (err: unknown) {
      setStatus(getApiErrorMessage(err, "No se pudo subir el documento"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Protected />
      <div className="container px-4 py-12 mx-auto">
        <div className="mx-auto space-y-6 max-w-7xl">
          {/* Upload Form */}
          <div className="card-premium">
            <div className="card-premium-inner">
              <h2 className="text-2xl font-bold text-gray-900">Muéstranos tu contrato</h2>
              <p className="mb-6 text-sm text-gray-600">Déjanos ayudarte</p>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="p-6 text-center rounded-2xl bg-white/90 ring-2 ring-dashed ring-primary-200">
                  <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
                    Selecciona tu archivo PDF
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="contract-type" className="block text-sm font-medium text-gray-700">
                    Tipo de contrato
                  </label>
                  <select
                    id="contract-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full mt-1 rounded-md bg-white/90 ring-1 ring-gray-200 focus:border-primary-600 focus:ring-primary-600"
                  >
                    <option value="">Selecciona</option>
                    {CONTRACT_TYPE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                {status && (
                  <div className={"text-sm " + (status.includes("exitos") ? "text-secondary-700" : "text-danger-600")}>{status}</div>
                )}
                <Button
                  type="submit"
                  disabled={loading || !auth.hasHydrated || !auth.isAuthenticated}
                  className="w-full text-white shadow-sm bg-primary-600 hover:bg-primary-700"
                >
                  {loading ? "Subiendo..." : "Subir"}
                </Button>
                {auth.hasHydrated && !auth.isAuthenticated && (
                  <div className="text-sm text-danger-600">Inicia sesión para subir documentos</div>
                )}
              </form>
            </div>
          </div>

          {/* Estado del OCR del documento recién subido */}
          {uploadedDocument && ocrStatus !== "processed" && ocrStatus !== "failed" && (
            <div className="flex items-center gap-2 p-4 text-sm text-blue-700 border border-blue-200 rounded-lg bg-blue-50" role="status">
              <Loader2 className="w-4 h-4 animate-spin" />
              Extrayendo el texto del documento (OCR)… El análisis estará disponible en cuanto termine.
            </div>
          )}
          {uploadedDocument && ocrStatus === "failed" && (
            <div className="p-4 text-sm border rounded-lg text-danger-600 border-danger-200 bg-danger-50" role="alert">
              El procesamiento OCR del documento falló. Intenta subirlo de nuevo o usa otro PDF.
            </div>
          )}

          {/* Start Analysis Form - solo cuando el documento ya está procesado */}
          {uploadedDocument && ocrStatus === "processed" && (
            <StartAnalysisForm
              preSelectedDocumentId={uploadedDocument.document_id}
              onAnalysisComplete={(analysisId) => router.push(`/analysis/${analysisId}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}