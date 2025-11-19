"use client";
import { useEffect, useState } from "react";
import { getStats } from "@/lib/api";
import type { DocumentStats } from "@/types";
import DocumentCard from "@/components/documents/DocumentCard";
import { FileText, Settings, CheckCircle2, HardDrive } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/store/authStore";
import Protected from "@/components/layout/Protected";

export default function DashboardPage() {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.isAuthenticated) { setLoading(false); return; }
      try {
        const res = await getStats();
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setError(res.message || "No se pudieron cargar las estadísticas");
        }
      } catch {
        setError("Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [auth.isAuthenticated]);

  const processed = stats?.documents_by_status?.processed || stats?.documents_by_status?.PROCESSED || 0;
  const processing = stats?.documents_by_status?.processing || stats?.documents_by_status?.PROCESSING || 0;
  const uploaded = stats?.documents_by_status?.uploaded || stats?.documents_by_status?.UPLOADED || 0;
  const failed = stats?.documents_by_status?.failed || stats?.documents_by_status?.FAILED || 0;
  const storageUsedMb = typeof (stats?.storage_usage as { used_bytes?: number })?.used_bytes === 'number'
    ? Math.round(((stats!.storage_usage as { used_bytes?: number }).used_bytes as number) / (1024 * 1024))
    : 0;

  return (
    <div className="min-h-screen">
      <Protected />
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-5xl mx-auto mb-6">
          <div className="card-premium">
            <div className="flex items-center justify-between card-premium-inner">
              <div className="text-gray-900">
                <h2 className="text-xl font-semibold">Panel de Resumen</h2>
                <p className="text-sm text-gray-600">Resumen de actividad y documentos</p>
              </div>
              <div>
                <Button variant="outline" onClick={() => window.location.reload()}>Refrescar</Button>
              </div>
            </div>
          </div>
        </div>

        {!auth.isAuthenticated && (
          <div className="max-w-4xl mx-auto text-sm text-danger-600">Inicia sesión para ver el dashboard.</div>
        )}
        {loading && (
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-xl bg-primary-100">
                <div className="w-24 h-4 mb-2 rounded bg-white/50" />
                <div className="w-16 h-8 rounded bg-white/70" />
              </div>
              <div className="p-4 rounded-xl bg-secondary-100">
                <div className="w-24 h-4 mb-2 rounded bg-white/50" />
                <div className="w-16 h-8 rounded bg-white/70" />
              </div>
              <div className="p-4 rounded-xl bg-warning-100">
                <div className="w-24 h-4 mb-2 rounded bg-white/50" />
                <div className="w-16 h-8 rounded bg-white/70" />
              </div>
              <div className="p-4 rounded-xl bg-primary-50">
                <div className="w-24 h-4 mb-2 rounded bg-primary-200" />
                <div className="w-24 h-8 rounded bg-primary-200" />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="h-5 mb-3 bg-gray-200 rounded w-36" />
              <div className="space-y-3">
                {[0,1,2].map(i => (
                  <div key={i} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="w-48 h-4 bg-gray-200 rounded" />
                        <div className="w-32 h-3 bg-gray-200 rounded" />
                      </div>
                      <div className="w-24 h-6 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="w-40 h-5 mb-2 bg-gray-200 rounded" />
              <div className="w-full h-5 bg-gray-200 rounded-full" />
              <div className="flex justify-between mt-2 text-xs">
                <div className="w-20 h-3 bg-gray-200 rounded" />
                <div className="w-20 h-3 bg-gray-200 rounded" />
                <div className="w-20 h-3 bg-gray-200 rounded" />
                <div className="w-20 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        )}
        {error && <div className="max-w-4xl mx-auto text-danger-600">{error}</div>}

        {stats && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="card-premium border-2 border-primary-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Total Documentos</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.total_documents}</div>
                </div>
              </div>
              <div className="card-premium border-2 border-danger-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Procesados</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-50">
                      <CheckCircle2 className="w-5 h-5 text-secondary-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{processed}</div>
                </div>
              </div>
              <div className="card-premium border-2 border-primary-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Procesando</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning-50">
                      <Settings className="w-5 h-5 text-warning-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{processing}</div>
                </div>
              </div>
              <div className="card-premium border-2 border-danger-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Almacenamiento</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50">
                      <HardDrive className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{storageUsedMb} MB</div>
                </div>
              </div>
            </div>

            <div className="p-4 panel">
              <h3 className="mb-3 font-semibold text-gray-900">Documentos Recientes</h3>
              {stats.recent_uploads.length === 0 ? (
                <div className="text-gray-600">Sin documentos recientes.</div>
              ) : (
                <div className="space-y-3">
                  {stats.recent_uploads.map((d, index) => (
                    <div 
                      key={d.document_id} 
                      onClick={() => (window.location.href = `/contracts/${d.document_id}`)} 
                      className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl border-2 rounded-lg p-3 ${
                        index % 2 === 0 
                          ? 'border-primary-600 hover:border-primary-700 hover:bg-primary-50' 
                          : 'border-danger-500 hover:border-danger-600 hover:bg-red-50'
                      }`}
                    >
                      <DocumentCard doc={d} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 panel">
              <h3 className="mb-2 font-semibold text-gray-900">Resumen de Procesamiento</h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="p-3 rounded bg-gray-50">
                  <div className="text-sm text-gray-600">Cant. Procesados</div>
                  <div className="font-medium">{stats.processing_summary.processed_count}</div>
                </div>
                <div className="p-3 rounded bg-gray-50">
                  <div className="text-sm text-gray-600">Tasa Procesamiento</div>
                  <div className="font-medium">{stats.processing_summary.processing_rate?.toFixed(1) ?? 'N/A'}%</div>
                </div>
                <div className="p-3 rounded bg-gray-50">
                  <div className="text-sm text-gray-600">Confianza OCR</div>
                  <div className="font-medium">{stats.processing_summary.avg_ocr_confidence?.toFixed(2) ?? 'N/A'}</div>
                </div>
                <div className="p-3 rounded bg-gray-50">
                  <div className="text-sm text-gray-600">Total Páginas</div>
                  <div className="font-medium">{stats.processing_summary.total_pages}</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 text-sm text-gray-600">Estado de documentos</div>
                <div className="flex w-full h-5 overflow-hidden rounded-full bg-white/90 ring-1 ring-gray-200">
                  <div className="bg-primary-400" style={{ width: `${uploaded + processing + processed + failed > 0 ? (uploaded/(uploaded+processing+processed+failed))*100 : 0}%` }} />
                  <div className="bg-warning-400" style={{ width: `${uploaded + processing + processed + failed > 0 ? (processing/(uploaded+processing+processed+failed))*100 : 0}%` }} />
                  <div className="bg-secondary-400" style={{ width: `${uploaded + processing + processed + failed > 0 ? (processed/(uploaded+processing+processed+failed))*100 : 0}%` }} />
                  <div className="bg-danger-500" style={{ width: `${uploaded + processing + processed + failed > 0 ? (failed/(uploaded+processing+processed+failed))*100 : 0}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Subidos: {uploaded}</span>
                  <span>Procesando: {processing}</span>
                  <span>Procesados: {processed}</span>
                  <span>Fallidos: {failed}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}