import { LayoutDashboard, FileText, BarChart3, UploadCloud, type LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Entradas de navegación principal (sidebar de escritorio y menú móvil). */
export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/contracts', label: 'Contratos', icon: FileText },
  { href: '/analysis', label: 'Análisis', icon: BarChart3 },
  { href: '/upload', label: 'Subir', icon: UploadCloud },
];
