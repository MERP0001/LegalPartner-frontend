# LegalPartner Frontend

## 📋 Descripción

Frontend de la aplicación LegalPartner - Plataforma de análisis inteligente de contratos legales con IA.

## 🚀 Stack Tecnológico

### Framework y Herramientas

- **Next.js 16** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Zustand** para manejo de estado global
- **React Hook Form + Zod** para formularios y validación
- **Axios** para cliente HTTP
- **Lucide React** para iconos
- **Class Variance Authority** para variantes de componentes

### Herramientas de Desarrollo

- **ESLint** para linting
- **Prettier** para formateo de código
- **Vitest** para tests unitarios
- **GitHub Actions** (`.github/workflows/ci.yml`) ejecuta type-check, lint, format, tests y build
- **PostCSS + Autoprefixer** para compatibilidad CSS

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js (una carpeta por ruta)
│   ├── auth/              # login, register, confirm-email/[key]
│   ├── analysis/          # lista y detalle de análisis
│   ├── contracts/         # lista y detalle de documentos
│   ├── chat/ dashboard/ upload/
│   ├── globals.css        # Tailwind + clases compartidas (.container, .card-premium, .lp-gradient-border)
│   └── layout.tsx         # Layout raíz (sidebar, cabecera móvil, chatbot flotante)
├── components/
│   ├── analysis/          # AnalysisList, StartAnalysisForm, ClauseDetailModal
│   ├── chat/              # ChatbotWidget (flotante)
│   ├── common/            # Button, Pagination, FavorabilityBadge
│   ├── dashboard/         # DashboardCharts y charts/
│   ├── documents/         # DocumentCard
│   └── layout/            # Sidebar, MobileSidebar, AuthNav, Protected, navItems
├── hooks/                 # useChatbot, useAnalysisPolling, useAnalysisStats, useLogout
├── lib/
│   ├── api/               # Cliente axios (client.ts) y llamadas por dominio:
│   │                      #   auth, documents, analysis, consultations, errors
│   ├── labels.ts          # Etiquetas de tipos de contrato, estados y favorabilidad
│   ├── favorabilityDefinitions.ts
│   └── utils.ts           # cn, formatDateTime
├── store/
│   └── authStore.ts       # Sesión (tokens JWT + usuario) persistida en localStorage
└── types/
    └── index.ts           # Tipos de los contratos de la API
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Construcción
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción

# Calidad de Código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Ejecutar ESLint con fix automático
npm run format       # Formatear código con Prettier
npm run format:check # Verificar formato
npm run type-check   # Verificar tipos TypeScript

# Tests
npm test             # Ejecutar tests (vitest)
npm run test:watch   # Tests en modo watch
```

## ⚙️ Configuración de Entorno

Copia `.env.example` a `.env.local` y configura las variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

En producción la variable es obligatoria: `next build` falla si no está definida.

## 🏃‍♂️ Inicio Rápido

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

3. **Iniciar desarrollo**

   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📋 Progreso de Desarrollo

### ✅ Fase 1 - Configuración Base (COMPLETADA)

- [x] Proyecto Next.js con TypeScript
- [x] Configuración de Tailwind CSS con paleta personalizada
- [x] Estructura de carpetas organizada
- [x] Store de Zustand configurado
- [x] Cliente Axios con interceptores
- [x] Tipos TypeScript definidos
- [x] Componente Button base
- [x] Página de inicio con diseño atractivo
- [x] Configuración de ESLint y Prettier

### 🔄 Siguientes Fases

#### Fase 2 - Sistema de Autenticación

- [ ] Páginas de login/register
- [ ] Componentes de formularios
- [ ] Hooks de autenticación
- [ ] Protección de rutas
- [ ] Manejo de tokens JWT

#### Fase 3 - Layout Principal

- [ ] Navbar responsive
- [ ] Sidebar opcional
- [ ] Footer
- [ ] Breadcrumbs
- [ ] Navegación entre páginas
