"use client";
import { useState } from "react";
import { uploadDocument } from "@/lib/api";
import { getApiErrorMessage, getErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/store/authStore";
import Protected from "@/components/layout/Protected";
import StartAnalysisForm from "@/components/analysis/StartAnalysisForm";
import type { Document } from "@/types";

const CONTRACT_TYPES = [
  { value: "employment", label: "Trabajo" },
  { value: "rent", label: "Alquiler" },
  { value: "services", label: "Servicios" },
  { value: "mortgage", label: "Hipoteca" },
  { value: "transfers", label: "Transferencias" },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<Document | null>(null);
  const auth = useAuthStore();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setUploadedDocument(null);
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
                    {CONTRACT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                {status && (
                  <div className={"text-sm " + (status.includes("exitos") ? "text-secondary-700" : "text-danger-600")}>{status}</div>
                )}
                <Button
                  type="submit"
                  disabled={loading || !auth.isAuthenticated}
                  className="w-full text-white shadow-sm bg-primary-600 hover:bg-primary-700"
                >
                  {loading ? "Subiendo..." : "Subir"}
                </Button>
                {!auth.isAuthenticated && (
                  <div className="text-sm text-danger-600">Inicia sesión para subir documentos</div>
                )}
              </form>
            </div>
          </div>

          {/* Start Analysis Form - shown after successful upload */}
          {uploadedDocument && (
            <StartAnalysisForm
              preSelectedDocumentId={uploadedDocument.document_id}
              onAnalysisComplete={() => {
                // Mostrar mensaje y redirigir al dashboard
                alert('El análisis estará completado en varios minutos. Podrás verlo en tu panel de análisis.');
                window.location.href = '/dashboard';
              }}
              onAnalysisFailed={(error) => {
                console.error('Analysis failed:', error);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}