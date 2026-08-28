import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

/** Cierra la sesión y vuelve a la portada. */
export function useLogout() {
  const logout = useAuthStore(s => s.logout);
  const router = useRouter();
  return useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);
}
