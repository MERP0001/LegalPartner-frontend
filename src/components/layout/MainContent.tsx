'use client';
import { useAuthStore } from '@/store/authStore';

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuthStore();
  const withSidebar = auth.hasHydrated && auth.isAuthenticated;
  return (
    <main className={'flex-1 ' + (withSidebar ? 'md:pl-72' : '')}>
      {children}
    </main>
  );
}
