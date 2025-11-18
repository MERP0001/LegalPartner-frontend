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
        if (res.success) setStats(res.data);
        else setError(res.message || "No se pudieron cargar las estadísticas");
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto mb-6">
          <div className="card-premium">
            <div className="card-premium-inner flex items-center justify-between">
              <div className="text-gray-900">
                <h2 className="text-xl font-semibold">Dashboard</h2>
                <p className="text-sm text-gray-600">Resumen de actividad y documentos</p>
              </div>
              <div>
                <Button variant="outline" onClick={() => window.location.reload()}>Refrescar</Button>
              </div>
            </div>
          </div>
        </div>

        {!auth.isAuthenticated && (
          <div className="text-danger-600 text-sm max-w-4xl mx-auto">Inicia sesión para ver el dashboard.</div>
        )}
        {loading && (
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-primary-100">
                <div className="h-4 w-24 bg-white/50 rounded mb-2" />
                <div className="h-8 w-16 bg-white/70 rounded" />
              </div>
              <div className="p-4 rounded-xl bg-secondary-100">
                <div className="h-4 w-24 bg-white/50 rounded mb-2" />
                <div className="h-8 w-16 bg-white/70 rounded" />
              </div>
              <div className="p-4 rounded-xl bg-warning-100">
                <div className="h-4 w-24 bg-white/50 rounded mb-2" />
                <div className="h-8 w-16 bg-white/70 rounded" />
              </div>
              <div className="p-4 rounded-xl bg-primary-50">
                <div className="h-4 w-24 bg-primary-200 rounded mb-2" />
                <div className="h-8 w-24 bg-primary-200 rounded" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="h-5 w-36 bg-gray-200 rounded mb-3" />
              <div className="space-y-3">
                {[0,1,2].map(i => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                      </div>
                      <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
              <div className="w-full h-5 bg-gray-200 rounded-full" />
              <div className="flex justify-between text-xs mt-2">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        )}
        {error && <div className="max-w-4xl mx-auto text-danger-600">{error}</div>}

        {stats && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card-premium">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Total Documents</div>
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.total_documents}</div>
                </div>
              </div>
              <div className="card-premium">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Processed</div>
                    <div className="w-8 h-8 rounded-lg bg-secondary-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-secondary-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{processed}</div>
                </div>
              </div>
              <div className="card-premium">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Processing</div>
                    <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-warning-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{processing}</div>
                </div>
              </div>
              <div className="card-premium">
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Storage Used</div>
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <HardDrive className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{storageUsedMb} MB</div>
                </div>
              </div>
            </div>

            <div className="panel p-4">
              <h3 className="text-gray-900 font-semibold mb-3">Recent Documents</h3>
              {stats.recent_uploads.length === 0 ? (
                <div className="text-gray-600">Sin documentos recientes.</div>
              ) : (
                <div className="space-y-3">
                  {stats.recent_uploads.map((d) => (
                    <div key={d.document_id} onClick={() => (window.location.href = `/contracts/${d.document_id}`)} className="cursor-pointer">
                      <DocumentCard doc={d} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="panel p-4">
              <h3 className="text-gray-900 font-semibold mb-2">Processing Summary</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Processed Count</div>
                  <div className="font-medium">{stats.processing_summary.processed_count}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Processing Rate</div>
                  <div className="font-medium">{stats.processing_summary.processing_rate.toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Avg OCR Confidence</div>
                  <div className="font-medium">{stats.processing_summary.avg_ocr_confidence.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Total Pages</div>
                  <div className="font-medium">{stats.processing_summary.total_pages}</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-600 mb-2">Estado de documentos</div>
                <div className="w-full h-5 bg-white/90 ring-1 ring-gray-200 rounded-full overflow-hidden flex">
                  <div className="bg-primary-400" style={{ width: `${uploaded + processing + processed + failed > 0 ? (uploaded/(uploaded+processing+processed+failed))*100 : 0}%` }} />
                  <div className="bg-warning-400" style={{ width: `${uploaded + processing + processed + failed > 0 ? (processing/(uploaded+processing+processed+failed))*100 : 0}%` }} />
                  <div className="bg-secondary-400" style={{ width: `${uploaded + processing + processed + failed > 0 ? (processed/(uploaded+processing+processed+failed))*100 : 0}%` }} />
                  <div className="bg-danger-500" style={{ width: `${uploaded + processing + processed + failed > 0 ? (failed/(uploaded+processing+processed+failed))*100 : 0}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Uploaded: {uploaded}</span>
                  <span>Processing: {processing}</span>
                  <span>Processed: {processed}</span>
                  <span>Failed: {failed}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}