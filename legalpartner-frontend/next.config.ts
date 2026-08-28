import type { NextConfig } from 'next';

// En producción la URL del backend debe venir del entorno de build:
// un fallback silencioso a localhost dejaría la app apuntando a una API inexistente.
if (
  process.env.NODE_ENV === 'production' &&
  !process.env.NEXT_PUBLIC_API_BASE_URL
) {
  throw new Error(
    'Falta NEXT_PUBLIC_API_BASE_URL. Copia .env.example a .env.local o define la variable en el entorno de build.'
  );
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
