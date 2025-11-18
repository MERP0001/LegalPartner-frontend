"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDocument, getDocumentDownloadUrl, startAnalysis } from "@/lib/api";
import type { Document } from "@/types";
import { Button } from "@/components/common/Button";

export default function ContractDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocument(id);
        if (res.success) setDoc(res.data);
        else setError(res.message || "No se pudo cargar el documento");
      } catch {
        setError("Error al cargar documento");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const onAnalyze = async () => {
    setActionMsg(null);
    try {
      const res = await startAnalysis(id, doc?.contract_type || undefined);
      if (res?.success) setActionMsg(res.message || "Análisis iniciado");
      else setActionMsg(res?.error || "No se pudo iniciar el análisis");
    } catch {
      setActionMsg("Error al iniciar análisis");
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-danger-600">{error}</div>;
  if (!doc) return <div className="p-6">Documento no encontrado</div>;

  const downloadUrl = getDocumentDownloadUrl(doc.document_id);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card-premium">
          <div className="card-premium-inner">
            <h2 className="text-lg font-semibold text-gray-900">Detalle de Contrato</h2>
            <p className="text-sm text-gray-600">Información del documento y acciones</p>
          </div>
        </div>
        <div className="panel p-6 space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold text-gray-900">{doc.original_filename}</div>
              <div className="text-sm text-gray-600">Tipo: {doc.contract_type || 'N/A'}</div>
            </div>
            <a href={downloadUrl} className="text-primary-600" target="_blank" rel="noreferrer">Descargar</a>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/90 ring-1 ring-gray-100/60 rounded">
              <div className="text-sm text-gray-600">Estado</div>
              <div className="font-medium">{doc.status_display || doc.document_status}</div>
            </div>
            <div className="p-4 bg-white/90 ring-1 ring-gray-100/60 rounded">
              <div className="text-sm text-gray-600">Páginas</div>
              <div className="font-medium">{doc.page_count ?? '-'}</div>
            </div>
          </div>
          {actionMsg && <div className={`text-sm ${actionMsg.includes('iniciado') ? 'text-secondary-700' : 'text-danger-600'}`}>{actionMsg}</div>}
          <div className="flex gap-3">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white" onClick={onAnalyze}>Analizar</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/contracts')}>Volver</Button>
          </div>
        </div>
      </div>
    </div>
  );
}