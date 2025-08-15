# 🚀 Guía de Deployment en Vercel para Suitpax AI

Esta guía te ayudará a desplegar las aplicaciones **Suitpax AI Web** y **Dashboard** en Vercel.

## 📋 Estado Actual

✅ **Configuración completada:**
- Vercel CLI instalado y configurado
- Archivos de configuración de Vercel creados
- Variables de entorno documentadas
- Configuración de monorepo preparada

## 🏗️ Arquitectura del Proyecto

```
workspace/
├── apps/
│   ├── web/           # Aplicación principal (Puerto 3000)
│   └── dashboard/     # Dashboard de gestión (Puerto 3001)
├── packages/
│   ├── ui/           # Componentes compartidos
│   ├── utils/        # Utilidades compartidas
│   ├── domains/      # Lógica de dominio
│   └── shared/       # Tipos y hooks compartidos
└── vercel.json       # Configuración principal de Vercel
```

## 🚀 Pasos para Deployment

### 1. **Preparar el Entorno**

```bash
# Instalar Vercel CLI (ya instalado)
npm install -g vercel

# Hacer login en Vercel
vercel login
```

### 2. **Configurar Variables de Entorno**

En el dashboard de Vercel, agrega estas variables de entorno:

#### Variables Requeridas:
```env
# Base de Datos (Supabase)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_aqui

# Servicios de IA
ANTHROPIC_API_KEY=sk-ant-api03-...
ELEVENLABS_API_KEY=tu_clave_elevenlabs
MEM0_API_KEY=tu_clave_mem0

# APIs de Viajes y Finanzas
DUFFEL_API_TOKEN=duffel_live_...
GOCARDLESS_ACCESS_TOKEN=gocardless_live_...
GOCARDLESS_SECRET_ID=tu_secret_id
GOCARDLESS_SECRET_KEY=tu_secret_key

# Servicios OCR
OCR_SPACE_API_KEY=tu_clave_ocr_space

# Next.js
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu_secreto_nextauth_aqui

# Entorno
NODE_ENV=production
SKIP_TYPE_CHECK=true
```

### 3. **Deployar las Aplicaciones**

#### Opción A: Deployment desde la Consola
```bash
# Navegar al directorio raíz
cd /workspace

# Deployar aplicación web
cd apps/web
vercel

# Deployar dashboard
cd ../dashboard
vercel
```

#### Opción B: Conectar con GitHub (Recomendado)
1. Subir el código a un repositorio de GitHub
2. Conectar el repositorio en Vercel Dashboard
3. Configurar las variables de entorno
4. Vercel detectará automáticamente las configuraciones

### 4. **Configurar Dominios**

En el Dashboard de Vercel:
1. **Web App**: `https://suitpax-web.vercel.app`
2. **Dashboard**: `https://suitpax-dashboard.vercel.app`

## 🛠️ Configuraciones Específicas

### Configuración de Build

Los archivos `vercel.json` están configurados para:
- **Build Command**: Usar pnpm con filtros de workspace
- **Install Command**: pnpm install desde la raíz
- **Output Directory**: `.next`
- **Framework**: Next.js
- **Max Duration**: 30 segundos para funciones API

### Headers de Seguridad

Configurados automáticamente:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

## 🔧 Comandos Útiles de Vercel

```bash
# Ver estado del deployment
vercel ls

# Ver logs
vercel logs [deployment-url]

# Ver información del proyecto
vercel inspect [deployment-url]

# Rollback a versión anterior
vercel rollback [deployment-url]

# Configurar variables de entorno
vercel env add [name]
vercel env ls
```

## 📊 Monitoreo y Analytics

### Vercel Analytics
Las aplicaciones incluyen:
- `@vercel/analytics` - Analytics de páginas
- `@vercel/speed-insights` - Métricas de rendimiento

### Health Checks
- **Web**: `GET /api/health`
- **Dashboard**: `GET /api/health`

## 🚨 Troubleshooting

### Errores Comunes

#### 1. **Build Timeout**
```bash
# Aumentar timeout en vercel.json
"functions": {
  "app/api/**/*.ts": {
    "maxDuration": 60
  }
}
```

#### 2. **Errores de TypeScript**
```bash
# Usar variable de entorno
SKIP_TYPE_CHECK=true
```

#### 3. **Dependencias Faltantes**
```bash
# Verificar workspace dependencies
pnpm install --frozen-lockfile
```

#### 4. **Variables de Entorno**
- Verificar que todas las variables estén configuradas
- Comprobar que los valores sean correctos
- Revisar que estén disponibles en el entorno de producción

## 🎯 Próximos Pasos

### En el Dashboard de Vercel:

1. **Conectar Repositorio**
   - Ir a "New Project"
   - Conectar con GitHub/GitLab
   - Seleccionar repositorio

2. **Configurar Build Settings**
   - Framework: Next.js
   - Root Directory: `apps/web` o `apps/dashboard`
   - Build Command: `cd ../.. && pnpm run build --filter=@suitpax/web`
   - Install Command: `cd ../.. && pnpm install`

3. **Agregar Variables de Entorno**
   - Settings → Environment Variables
   - Agregar todas las variables listadas arriba

4. **Configurar Dominios**
   - Settings → Domains
   - Agregar dominios personalizados si es necesario

5. **Habilitar Analytics**
   - Analytics → Enable
   - Speed Insights → Enable

### Comandos para Ejecutar:

```bash
# 1. Hacer login en Vercel
vercel login

# 2. Deployar desde directorio web
cd apps/web
vercel --prod

# 3. Deployar desde directorio dashboard
cd ../dashboard
vercel --prod

# 4. Verificar deployments
vercel ls
```

## 📋 Checklist de Deployment

- [ ] Vercel CLI instalado y configurado
- [ ] Variables de entorno configuradas
- [ ] Repositorio conectado (opcional)
- [ ] Build exitoso en local
- [ ] Deployment realizado
- [ ] Health checks funcionando
- [ ] Dominios configurados
- [ ] Analytics habilitados
- [ ] SSL/HTTPS activo

## 🔗 Enlaces Útiles

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Documentación de Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Guía de Monorepos en Vercel](https://vercel.com/docs/concepts/monorepos)

---

**Última Actualización**: Enero 2025
**Estado**: ✅ Listo para Deployment