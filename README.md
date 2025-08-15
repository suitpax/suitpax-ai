# 🚀 Suitpax AI - Business Travel Platform

> **Plataforma inteligente de viajes de negocio con IA integrada**

## 📋 Estructura del Proyecto

```
suitpax-ai/
├── apps/
│   ├── web/                    # App principal (Puerto 3000)
│   │   ├── app/               # App Router de Next.js
│   │   ├── components/        # Componentes específicos de web
│   │   └── public/           # Assets estáticos
│   └── dashboard/             # Dashboard de gestión (Puerto 3001)
│       ├── app/              # App Router de Next.js
│       ├── components/       # Componentes específicos del dashboard
│       └── public/          # Assets estáticos
├── packages/
│   ├── ui/                   # Componentes UI compartidos
│   │   ├── components/      # Todos los componentes UI
│   │   ├── hooks/          # Hooks compartidos
│   │   └── contexts/       # Contextos React
│   ├── shared/              # Tipos y utilidades compartidas
│   │   ├── types/          # Definiciones de tipos
│   │   ├── hooks/          # Hooks compartidos
│   │   └── contexts/       # Contextos globales
│   ├── utils/              # Funciones de utilidad
│   │   └── lib/           # Utilidades y helpers
│   └── domains/            # Lógica de dominio
│       ├── types/         # Tipos de dominio
│       └── stores/        # Estado de la aplicación
└── tailwind.config.ts     # Configuración de Tailwind
```

## 🎯 Características Principales

- **🤖 IA Integrada**: Claude, ElevenLabs, MEM0
- **✈️ Gestión de Viajes**: Duffel API, reservas automáticas
- **💰 Gestión Financiera**: GoCardless, análisis de gastos
- **📊 Dashboard Analítico**: Métricas y reportes en tiempo real
- **🔐 Autenticación**: Supabase Auth
- **🎨 UI Moderna**: Tailwind CSS + shadcn/ui
- **📱 Responsive**: Optimizado para móvil y desktop

## 🚀 Desarrollo Rápido

### Prerrequisitos
```bash
Node.js >= 20.0.0
pnpm >= 8.0.0
```

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd suitpax-ai

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves API
```

### Comandos de Desarrollo

```bash
# Desarrollo - ambas apps
pnpm dev

# Desarrollo individual
pnpm dev:web        # Puerto 3000
pnpm dev:dashboard  # Puerto 3001

# Builds
pnpm build          # Build completo
pnpm build:web      # Solo web app
pnpm build:dashboard # Solo dashboard

# Producción
pnpm start          # Ambas apps
pnpm start:web      # Solo web
pnpm start:dashboard # Solo dashboard
```

## 🔧 Configuración de Variables de Entorno

```env
# Database (Supabase)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anon
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# AI Services
ANTHROPIC_API_KEY=sk-ant-api03-...
ELEVENLABS_API_KEY=tu_clave_elevenlabs
MEM0_API_KEY=tu_clave_mem0

# Travel APIs
DUFFEL_API_TOKEN=duffel_live_...

# Finance APIs
GOCARDLESS_ACCESS_TOKEN=gocardless_live_...
GOCARDLESS_SECRET_ID=tu_secret_id
GOCARDLESS_SECRET_KEY=tu_secret_key

# OCR Services
OCR_SPACE_API_KEY=tu_clave_ocr_space
```

## 📦 Packages

### `ui` - Sistema de Diseño
- Componentes reutilizables
- Hooks personalizados
- Contextos React
- Basado en shadcn/ui + Tailwind

### `shared` - Compartido
- Tipos TypeScript
- Hooks globales  
- Contextos de aplicación
- Configuraciones

### `utils` - Utilidades
- Funciones helper
- Formatters
- Validadores
- Constantes

### `domains` - Lógica de Negocio
- Tipos de dominio
- Estado de aplicación (Zustand)
- Validaciones de negocio

## 🌐 Deployment en Vercel

### Configuración Automática
1. Conecta el repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Configuración Manual
```bash
# Login en Vercel
vercel login

# Deploy web app
cd apps/web
vercel --prod

# Deploy dashboard
cd ../dashboard  
vercel --prod
```

## 🎨 Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand
- **Database**: Supabase
- **AI**: Anthropic Claude, ElevenLabs, MEM0
- **Travel**: Duffel API
- **Finance**: GoCardless
- **OCR**: OCR.space
- **Deployment**: Vercel
- **Package Manager**: pnpm
- **TypeScript**: Full type safety

## 📈 Arquitectura

### Monorepo Simple
- Sin Turborepo (eliminado por simplicidad)
- Workspace con pnpm
- Dependencias compartidas
- Build optimizado

### App Router
- Next.js 15 App Router
- Server Components
- Streaming UI
- Optimized for performance

### Type Safety
- TypeScript estricto
- Tipos compartidos
- Validación con Zod
- IntelliSense completo

## 🔗 URLs de Desarrollo

- **Web App**: http://localhost:3000
- **Dashboard**: http://localhost:3001

## 🔗 URLs de Producción

- **Web App**: https://suitpax-web.vercel.app
- **Dashboard**: https://suitpax-dashboard.vercel.app

## 📄 Documentación Adicional

- [Guía de Deployment](./VERCEL_DEPLOYMENT.md)
- [Configuración de Variables](./DEPLOYMENT.md)

---

**Hecho con ❤️ para revolucionar los viajes de negocio**
