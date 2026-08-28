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
- **PostCSS + Autoprefixer** para compatibilidad CSS

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales con Tailwind
│   ├── layout.tsx         # Layout raíz
│   └── page.tsx           # Página de inicio
├── components/
│   ├── layout/            # Componentes de layout (Navbar, Footer)
│   ├── common/            # Componentes reutilizables (Button, Card, etc.)
│   └── auth/              # Componentes de autenticación
├── lib/
│   ├── api.ts             # Cliente Axios configurado
│   └── utils.ts           # Utilidades y helpers
├── store/
│   └── authStore.ts       # Store de Zustand para auth
├── types/
│   └── index.ts           # Tipos TypeScript globales
└── hooks/                 # Hooks personalizados
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
