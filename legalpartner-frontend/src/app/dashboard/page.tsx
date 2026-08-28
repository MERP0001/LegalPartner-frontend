"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStats } from "@/lib/api";
import { getApiErrorMessage, getErrorMessage } from "@/lib/apiError";
import type { DocumentStats } from "@/types";
import DocumentCard from "@/components/documents/DocumentCard";
import { FileText, Settings, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/store/authStore";
import Protected from "@/components/layout/Protected";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"documents" | "analytics">("documents");
  const auth = useAuthStore();
  const router = useRouter();

  const fetchStats = useCallback(async () => {
      if (!auth.hasHydrated) return;
      if (!auth.isAuthenticated) { setLoading(false); return; }
      setLoading(true);
      setError(null);
      try {
        const res = await getStats();
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setError(getErrorMessage(res, "No se pudieron cargar las estadísticas"));
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Error al cargar estadísticas"));
      } finally {
        setLoading(false);
      }
  }, [auth.hasHydrated, auth.isAuthenticated]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const processed = stats?.documents_by_status?.processed || stats?.documents_by_status?.PROCESSED || 0;
  const processing = stats?.documents_by_status?.processing || stats?.documents_by_status?.PROCESSING || 0;

  return (
    <div className="min-h-screen">
      <Protected />
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto mb-6 max-w-7xl">
          <div className="card-premium">
            <div className="flex items-center justify-between card-premium-inner">
              <div className="text-gray-900">
                <h2 className="text-xl font-semibold">Panel de Resumen</h2>
                <p className="text-sm text-gray-600">Resumen de actividad y documentos</p>
              </div>
              <div>
                <Button variant="outline" onClick={fetchStats} disabled={loading}>Refrescar</Button>
              </div>
            </div>
          </div>
        </div>

        {auth.hasHydrated && !auth.isAuthenticated && (
          <div className="mx-auto text-sm max-w-7xl text-danger-600">Inicia sesión para ver el dashboard.</div>
        )}
        {loading && (
          <div className="mx-auto space-y-8 max-w-7xl animate-pulse">
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
        {error && <div className="mx-auto max-w-7xl text-danger-600">{error}</div>}

        {stats && (
          <div className="mx-auto space-y-8 max-w-7xl">
            <div className="grid gap-4 md:grid-cols-3 justify-items-center">
              <div className="w-full transition-all duration-300 ease-in-out transform border-2 card-premium border-primary-600 hover:scale-105 hover:shadow-xl">
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
              <div className="w-full transition-all duration-300 ease-in-out transform border-2 card-premium border-danger-500 hover:scale-105 hover:shadow-xl">
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
              <div className="w-full transition-all duration-300 ease-in-out transform border-2 card-premium border-primary-600 hover:scale-105 hover:shadow-xl">
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
              {/* <div className="transition-all duration-300 ease-in-out transform border-2 card-premium border-danger-500 hover:scale-105 hover:shadow-xl">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Almacenamiento</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50">
                      <HardDrive className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{storageUsedMb} MB</div>
                </div>
              </div> */}
            </div>

            <div className="p-4 panel">
              {/* Tabs */}
              <div className="flex gap-2 mb-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-4 py-2 font-medium text-sm transition-all ${
                    activeTab === "documents"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  📄 Documentos Recientes
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-4 py-2 font-medium text-sm transition-all ${
                    activeTab === "analytics"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  📊 Gráficas
                </button>
              </div>

              {/* Contenido del Tab - Documentos Recientes */}
              {activeTab === "documents" && (
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">Documentos Recientes</h3>
                  {stats.recent_uploads.length === 0 ? (
                    <div className="text-gray-600">Sin documentos recientes.</div>
                  ) : (
                    <div className="space-y-3">
                      {stats.recent_uploads.map((d, index) => (
                        <div 
                          key={d.document_id} 
                          onClick={() => router.push(`/contracts/${d.document_id}`)} 
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
              )}

              {/* Contenido del Tab - Gráficas */}
              {activeTab === "analytics" && (
                <div>
                  <h3 className="mb-4 font-semibold text-gray-900">Análisis Avanzados</h3>
                  <DashboardCharts />
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
            </div>

          </div>
        )}
      </div>
    </div>
  );
}