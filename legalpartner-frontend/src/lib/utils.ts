import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

export function getRiskLevel(score: number): {
  level: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  color: string;
} {
  if (score <= 3) {
    return { level: 'low', label: 'Bajo', color: 'text-green-700 bg-green-100' };
  } else if (score <= 6) {
    return { level: 'medium', label: 'Medio', color: 'text-yellow-700 bg-yellow-100' };
  } else if (score <= 8) {
    return { level: 'high', label: 'Alto', color: 'text-orange-700 bg-orange-100' };
  } else {
    return { level: 'critical', label: 'Crítico', color: 'text-red-700 bg-red-100' };
  }
}

export function getFavorabilityLabel(level: string): {
  label: string;
  color: string;
} {
  const levels = {
    very_unfavorable: { label: 'Muy Desfavorable', color: 'text-red-700 bg-red-100' },
    unfavorable: { label: 'Desfavorable', color: 'text-orange-700 bg-orange-100' },
    neutral: { label: 'Neutral', color: 'text-gray-700 bg-gray-100' },
    favorable: { label: 'Favorable', color: 'text-green-700 bg-green-100' },
    very_favorable: { label: 'Muy Favorable', color: 'text-emerald-700 bg-emerald-100' },
  };
  return levels[level as keyof typeof levels] || levels.neutral;
}