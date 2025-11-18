"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAnalysis, reanalyzeAnalysis } from "@/lib/api";
import type { ContractAnalysis } from "@/types";
import { Button } from "@/components/common/Button";

export default function AnalysisDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [data, setData] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [showRisks, setShowRisks] = useState(false);

  const levelColor = (lvl: string) => {
    if (lvl === 'very_unfavorable' || lvl === 'unfavorable') return 'bg-danger-100 text-danger-700';
    if (lvl === 'neutral') return 'bg-warning-100 text-warning-700';
    if (lvl === 'favorable' || lvl === 'very_favorable') return 'bg-secondary-100 text-secondary-700';
    return 'bg-gray-100 text-gray-700';
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalysis(id);
        if (res.success) setData(res.data);
        else setError(res.message || "No se pudo cargar el análisis");
      } catch {
        setError("Error al cargar análisis");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const onReanalyze = async () => {
    setMsg(null);
    try {
      const res = await reanalyzeAnalysis(id);
      if (res.success) setMsg(res.message || "Re-análisis iniciado");
      else setMsg(res.error || "No se pudo iniciar el re-análisis");
    } catch {
      setMsg("Error al iniciar re-análisis");
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-danger-600">{error}</div>;
  if (!data) return <div className="p-6">Análisis no encontrado</div>;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card-premium">
          <div className="card-premium-inner">
            <h2 className="text-lg font-semibold text-gray-900">Detalle de Análisis</h2>
            <p className="text-sm text-gray-600">Resultados y recomendaciones del análisis</p>
          </div>
        </div>
        <div className="panel p-6 space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold text-gray-900">{data.document_filename || (typeof data.document !== 'string' ? data.document.original_filename : data.document)}</div>
              <div className="text-sm text-gray-600">Estado: {data.analysis_state}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                const docId = data.document_id || (typeof data.document !== 'string' ? data.document.document_id : String(data.document));
                if (docId) window.location.href = `/contracts/${docId}`;
              }}>Ver contrato</Button>
              <Button variant="outline" onClick={() => {
                const w = window.open('', '_blank');
                if (!w) return;
                const title = data.document_filename || (typeof data.document !== 'string' ? data.document.original_filename : 'Contrato');
                const clausesHtml = (data.clauses || []).map(c => {
                  const fav = c.analysis ? `${c.analysis.favorability_rate.toFixed(1)}%` : '-';
                  const lvl = c.analysis ? c.analysis.favorability_level : '';
                  const conf = c.analysis ? c.analysis.confidence_score.toFixed(2) : '';
                  const risks = c.analysis ? c.analysis.risk_factors.slice(0, 4).map(r => `<li>${r}</li>`).join('') : '';
                  const recs = c.analysis ? c.analysis.recommendations.slice(0, 3).map(r => `<li>${r}</li>`).join('') : '';
                  const txt = (c.text_preview && c.text_preview.length > 0 ? c.text_preview : c.clause_text);
                  return `
                    <section style="margin-bottom:16px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="font-size:12px;color:#6b7280;">${c.clause_type}</div>
                        <div style="font-size:12px;color:#374151;">${lvl}</div>
                      </div>
                      <div style="margin-top:6px;color:#111827;">${txt}</div>
                      ${c.analysis ? `
                        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:10px;">
                          <div style="background:#f9fafb;padding:8px;border-radius:6px;">
                            <div style="font-size:12px;color:#6b7280;">Outcome</div>
                            <div style="font-weight:500;">${c.analysis.outcome}</div>
                          </div>
                          <div style="background:#f9fafb;padding:8px;border-radius:6px;">
                            <div style="font-size:12px;color:#6b7280;">Favorabilidad</div>
                            <div style="font-weight:500;">${fav}</div>
                          </div>
                          <div style="background:#f9fafb;padding:8px;border-radius:6px;">
                            <div style="font-size:12px;color:#6b7280;">Confianza</div>
                            <div style="font-weight:500;">${conf}</div>
                          </div>
                        </div>
                        ${risks ? `<div style="margin-top:8px;"><div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Riesgos</div><ul style="padding-left:18px;color:#1f2937;font-size:12px;">${risks}</ul></div>` : ''}
                        ${recs ? `<div style="margin-top:8px;"><div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Recomendaciones</div><ul style="padding-left:18px;color:#1f2937;font-size:12px;">${recs}</ul></div>` : ''}
                      ` : ''}
                    </section>
                  `;
                }).join('');
                const html = `
                  <html>
                  <head>
                    <meta charset="utf-8" />
                    <title>Analysis Report - ${title}</title>
                    <style>
                      body { font-family: Arial, sans-serif; padding: 24px; }
                      h1 { color: #111827; }
                      .meta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; margin-top: 12px; }
                      .card { background: #f9fafb; padding: 8px; border-radius: 6px; }
                      .label { font-size: 12px; color: #6b7280; }
                      .value { font-weight: 500; }
                      .section-title { margin-top: 18px; color: #111827; }
                      .section { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
                    </style>
                  </head>
                  <body>
                    <h1>Análisis de Contrato</h1>
                    <div class="meta">
                      <div class="card"><div class="label">Alto Riesgo</div><div class="value">${data.high_risk_clauses_count ?? '-'}</div></div>
                      <div class="card"><div class="label">Favorabilidad Promedio</div><div class="value">${typeof data.average_favorability === 'number' ? `${data.average_favorability.toFixed(1)}%` : '-'}</div></div>
                      <div class="card"><div class="label">Cláusulas</div><div class="value">${data.total_clauses ?? '-'}</div></div>
                    </div>
                    <h2 class="section-title">Resumen General</h2>
                    <div class="section">
                      ${data.analysis_summary ? `<div><strong>Resumen:</strong><div style="margin-top:6px;">${data.analysis_summary}</div></div>` : ''}
                      ${data.general_analysis ? `<div style="margin-top:10px;"><strong>Análisis general:</strong><div style="margin-top:6px;">${data.general_analysis}</div></div>` : ''}
                    </div>
                    <h2 style="margin-top:18px;color:#111827;">Cláusulas</h2>
                    ${clausesHtml}
                  </body>
                  </html>
                `;
                w.document.open();
                w.document.write(html);
                w.document.close();
                w.focus();
                w.print();
              }}>Exportar PDF</Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Alto Riesgo</div>
                <div className="font-medium">{data.high_risk_clauses_count ?? '-'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Favorabilidad Promedio</div>
                <div className="font-medium">{typeof data.average_favorability === 'number' ? `${data.average_favorability.toFixed(1)}%` : '-'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Cláusulas</div>
                <div className="font-medium">{data.total_clauses ?? '-'}</div>
              </div>
          </div>
          {(data.analysis_summary || data.general_analysis) && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-gray-900 font-semibold mb-2">Resumen General</h3>
              {data.analysis_summary && (
                <div className="mb-3">
                  <div className="text-sm text-gray-600">Resumen</div>
                  <div className="text-gray-900">{data.analysis_summary}</div>
                </div>
              )}
              {data.general_analysis && (
                <div>
                  <div className="text-sm text-gray-600">Análisis general</div>
                  <div className="text-gray-900 whitespace-pre-line">{data.general_analysis}</div>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 font-semibold">Cláusulas</h3>
            <Button variant="outline" onClick={() => setShowRisks((v) => !v)}>{showRisks ? 'Ver todas' : 'Ver riesgos'}</Button>
          </div>
          <div className="space-y-3">
            {(data.clauses || [])
              .filter((c) => c.analysis ? (showRisks ? (c.analysis.favorability_level === 'unfavorable' || c.analysis.favorability_level === 'very_unfavorable') : true) : !showRisks)
              .map((c) => (
                <div key={c.clause_id} className={`border rounded-lg p-4 ${c.analysis ? (c.analysis.favorability_level === 'unfavorable' || c.analysis.favorability_level === 'very_unfavorable' ? 'border-danger-200' : c.analysis.favorability_level === 'neutral' ? 'border-warning-200' : 'border-secondary-200') : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">{c.clause_type}</div>
                    {c.analysis && (
                      <div className={`px-2 py-1 rounded text-xs ${levelColor(c.analysis.favorability_level)}`}>{c.analysis.favorability_level.replace('_', ' ')}</div>
                    )}
                  </div>
                  <div className="text-gray-900 mb-2">
                    {(c.text_preview && c.text_preview.length > 0 ? c.text_preview : c.clause_text).slice(0, 260)}{(c.text_preview || c.clause_text).length > 260 ? '…' : ''}
                  </div>
                  {c.analysis ? (
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Outcome</div>
                        <div className="font-medium">{c.analysis.outcome}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Favorabilidad</div>
                        <div className="font-medium">{c.analysis.favorability_rate.toFixed(1)}%</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Confianza</div>
                        <div className="font-medium">{c.analysis.confidence_score.toFixed(2)}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">Sin análisis para esta cláusula</div>
                  )}
                  {c.analysis && c.analysis.risk_factors.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-1">Riesgos</div>
                      <div className="flex flex-wrap gap-2">
                        {c.analysis.risk_factors.slice(0, 4).map((r, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded bg-danger-50 text-danger-700 border border-danger-200">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {c.analysis && c.analysis.recommendations.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-1">Recomendaciones</div>
                      <ul className="list-disc list-inside text-sm text-gray-800">
                        {c.analysis.recommendations.slice(0, 3).map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {c.analysis && c.analysis.related_articles.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-1">Artículos Relacionados</div>
                      <div className="text-sm text-gray-800">
                        {c.analysis.related_articles.slice(0, 3).map((a, idx) => (
                          <span key={idx} className="mr-3">{a.law_name} · {a.article_reference}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          {msg && <div className={`text-sm ${msg.includes('iniciado') ? 'text-secondary-700' : 'text-danger-600'}`}>{msg}</div>}
          <div className="flex gap-3">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white" onClick={onReanalyze}>Re-analizar</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/analysis')}>Volver</Button>
          </div>
        </div>
      </div>
    </div>
  );
}