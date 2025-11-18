"use client";
import { useEffect, useState } from "react";
import { listAnalyses } from "@/lib/api";
import type { ContractAnalysis } from "@/types";
import Protected from "@/components/layout/Protected";

function statusColor(s: string) {
  if (s === 'processed') return 'bg-secondary-100 text-secondary-700';
  if (s === 'processing' || s === 'queued') return 'bg-warning-100 text-warning-700';
  if (s === 'failed') return 'bg-danger-100 text-danger-700';
  return 'bg-gray-100 text-gray-700';
}

export default function AnalysisPage() {
  const [items, setItems] = useState<ContractAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await listAnalyses();
        if (res.success) setItems(res.data);
        else setError(res.message || 'No se pudieron cargar los análisis');
      } catch {
        setError('Error al cargar análisis');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <Protected />
      <div className="h-2 bg-primary-600" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card-premium">
          <div className="card-premium-inner">
            <h2 className="text-lg font-semibold text-gray-900">Contract Analysis</h2>
            <p className="text-sm text-gray-600">Resultados y estado de tus análisis</p>
          </div>
        </div>
        <div className="panel p-4 mt-4">
          {loading && (
            <div className="space-y-3 animate-pulse">
              {[0,1,2,3].map(i => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-gray-200 rounded" />
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                    </div>
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && <div className="text-danger-600">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="text-gray-600">No hay análisis aún.</div>
          )}
          <div className="space-y-3">
            {items.map((a) => (
              <div key={a.analysis_id} className="group card-premium cursor-pointer" onClick={() => (window.location.href = `/analysis/${a.analysis_id}`)}>
                <div className="card-premium-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{a.document_filename || (typeof a.document !== 'string' ? a.document.original_filename : a.document)}</div>
                      <div className="text-sm text-gray-600">Riesgo: {a.risk_score ?? '-'} · Cláusulas: {a.total_clauses ?? '-'}</div>
                    </div>
                    <div className={`badge-soft ${statusColor(a.analysis_state)}`}>{a.analysis_state}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}