import { Document } from '@/types';
import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { getContractTypeLabel } from '@/lib/labels';

function badgeColor(type?: string) {
  switch (type) {
    case 'rent':
      return 'bg-primary-100 text-primary-700';
    case 'employment':
      return 'bg-primary-100 text-primary-700';
    case 'services':
      return 'bg-warning-100 text-warning-700';
    case 'mortgage':
      return 'bg-danger-100 text-danger-700';
    case 'transfers':
      return 'bg-primary-100 text-primary-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - d);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days >= 1) return `Hace ${days} día${days > 1 ? 's' : ''}`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours >= 1) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `Hace ${minutes} min`;
}

function statusBadge(status: string) {
  if (status === 'processed')
    return { class: 'bg-primary-100 text-primary-700', icon: CheckCircle2 };
  if (status === 'processing')
    return { class: 'bg-warning-100 text-warning-700', icon: Clock };
  if (status === 'failed')
    return { class: 'bg-danger-100 text-danger-700', icon: AlertTriangle };
  return { class: 'bg-primary-100 text-primary-700', icon: Clock };
}

export default function DocumentCard({ doc }: { doc: Document }) {
  const StatusIcon = statusBadge(doc.document_status).icon;
  return (
    <div className='group card-premium'>
      <div className='card-premium-inner transition transform group-hover:-translate-y-0.5 group-hover:shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shadow-sm'>
              <FileText className='w-5 h-5 text-primary-600' />
            </div>
            <div>
              <div className='font-semibold text-gray-900'>
                {doc.original_filename}
              </div>
              <div className='text-xs text-gray-600'>
                {timeAgo(doc.upload_date)} · {doc.page_count ?? '-'} pág
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className={`badge-soft ${badgeColor(doc.contract_type)}`}>
              {getContractTypeLabel(doc.contract_type, 'Contrato')}
            </div>
            <div
              className={`badge-soft flex items-center gap-1 ${statusBadge(doc.document_status).class}`}
            >
              <StatusIcon className='w-3.5 h-3.5' />
              <span>{doc.status_display || doc.document_status}</span>
            </div>
          </div>
        </div>
        <div className='mt-4 grid grid-cols-3 gap-3'>
          <div className='rounded-lg bg-gray-50 px-3 py-2'>
            <div className='text-[11px] text-gray-500'>Tipo</div>
            <div className='text-sm font-medium text-gray-900'>
              {getContractTypeLabel(doc.contract_type)}
            </div>
          </div>
          <div className='rounded-lg bg-gray-50 px-3 py-2'>
            <div className='text-[11px] text-gray-500'>Páginas</div>
            <div className='text-sm font-medium text-gray-900'>
              {doc.page_count ?? '-'}
            </div>
          </div>
          <div className='rounded-lg bg-gray-50 px-3 py-2'>
            <div className='text-[11px] text-gray-500'>Estado</div>
            <div className='text-sm font-medium text-gray-900'>
              {doc.status_display || doc.document_status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
