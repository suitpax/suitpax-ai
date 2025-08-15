# 📁 Estructura del Proyecto Suitpax AI

## 🎯 Resumen Simple

Este es un **monorepo simple** con 2 aplicaciones Next.js independientes y 4 packages compartidos.

```
suitpax-ai/
├── 📱 apps/                    # Aplicaciones independientes
│   ├── 🌐 web/               # App principal (Puerto 3000)
│   └── 📊 dashboard/         # Dashboard business (Puerto 3001)
├── 📦 packages/               # Packages compartidos
│   ├── 🎨 ui/               # Componentes React
│   ├── 🔧 utils/            # Funciones útiles
│   ├── 🤝 shared/           # Tipos y contextos
│   └── 🏢 domains/          # Lógica de negocio
└── ⚙️ Configs raíz           # Configuraciones globales
```

## 📱 Aplicaciones (apps/)

### 🌐 **Web App** (`apps/web/`)
- **Puerto**: 3000
- **Propósito**: Aplicación principal, marketing, landing
- **Estructura**:
```
apps/web/
├── app/                 # App Router Next.js 15
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página home
│   ├── globals.css     # Estilos globales
│   ├── auth/           # Páginas de autenticación
│   ├── api/            # API routes
│   ├── contact/        # Página de contacto
│   ├── pricing/        # Página de precios
│   └── manifesto/      # Página del manifiesto
├── components/         # Componentes específicos de web
├── public/            # Assets estáticos
├── package.json       # Dependencias específicas
├── next.config.mjs    # Config de Next.js
├── tsconfig.json      # Config TypeScript
└── vercel.json        # Config deployment Vercel
```

### 📊 **Dashboard App** (`apps/dashboard/`)
- **Puerto**: 3001  
- **Propósito**: Dashboard de gestión de negocio
- **Estructura**:
```
apps/dashboard/
├── app/                # App Router Next.js 15
│   ├── layout.tsx     # Layout del dashboard
│   ├── page.tsx       # Dashboard principal
│   ├── loading.tsx    # Loading UI
│   ├── api/           # API routes
│   ├── flights/       # Gestión de vuelos
│   ├── expenses/      # Gestión de gastos
│   ├── analytics/     # Analytics y reportes
│   ├── suitpax-ai/    # Chat con IA
│   ├── voice-ai/      # IA por voz
│   ├── policies/      # Políticas de empresa
│   ├── team/          # Gestión de equipo
│   ├── settings/      # Configuraciones
│   └── ... más módulos
├── package.json       # Dependencias específicas
├── next.config.mjs    # Config de Next.js
├── tsconfig.json      # Config TypeScript
└── vercel.json        # Config deployment Vercel
```

## 📦 Packages Compartidos (packages/)

### 🎨 **UI Package** (`packages/ui/`)
- **Propósito**: Sistema de diseño compartido
- **Contenido**:
```
packages/ui/
├── index.ts           # Exports principales
├── components/        # Todos los componentes UI
│   ├── ui/           # Componentes básicos (Button, Input, etc.)
│   ├── marketing/    # Componentes de marketing
│   ├── dashboard/    # Componentes de dashboard
│   ├── flights/      # Componentes de vuelos
│   └── voice-ai/     # Componentes de IA por voz
├── hooks/            # Hooks React compartidos
├── contexts/         # Contextos React
└── package.json      # Dependencias UI
```

### 🔧 **Utils Package** (`packages/utils/`)
- **Propósito**: Funciones de utilidad
- **Contenido**:
```
packages/utils/
├── index.ts          # Exports principales
├── lib/              # Funciones utilitarias
└── package.json      # Dependencias utils
```

### 🤝 **Shared Package** (`packages/shared/`)
- **Propósito**: Tipos y contextos globales
- **Contenido**:
```
packages/shared/
├── index.ts          # Exports principales
├── types/            # Definiciones TypeScript
├── hooks/            # Hooks globales
├── contexts/         # Contextos globales
└── package.json      # Dependencias shared
```

### 🏢 **Domains Package** (`packages/domains/`)
- **Propósito**: Lógica de negocio
- **Contenido**:
```
packages/domains/
├── index.ts          # Exports principales
├── types/            # Tipos de dominio
├── stores/           # Estados Zustand
└── package.json      # Dependencias domains
```

## ⚙️ Archivos de Configuración Raíz

```
/ (raíz)
├── package.json              # Workspace principal + scripts
├── pnpm-workspace.yaml       # Configuración workspace
├── tsconfig.json            # TypeScript base
├── tailwind.config.ts       # Tailwind CSS global
├── .eslintrc.json           # ESLint rules
├── .env.example             # Variables de entorno ejemplo
├── vercel.json              # Config Vercel monorepo
├── README.md                # Documentación principal
├── PROJECT_STRUCTURE.md     # Este archivo
└── VERCEL_DEPLOYMENT.md     # Guía de deployment
```

## 🔄 Cómo Funcionan las Dependencias

### En las Apps:
```json
{
  "dependencies": {
    "ui": "workspace:*",        // Importa todos los componentes
    "shared": "workspace:*",    // Importa tipos y contextos
    "utils": "workspace:*",     // Importa funciones útiles
    "domains": "workspace:*",   // Importa lógica de negocio
    "next": "15.2.4",          // Next.js específico
    "react": "19.0.0"          // React específico
  }
}
```

### Importaciones en el Código:
```typescript
// En cualquier app:
import { Button } from 'ui';              // Desde ui package
import { UserType } from 'shared';        // Desde shared package  
import { formatDate } from 'utils';       // Desde utils package
import { useUserStore } from 'domains';   // Desde domains package
```

## 🚀 Comandos de Desarrollo

### Desarrollo Individual:
```bash
# Solo web app (puerto 3000)
cd apps/web
pnpm dev

# Solo dashboard (puerto 3001)  
cd apps/dashboard
pnpm dev
```

### Desarrollo desde la Raíz:
```bash
# Ambas apps a la vez
pnpm dev

# Apps individuales
pnpm dev:web        # Solo web
pnpm dev:dashboard  # Solo dashboard

# Builds
pnpm build         # Todo
pnpm build:web     # Solo web
pnpm build:dashboard # Solo dashboard
```

## ✅ Ventajas de Esta Estructura

1. **🔄 Independencia**: Cada app puede desarrollarse por separado
2. **📦 Reutilización**: Packages compartidos evitan duplicación
3. **🚀 Simplicidad**: Sin Turborepo, fácil de entender
4. **⚡ Rapidez**: Builds y desarrollo más rápidos
5. **🔧 Flexibilidad**: Fácil agregar nuevas apps o packages
6. **📱 Escalabilidad**: Cada app se puede deployar independientemente

## 🎯 Flujo de Trabajo Típico

1. **Trabajar en componentes** → Editar `packages/ui/`
2. **Agregar tipos** → Editar `packages/shared/`
3. **Crear utilidades** → Editar `packages/utils/`
4. **Lógica de negocio** → Editar `packages/domains/`
5. **Páginas web** → Editar `apps/web/app/`
6. **Dashboard** → Editar `apps/dashboard/app/`

¡La estructura está diseñada para ser **simple, clara y fácil de trabajar**! 🎉