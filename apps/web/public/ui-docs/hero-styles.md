# Suitpax Hero Component Documentation

Este documento detalla los estilos y patrones utilizados en los componentes hero de Suitpax.

## Hero Principal

### Estructura del Contenedor
\`\`\`tsx
<section className="relative overflow-hidden bg-gray-50 min-h-screen flex items-center">
  {/* Elementos de fondo */}
  <div className="absolute inset-0 bg-repeat bg-[radial-gradient(#00000033_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
  
  {/* Contenedor de contenido */}
  <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
    {/* Contenido del hero */}
  </div>
</section>
\`\`\`

### Badge del Hero
\`\`\`tsx
<div className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-black border border-gray-300 mb-6">
  <span className="w-4 h-4 rounded-full bg-emerald-950/80 flex items-center justify-center text-white mr-2">
    <Sparkles className="w-2.5 h-2.5" />
  </span>
  <span className="text-black">Revolutionizing Business Travel</span>
</div>
\`\`\`

### Título del Hero
\`\`\`tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none max-w-4xl">
  The AI-Powered Platform for Modern Business Travel
</h1>
\`\`\`

### Subtítulo del Hero
\`\`\`tsx
<p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl">
  Streamline your corporate travel with AI agents that handle everything from booking to expense management.
</p>
\`\`\`

### Botones de Llamada a la Acción
\`\`\`tsx
<div className="mt-10 flex flex-wrap gap-4">
  <Link 
    href="/signup" 
    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-black font-medium rounded-lg transition-colors"
  >
    Get Started
  </Link>
  <Link 
    href="/demo" 
    className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 text-black font-medium rounded-lg transition-colors"
  >
    Watch Demo
  </Link>
</div>
\`\`\`

### Imagen o Animación del Hero
\`\`\`tsx
<div className="mt-12 md:mt-0 md:absolute md:right-4 lg:right-12 md:top-1/2 md:-translate-y-1/2 w-full md:w-2/5 lg:w-5/12">
  <div className="relative aspect-[4/3] md:aspect-square w-full">
    <Image 
      src="/images/ai-orb.png"
      alt="AI Travel Assistant"
      fill
      className="object-contain"
    />
  </div>
</div>
\`\`\`

## Hero Secundario (Destacado de Características)

### Estructura del Contenedor
\`\`\`tsx
<section className="relative overflow-hidden bg-white py-20 md:py-32">
  {/* Elementos de fondo */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f3f4f6,transparent_50%)]"></div>
  
  {/* Contenedor de contenido */}
  <div className="container mx-auto px-4 relative z-10">
    {/* Contenido del hero */}
  </div>
</section>
\`\`\`

### Título de Sección
\`\`\`tsx
<div className="text-center mb-16">
  <div className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-black border border-gray-300 mb-6">
    <span className="text-black">AI-Powered Features</span>
  </div>
  <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-black">
    Intelligent Travel Management
  </h2>
  <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
    Our AI agents handle every aspect of your business travel needs.
  </p>
</div>
\`\`\`

### Cuadrícula de Características
\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {/* Tarjetas de características */}
  <FeatureCard 
    icon={<Calendar className="w-6 h-6" />}
    title="Smart Scheduling"
    description="AI automatically finds optimal travel times based on your calendar."
  />
  {/* Más tarjetas de características */}
</div>
\`\`\`

## Hero del Manifiesto

### Estructura del Contenedor
\`\`\`tsx
<section className="relative overflow-hidden bg-gray-50 min-h-screen flex items-center">
  {/* Elementos de fondo */}
  <div className="absolute inset-0 bg-repeat bg-[radial-gradient(#00000033_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
  
  {/* Contenedor de contenido */}
  <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 text-center">
    {/* Contenido del hero */}
  </div>
</section>
\`\`\`

### Título del Manifiesto
\`\`\`tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto">
  The Modern Business Travel Manifesto
</h1>
\`\`\`

### Subtítulo del Manifiesto
\`\`\`tsx
<p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
  Our vision for transforming the future of corporate travel through AI and automation.
</p>
\`\`\`

### Imagen del Manifiesto
\`\`\`tsx
<div className="mt-12 max-w-md mx-auto">
  <Image 
    src="/logo/suitpax-symbol-2.png"
    alt="Suitpax Manifesto"
    width={200}
    height={200}
    className="mx-auto"
  />
</div>
\`\`\`

## Comportamiento Responsivo

### Escritorio (1024px y superior)
- Texto de título grande (text-6xl)
- Diseño lado a lado para hero con imagen
- Ancho completo para contenido (max-w-4xl)

### Tablet (768px a 1023px)
- Texto de título mediano (text-5xl)
- Diseño lado a lado para hero con imagen
- Ancho de contenido ligeramente reducido

### Móvil (menos de 768px)
- Texto de título más pequeño (text-4xl)
- Diseño apilado (contenido sobre imagen)
- Contenido de ancho completo con max-width más pequeño

## Animaciones y Transiciones

### Animación de Texto
\`\`\`tsx
<motion.h1 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none max-w-4xl"
>
  The AI-Powered Platform for Modern Business Travel
</motion.h1>
\`\`\`

### Animación Escalonada para Múltiples Elementos
\`\`\`tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <motion.div variants={itemVariants} className="mb-6">
    {/* Badge del hero */}
  </motion.div>
  <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none max-w-4xl">
    {/* Título */}
  </motion.h1>
  <motion.p variants={itemVariants} className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl">
    {/* Subtítulo */}
  </motion.p>
  <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4">
    {/* Botones CTA */}
  </motion.div>
</motion.div>
\`\`\`

### Variantes de Animación
\`\`\`tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};
\`\`\`

## Consideraciones de Accesibilidad

- Jerarquía de encabezados adecuada (h1 para título principal)
- Contraste de color suficiente para legibilidad de texto
- Texto alternativo para imágenes
- Estructura HTML semántica
