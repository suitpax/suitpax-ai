# Suitpax Navigation Component Documentation

Este documento detalla los estilos y patrones utilizados en los componentes de navegación de Suitpax.

## Navegación Principal

### Navegación de Escritorio

#### Contenedor
\`\`\`tsx
<header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    {/* Contenido de navegación */}
  </div>
</header>
\`\`\`

#### Logo
\`\`\`tsx
<div className="flex items-center">
  <Link href="/" className="flex items-center">
    <Image src="/logo/suitpax-symbol.webp" alt="Suitpax" width={32} height={32} className="h-8 w-auto" />
    <span className="ml-2 text-black font-medium text-lg">Suitpax</span>
  </Link>
</div>
\`\`\`

#### Enlaces de Navegación
\`\`\`tsx
<nav className="hidden md:flex items-center space-x-6">
  <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
    Features
  </Link>
  <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
    Pricing
  </Link>
  <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
    About
  </Link>
  <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
    Contact
  </Link>
</nav>
\`\`\`

#### Llamada a la Acción
\`\`\`tsx
<div className="hidden md:flex items-center ml-6">
  <Link href="/signup" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black text-sm font-medium rounded-lg transition-colors">
    Get Started
  </Link>
</div>
\`\`\`

#### Botón de Menú Móvil
\`\`\`tsx
<button 
  className="md:hidden p-2 rounded-lg bg-gray-100 text-black hover:bg-gray-200"
  onClick={() => setMobileMenuOpen(true)}
>
  <Menu className="w-5 h-5" />
</button>
\`\`\`

### Navegación Móvil

#### Contenedor de Menú Móvil
\`\`\`tsx
<div className={`fixed inset-0 z-50 bg-white flex flex-col ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
  {/* Contenido del menú móvil */}
</div>
\`\`\`

#### Encabezado de Menú Móvil
\`\`\`tsx
<div className="flex items-center justify-between p-4 border-b border-gray-200">
  <Link href="/" className="flex items-center">
    <Image src="/logo/suitpax-symbol.webp" alt="Suitpax" width={32} height={32} className="h-8 w-auto" />
    <span className="ml-2 text-black font-medium text-lg">Suitpax</span>
  </Link>
  <button 
    className="p-2 rounded-lg bg-gray-100 text-black hover:bg-gray-200"
    onClick={() => setMobileMenuOpen(false)}
  >
    <X className="w-5 h-5" />
  </button>
</div>
\`\`\`

#### Enlaces de Menú Móvil
\`\`\`tsx
<div className="flex flex-col space-y-4 p-6">
  <Link 
    href="/features" 
    className="text-lg font-medium text-gray-600 hover:text-black transition-colors py-2"
    onClick={() => setMobileMenuOpen(false)}
  >
    Features
  </Link>
  <Link 
    href="/pricing" 
    className="text-lg font-medium text-gray-600 hover:text-black transition-colors py-2"
    onClick={() => setMobileMenuOpen(false)}
  >
    Pricing
  </Link>
  <Link 
    href="/about" 
    className="text-lg font-medium text-gray-600 hover:text-black transition-colors py-2"
    onClick={() => setMobileMenuOpen(false)}
  >
    About
  </Link>
  <Link 
    href="/contact" 
    className="text-lg font-medium text-gray-600 hover:text-black transition-colors py-2"
    onClick={() => setMobileMenuOpen(false)}
  >
    Contact
  </Link>
</div>
\`\`\`

#### Llamada a la Acción del Menú Móvil
\`\`\`tsx
<div className="mt-auto p-6 border-t border-gray-200">
  <Link 
    href="/signup" 
    className="block w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-black text-center font-medium rounded-lg transition-colors"
    onClick={() => setMobileMenuOpen(false)}
  >
    Get Started
  </Link>
</div>
\`\`\`

## Navegación Secundaria

### Navegación por Pestañas
\`\`\`tsx
<div className="border-b border-gray-200">
  <nav className="flex space-x-6">
    <button 
      className={`py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === 'overview' 
          ? 'text-black border-emerald-950' 
          : 'text-gray-500 border-transparent hover:text-gray-700'
      }`}
      onClick={() => setActiveTab('overview')}
    >
      Overview
    </button>
    <button 
      className={`py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === 'features' 
          ? 'text-black border-emerald-950' 
          : 'text-gray-500 border-transparent hover:text-gray-700'
      }`}
      onClick={() => setActiveTab('features')}
    >
      Features
    </button>
    <button 
      className={`py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === 'pricing' 
          ? 'text-black border-emerald-950' 
          : 'text-gray-500 border-transparent hover:text-gray-700'
      }`}
      onClick={() => setActiveTab('pricing')}
    >
      Pricing
    </button>
  </nav>
</div>
\`\`\`

### Navegación de Migas de Pan
\`\`\`tsx
<nav className="flex items-center space-x-2 text-sm text-gray-500">
  <Link href="/" className="hover:text-gray-700 transition-colors">
    Home
  </Link>
  <ChevronRight className="w-4 h-4" />
  <Link href="/features" className="hover:text-gray-700 transition-colors">
    Features
  </Link>
  <ChevronRight className="w-4 h-4" />
  <span className="text-black">AI Travel Agents</span>
</nav>
\`\`\`

## Comportamiento Responsivo

### Escritorio (1024px y superior)
- Navegación horizontal completa
- Todos los enlaces visibles
- Botón CTA visible

### Tablet (768px a 1023px)
- Navegación horizontal completa
- Todos los enlaces visibles
- Botón CTA visible

### Móvil (menos de 768px)
- Menú hamburguesa
- Enlaces ocultos en el cajón móvil
- Botón CTA en el pie del cajón móvil

## Animaciones y Transiciones

### Efectos de Hover en Escritorio
- Hover de enlace: Transición de color de texto (150ms)
- Hover de CTA: Transición de color de fondo (200ms)

### Transiciones de Menú Móvil
- Apertura/cierre de menú: Transición de opacidad (300ms)
- Elementos del menú: Animación escalonada de entrada usando Framer Motion

\`\`\`tsx
const menuItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
\`\`\`

## Consideraciones de Accesibilidad

- Estados de foco adecuados para navegación por teclado
- Etiquetas ARIA para elementos interactivos
- Contraste de color suficiente (compatible con WCAG AA)
- Enlace de salto al contenido para lectores de pantalla
