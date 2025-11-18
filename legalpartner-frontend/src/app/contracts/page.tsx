"use client";
import { useEffect, useState } from "react";
import { listDocuments } from "@/lib/api";
import type { Document } from "@/types";
import { useAuthStore } from "@/store/authStore";
import DocumentCard from "@/components/documents/DocumentCard";
import { Button } from "@/components/common/Button";
import Protected from "@/components/layout/Protected";

export default function ContractsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuthStore();

  useEffect(() => {
    const fetchDocs = async () => {
      if (!auth.isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const res = await listDocuments();
        if (res.success) setDocs(res.data);
        else setError(res.message || "No se pudieron cargar los documentos");
      } catch {
        setError("Error al cargar documentos");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [auth.isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Protected />
      <div className="h-2 bg-primary-600" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-primary-600 text-white rounded-t-lg px-4 py-3 w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold">Contracts</h2>
        </div>
        <div className="bg-white rounded-b-lg shadow-sm p-4 w-full max-w-2xl mx-auto">
          <h3 className="text-gray-900 font-semibold mb-3">Your contracts</h3>
          {!auth.isAuthenticated && (
            <div className="text-danger-600 text-sm mb-4">Debes iniciar sesión para ver tus contratos.</div>
          )}
          {loading && (
            <div className="space-y-3 animate-pulse">
              {[0,1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-200" />
                      <div>
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                        <div className="h-3 w-32 bg-gray-200 rounded mt-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && <div className="text-danger-600">{error}</div>}
          {!loading && !error && docs.length === 0 && (
            <div className="panel p-6 text-gray-700">
              <div className="text-lg font-semibold mb-1">No tienes contratos aún</div>
              <div className="text-sm">Sube tu primer contrato para comenzar el análisis</div>
              <div className="mt-4">
                <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm" onClick={() => (window.location.href = '/upload')}>Subir contrato</Button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {docs.map((d) => (
              <div key={d.document_id} onClick={() => (window.location.href = `/contracts/${d.document_id}`)} className="cursor-pointer">
                <DocumentCard doc={d} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}