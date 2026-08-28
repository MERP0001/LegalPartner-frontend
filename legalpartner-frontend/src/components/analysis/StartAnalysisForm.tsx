"use client";
import { useState, useEffect } from 'react';
import { listDocuments, startAnalysis, getAnalysisProgress, type AnalysisProgressData } from '@/lib/api';
import { getApiErrorMessage, getErrorMessage } from '@/lib/apiError';
import { Button } from '@/components/common/Button';
import type { Document, ContractType } from '@/types';
import { FileText, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PROGRESS_POLL_INTERVAL_MS = 3000;

interface StartAnalysisFormProps {
  preSelectedDocumentId?: string;
  onAnalysisComplete?: (analysisId: string) => void;
  onAnalysisFailed?: (error: string) => void;
}

export default function StartAnalysisForm({
  preSelectedDocumentId,
  onAnalysisComplete,
  onAnalysisFailed,
}: StartAnalysisFormProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(preSelectedDocumentId || '');
  const [contractType, setContractType] = useState<ContractType | ''>('');
  const [loading, setLoading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgressData | null>(null);

  // Sondear el progreso de la tarea Celery hasta que termine
  useEffect(() => {
    if (!currentTaskId || !currentAnalysisId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      try {
        const res = await getAnalysisProgress(currentTaskId);
        if (cancelled) return;
        if (res.success && res.data) {
          setProgress(res.data);
          if (res.data.state === 'SUCCESS') {
            onAnalysisComplete?.(res.data.result?.analysis_id || currentAnalysisId);
            return;
          }
          if (res.data.state === 'FAILURE') {
            setError(res.data.description || 'El análisis falló');
            onAnalysisFailed?.(res.data.description || 'El análisis falló');
            return;
          }
        }
      } catch {
        // Error transitorio: se reintenta en el siguiente tick
      }
      timer = setTimeout(poll, PROGRESS_POLL_INTERVAL_MS);
    };
    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // Los callbacks se leen en cada tick; no relanzar el sondeo si el padre los recrea
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTaskId, currentAnalysisId]);

  // Load documents on mount
  useEffect(() => {
    const loadDocs = async () => {
      try {
        setLoadingDocs(true);
        // El filtro del backend se llama "status" (DocumentFilter), no document_status
        const res = await listDocuments({ status: 'processed' });
        if (res.success && res.data) {
          setDocuments(res.data || []);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.error('Error loading documents:', err);
        setDocuments([]);
      } finally {
        setLoadingDocs(false);
      }
    };
    loadDocs();
  }, []);

  // Set pre-selected document
  useEffect(() => {
    if (preSelectedDocumentId) {
      setSelectedDocumentId(preSelectedDocumentId);
    }
  }, [preSelectedDocumentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDocumentId) {
      setError('Por favor selecciona un documento');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setProgress(null);
    setCurrentAnalysisId(null);
    setCurrentTaskId(null);
    setLoading(true);

    try {
      const res = await startAnalysis(
        selectedDocumentId,
        contractType || undefined
      );

      if (res.success && res.data?.analysis_id) {
        setCurrentAnalysisId(res.data.analysis_id);
        if (res.data.task_id) {
          setCurrentTaskId(res.data.task_id);
        }
        setLoading(false);
      } else {
        setError(getErrorMessage(res, 'No se pudo iniciar el análisis'));
        setLoading(false);
      }
    } catch (err) {
      // Incluye los 403 de límite mensual, que el usuario debe ver tal cual.
      setError(getApiErrorMessage(err, 'Error al conectar con el servidor'));
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Iniciar Análisis de Contrato</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Selector */}
        <div>
          <label htmlFor="document" className="block mb-1 text-sm font-medium text-gray-700">
            Documento a analizar
          </label>
          {loadingDocs ? (
            <div className="flex items-center gap-2 py-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando documentos...
            </div>
          ) : documents.length === 0 ? (
            <div className="py-2 text-sm text-gray-500">
              No hay documentos procesados disponibles
            </div>
          ) : (
            <select
              id="document"
              value={selectedDocumentId}
              onChange={(e) => setSelectedDocumentId(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">Selecciona un documento</option>
              {documents.map((doc) => (
                <option key={doc.document_id} value={doc.document_id}>
                  {doc.original_filename} ({doc.contract_type_display || 'Sin tipo'})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Contract Type Selector */}
        <div>
          <label htmlFor="contractType" className="block mb-1 text-sm font-medium text-gray-700">
            Tipo de contrato
          </label>
          <select
            id="contractType"
            value={contractType}
            onChange={(e) => setContractType(e.target.value as ContractType | '')}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">General</option>
            <option value="rent">Arrendamiento</option>
            <option value="mortgage">Hipoteca</option>
            <option value="services">Servicios</option>
            <option value="employment">Empleo</option>
            <option value="transfers">Transferencias</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 border border-red-200 rounded-lg bg-red-50">
            <XCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message with Analysis Details */}
        {currentAnalysisId && !error && (
          <div className="p-4 border border-green-300 rounded-lg bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">✓ Análisis iniciado correctamente</p>
                <p className="text-sm text-green-800 mt-2">
                  <strong>ID del Análisis:</strong> {currentAnalysisId}
                </p>
                {currentTaskId && (
                  <p className="text-sm text-green-800">
                    <strong>ID de Tarea:</strong> {currentTaskId}
                  </p>
                )}
                <p className="text-xs text-green-700 mt-2">
                  El análisis se está procesando. Esto puede tardar entre 1-5 minutos.
                </p>
                {progress && (
                  <div className="mt-3 space-y-1" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.progress}>
                    <div className="flex items-center justify-between text-xs text-green-800">
                      <span>{progress.stage}{progress.description ? ` · ${progress.description}` : ''}</span>
                      <span className="font-medium">{progress.progress}%</span>
                    </div>
                    <div className="w-full h-2 overflow-hidden bg-green-200 rounded-full">
                      <div className="h-full transition-all duration-500 bg-green-600" style={{ width: `${progress.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {successMessage && !error && !currentAnalysisId && (
          <div className="flex items-center gap-2 p-3 border border-green-200 rounded-lg bg-green-50">
            <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Info Message */}
        {!loading && (
          <div className="flex items-start gap-2 p-3 border border-blue-200 rounded-lg bg-blue-50">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">El análisis puede tardar entre 1-5 minutos</p>
              <p className="mt-1 text-xs">
                El progreso se actualizará automáticamente. Puedes cerrar esta pantalla y revisar
                el estado en la sección de Análisis.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || loadingDocs || documents.length === 0 || (!!currentTaskId && !error && progress?.state !== 'SUCCESS')}
          className="w-full text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Iniciando...
            </>
          ) : (
            'Iniciar Análisis'
          )}
        </Button>

        {/* View Analysis Button (shown after completion) */}
        {currentAnalysisId && (
          <Button
            type="button"
            onClick={() => window.location.href = `/analysis/${currentAnalysisId}`}
            className="w-full text-white bg-green-600 hover:bg-green-700"
          >
            Ver Resultados del Análisis
          </Button>
        )}
      </form>
    </div>
  );
}
