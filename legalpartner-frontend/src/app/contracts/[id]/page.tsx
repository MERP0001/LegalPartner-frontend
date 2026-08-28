"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDocument, getDocumentDownloadUrl, startAnalysis, getLatestDocumentAnalysis } from "@/lib/api";
import { getApiErrorMessage, getErrorMessage } from "@/lib/apiError";
import type { Document, ContractAnalysis } from "@/types";
import { Button } from "@/components/common/Button";
import Protected from "@/components/layout/Protected";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [doc, setDoc] = useState<Document | null>(null);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocument(id);
        if (res.success && res.data) {
          setDoc(res.data);
          
          // Buscar el análisis más reciente del documento usando el endpoint específico
          // Si no hay análisis, la función devuelve success: false, lo cual es normal
          const analysisRes = await getLatestDocumentAnalysis(id);
          if (analysisRes.success && analysisRes.data) {
            setAnalysis(analysisRes.data);
          } else {
            setAnalysis(null);
          }
        } else {
          setError(getErrorMessage(res, 'Error al cargar documento'));
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'Error al cargar documento'));
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const onAnalyze = async () => {
    setActionMsg(null);
    setIsAnalyzing(true);
    try {
      const res = await startAnalysis(id, doc?.contract_type || undefined);
      if (res?.success && res.data?.analysis_id) {
        setActionMsg(res.message || "Análisis iniciado");
        // El detalle del análisis sondea el progreso hasta que termine
        router.push(`/analysis/${res.data.analysis_id}`);
      } else {
        setActionMsg(getErrorMessage(res, "No se pudo iniciar el análisis"));
      }
    } catch (err) {
      // Incluye los 403 de límite mensual, que el usuario debe ver tal cual.
      setActionMsg(getApiErrorMessage(err, "Error al iniciar análisis"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return <><Protected /><div className="p-6">Cargando...</div></>;
  if (error) return <><Protected /><div className="p-6 text-danger-600">{error}</div></>;
  if (!doc) return <><Protected /><div className="p-6">Documento no encontrado</div></>;

  const downloadUrl = getDocumentDownloadUrl(doc.document_id);
  const isAnalyzed = analysis !== null;
  const analysisStatus = analysis?.analysis_state;

  return (
    <div className="min-h-screen">
      <Protected />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="card-premium">
          <div className="card-premium-inner">
            <h2 className="text-lg font-semibold text-gray-900">Detalle de Contrato</h2>
            <p className="text-sm text-gray-600">Información del documento y acciones</p>
          </div>
        </div>
        <div className="p-6 mt-4 space-y-4 panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold text-gray-900">{doc.original_filename}</div>
              <div className="text-sm text-gray-600">Tipo: {doc.contract_type || 'N/A'}</div>
            </div>
            {/* <a href={downloadUrl} className="text-primary-600" target="_blank" rel="noreferrer">Descargar</a> */}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded bg-white/90 ring-1 ring-gray-100/60">
              <div className="text-sm text-gray-600">Estado</div>
              <div className="font-medium">{doc.status_display || doc.document_status}</div>
            </div>
            <div className="p-4 rounded bg-white/90 ring-1 ring-gray-100/60">
              <div className="text-sm text-gray-600">Páginas</div>
              <div className="font-medium">{doc.page_count ?? '-'}</div>
            </div>
          </div>
          
          {/* Texto Extraído */}
          {doc.extracted_text && (
            <div className="p-4 border-l-4 rounded bg-white/90 ring-1 ring-gray-100/60 border-l-primary-600">
              <div className="mb-2 text-sm font-medium text-gray-700">Contenido del Documento</div>
              <div className="p-3 overflow-y-auto text-sm text-gray-800 whitespace-pre-wrap rounded max-h-96 bg-gray-50">
                {doc.extracted_text}
              </div>
            </div>
          )}
          
          {/* Estado del Análisis */}
          {isAnalyzed && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-blue-900">Estado del Análisis</div>
                  <div className="text-sm text-blue-700">
                    {analysisStatus === 'completed' || analysisStatus === 'processed' ? 'Completado' :
                     analysisStatus === 'processing' ? 'Procesando...' :
                     analysisStatus === 'queued' ? 'En cola' :
                     analysisStatus === 'failed' ? 'Fallido' : analysisStatus}
                  </div>
                </div>
                {(analysisStatus === 'completed' || analysisStatus === 'processed') && analysis?.analysis_id && (
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/analysis/${analysis.analysis_id}`)}
                  >
                    Ver Análisis
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {actionMsg && <div className={`text-sm ${actionMsg.includes('iniciado') ? 'text-secondary-700' : 'text-danger-600'}`}>{actionMsg}</div>}
          <div className="flex gap-3">
            <Button 
              className="text-white bg-primary-600 hover:bg-primary-700" 
              onClick={onAnalyze}
              disabled={isAnalyzing || analysisStatus === 'processing' || analysisStatus === 'queued'}
            >
              {isAnalyzing ? 'Iniciando...' : isAnalyzed ? 'Re-analizar' : 'Analizar'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/contracts')}>Volver</Button>
          </div>
        </div>
      </div>
    </div>
  );
}