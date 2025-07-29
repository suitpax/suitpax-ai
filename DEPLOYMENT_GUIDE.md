# Guía de Despliegue y Configuración de API Keys en Vercel

**Propósito:** Esta guía explica cómo configurar de forma segura tus claves de API (secrets) como variables de entorno en Vercel. Este es el método estándar y más seguro para producción, ya que evita que tus claves queden expuestas en el código fuente.

---

### **Paso 1: Reúne tus API Keys**

Antes de empezar, asegúrate de tener a mano las siguientes claves de los servicios que utiliza Suitpax. Las encontrarás en los dashboards de cada proveedor:

-   `ANTHROPIC_API_KEY` (Desde tu cuenta de Anthropic)
-   `BREVO_API_KEY` (Desde tu cuenta de Brevo, en la sección "SMTP & API")
-   `ELEVENLABS_API_KEY` (Desde tu cuenta de ElevenLabs)
-   `NEXT_PUBLIC_SUPABASE_URL` (Desde tu proyecto de Supabase)
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Desde tu proyecto de Supabase)
-   `SUPABASE_SERVICE_ROLE_KEY` (Desde tu proyecto de Supabase)
-   `DATABASE_URL` (Desde tu proveedor de base de datos, como Neon)

---

### **Paso 2: Accede a la Configuración de tu Proyecto en Vercel**

1.  Inicia sesión en tu cuenta de [Vercel](https://vercel.com).
2.  Selecciona el proyecto **suitpax-landing** de tu lista de proyectos.
3.  Navega a la pestaña **"Settings"** en el menú superior.
4.  En el menú lateral izquierdo, haz clic en **"Environment Variables"**.

---

### **Paso 3: Añade las Variables de Entorno**

En esta sección, añadirás cada una de tus claves.

1.  **KEY:** Aquí va el nombre de la variable (ej. `ANTHROPIC_API_KEY`).
2.  **VALUE:** Aquí pegas la clave secreta que obtuviste del proveedor.
3.  **Environment:** Asegúrate de que las variables estén disponibles para **Production**, **Preview** y **Development**.

Añade las siguientes variables una por una, copiando el nombre del archivo `.env.example` y pegando el valor correspondiente:

-   `ANTHROPIC_API_KEY`
-   `BREVO_API_KEY`
-   `ELEVENLABS_API_KEY`
-   `NEXT_PUBLIC_SUPABASE_URL`
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-   `SUPABASE_SERVICE_ROLE_KEY`
-   `DATABASE_URL`
-   `NEXT_PUBLIC_APP_URL` (Usa la URL de tu dominio principal en Vercel, ej: `https://suitpax.com`)

**Nota sobre `NEXT_PUBLIC_`:** Las variables que empiezan con `NEXT_PUBLIC_` son accesibles desde el navegador (cliente), mientras que las demás solo son accesibles desde el servidor, lo cual es más seguro para claves sensibles como las de Anthropic o Brevo. El código ya está configurado para usar cada variable desde el lugar correcto.

---

### **Paso 4: Redespliega tu Aplicación**

Una vez que hayas añadido todas las variables, Vercel necesitará crear un nuevo despliegue para que los cambios surtan efecto.

1.  Ve a la pestaña **"Deployments"** de tu proyecto.
2.  Busca el último despliegue, haz clic en el menú de tres puntos (`...`) y selecciona **"Redeploy"**.
3.  Confirma la acción.

¡Y listo! Tu aplicación en Vercel ahora está configurada con todas las claves de API necesarias para funcionar correctamente en producción.
\`\`\`

```plaintext file=".env.example"
# -----------------------------------------------------------------------------
# Suitpax Environment Variables Template
#
# Instrucciones:
# 1. Copia este archivo y renómbralo a .env.local para desarrollo local.
# 2. Rellena los valores con tus propias claves de API.
# 3. Para producción, añade estas variables en el dashboard de Vercel.
#    (Ver DEPLOYMENT_GUIDE.md para más detalles)
# -----------------------------------------------------------------------------

# Supabase - Requerido para autenticación y base de datos
# Obtenlas desde la configuración de tu proyecto en Supabase.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic AI - Requerido para el Chat de IA y funciones de voz
# Obtenla desde tu dashboard de Anthropic.
ANTHROPIC_API_KEY=

# ElevenLabs - Requerido para la conversión de texto a voz en la IA de voz
# Obtenla desde tu dashboard de ElevenLabs.
ELEVENLABS_API_KEY=

# Brevo (Email Service) - Requerido para el formulario de contacto
# Obtenla desde tu cuenta de Brevo (SMTP & API -> API Keys).
BREVO_API_KEY=

# Next.js - Requerido para callbacks de autenticación y otras funciones
# Para desarrollo local: http://localhost:3000
# Para producción: La URL de tu dominio en Vercel (ej. https://www.suitpax.com)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Base de datos - Requerido para la conexión a la base de datos (ej. Neon)
# Obtenla de tu proveedor de base de datos.
DATABASE_URL=

# Entorno de Node
NODE_ENV=development
