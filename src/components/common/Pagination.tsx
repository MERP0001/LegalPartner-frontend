import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Controles Anterior/Siguiente usados en las listas paginadas de la API. */
export default function Pagination({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label='Paginación'
      className={`flex items-center justify-between p-4 bg-white border-4 rounded-lg lp-gradient-border ${className}`}
    >
      <div className='text-sm text-gray-600'>
        Página {currentPage} de {totalPages}
      </div>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={!hasPrevious}
          className='px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm'
        >
          <ChevronLeft className='w-4 h-4' aria-hidden='true' />
          Anterior
        </button>
        <button
          type='button'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className='px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm'
        >
          Siguiente
          <ChevronRight className='w-4 h-4' aria-hidden='true' />
        </button>
      </div>
    </nav>
  );
}
