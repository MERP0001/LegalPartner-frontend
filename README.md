# LegalPartner — Frontend

Repositorio del frontend de LegalPartner, plataforma de análisis de contratos legales con IA.

| Carpeta | Contenido |
|---|---|
| [`legalpartner-frontend/`](legalpartner-frontend/README.md) | La aplicación (Next.js 16, TypeScript, Tailwind). Aquí están las instrucciones de instalación, scripts y estructura. |
| [`docs/`](docs/README.md) | Documentación. Las guías antiguas viven en `docs/legacy/` y están desactualizadas; la referencia de la API es el Swagger del backend. |
| `.github/workflows/` | CI: type-check, lint, formato, tests y build del frontend en cada push y pull request. |

## Inicio rápido

```bash
cd legalpartner-frontend
cp .env.example .env.local   # ajusta NEXT_PUBLIC_API_BASE_URL
npm install
npm run dev                  # http://localhost:3000
```

El backend (Django) se desarrolla en un repositorio aparte.
