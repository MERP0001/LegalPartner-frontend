"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { listDocuments, getApiErrorMessage, getErrorMessage } from "@/lib/api";
import type { Document } from "@/types";
import { useAuthStore } from "@/store/authStore";
import DocumentCard from "@/components/documents/DocumentCard";
import { Button } from "@/components/common/Button";
import Protected from "@/components/layout/Protected";
import Pagination from "@/components/common/Pagination";

export default function ContractsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuthStore();
  const router = useRouter();
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const pageSize = 10;

  const loadDocuments = useCallback(async () => {
    if (!auth.hasHydrated) return;
    if (!auth.isAuthenticated) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, unknown> = {
        page: currentPage,
        page_size: pageSize,
      };
      
      const res = await listDocuments(params);
      
      if (res.success && res.data) {
        setDocs(res.data || []);
        setTotalCount(res.pagination?.total_count || 0);
        setHasNext(res.pagination?.has_next || false);
        setHasPrevious(res.pagination?.has_previous || false);
      } else {
        setDocs([]);
        setTotalCount(0);
        setHasNext(false);
        setHasPrevious(false);
        setError(getErrorMessage(res, "No se pudieron cargar los documentos"));
      }
    } catch (err) {
      setDocs([]);
      setTotalCount(0);
      setHasNext(false);
      setHasPrevious(false);
      setError(getApiErrorMessage(err, "Error al cargar documentos"));
    } finally {
      setLoading(false);
    }
  }, [auth.hasHydrated, auth.isAuthenticated, currentPage]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <Protected />
      <div className="h-2 bg-primary-600" />
      <div className="container px-4 py-8 mx-auto">
        <div className="w-full px-4 py-3 mx-auto text-white rounded-t-lg max-w-7xl bg-primary-600">
          <h2 className="text-lg font-semibold">Contratos</h2>
        </div>
        <div className="w-full p-4 mx-auto bg-white rounded-b-lg shadow-sm max-w-7xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Tus contratos</h3>
            {!loading && totalCount > 0 && (
              <span className="text-sm text-gray-600">
                Mostrando {docs.length} de {totalCount} contratos
              </span>
            )}
          </div>
          {auth.hasHydrated && !auth.isAuthenticated && (
            <div className="mb-4 text-sm text-danger-600">Debes iniciar sesión para ver tus contratos.</div>
          )}
          {loading && (
            <div className="space-y-3 animate-pulse">
              {[0,1,2,3].map(i => (
                <div key={i} className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 rounded-lg w-9 h-9" />
                      <div>
                        <div className="w-48 h-4 bg-gray-200 rounded" />
                        <div className="w-32 h-3 mt-2 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-6 bg-gray-200 rounded-full" />
                      <div className="w-24 h-6 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && <div className="text-danger-600">{error}</div>}
          {!loading && !error && docs.length === 0 && (
            <div className="p-6 text-gray-700 panel">
              <div className="mb-1 text-lg font-semibold">No tienes contratos aún</div>
              <div className="text-sm">Sube tu primer contrato para comenzar el análisis</div>
              <div className="mt-4">
                <Button className="text-white shadow-sm bg-primary-600 hover:bg-primary-700" onClick={() => router.push('/upload')}>Subir contrato</Button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {docs.map((d, index) => (
              <div 
                key={d.document_id} 
                onClick={() => router.push(`/contracts/${d.document_id}`)} 
                className={`cursor-pointer transition-all duration-300 ease-in-out border-2 rounded-lg p-3 transform hover:scale-105 hover:shadow-xl ${
                  index % 2 === 0 
                    ? 'border-primary-600 hover:border-primary-700 hover:bg-primary-50' 
                    : 'border-danger-500 hover:border-danger-600 hover:bg-red-50'
                }`}
              >
                <DocumentCard doc={d} />
              </div>
            ))}
          </div>
          
          {!loading && (
            <Pagination
              className="mt-4"
              currentPage={currentPage}
              totalPages={totalPages}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}