# Suitpax CRM Management Component Documentation

Este documento detalla los estilos y patrones utilizados en el componente de Gestión CRM de Suitpax.

## Contenedor Principal

### Estructura del Contenedor
\`\`\`tsx
<section className="relative overflow-hidden bg-gray-50 py-20 md:py-32">
  {/* Patrón de fondo */}
  <div className="absolute inset-0 bg-repeat bg-[radial-gradient(#00000033_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
  
  {/* Contenedor de contenido */}
  <div className="container mx-auto px-4 relative z-10">
    {/* Contenido del componente */}
  </div>
</section>
\`\`\`

### Encabezado de Sección
\`\`\`tsx
<div className="text-center mb-16">
  <div className="inline-flex items-center rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-black border border-gray-300 mb-6">
    <span className="text-black">Intelligent CRM</span>
  </div>
  <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-black">
    Streamlined Client Management
  </h2>
  <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
    Manage your business relationships and client data with our AI-powered CRM.
  </p>
</div>
\`\`\`

## Diseño del Dashboard

### Contenedor del Dashboard
\`\`\`tsx
<div className="bg-white backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden shadow-sm">
  {/* Contenido del dashboard */}
</div>
\`\`\`

### Encabezado del Dashboard
\`\`\`tsx
<div className="border-b border-gray-200 p-4">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-medium text-black">Client Dashboard</h3>
    <div className="flex items-center space-x-2">
      <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-black transition-colors">
        <RefreshCw className="w-4 h-4" />
      </button>
      <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-black transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
\`\`\`

### Pestañas del Dashboard
\`\`\`tsx
<div className="border-b border-gray-200">
  <div className="flex space-x-6 px-4">
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
        activeTab === 'contacts' 
          ? 'text-black border-emerald-950' 
          : 'text-gray-500 border-transparent hover:text-gray-700'
      }`}
      onClick={() => setActiveTab('contacts')}
    >
      Contacts
    </button>
    <button 
      className={`py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === 'deals' 
          ? 'text-black border-emerald-950' 
          : 'text-gray-500 border-transparent hover:text-gray-700'
      }`}
      onClick={() => setActiveTab('deals')}
    >
      Deals
    </button>
    <button 
      className={`py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === 'workflows' 
          ? 'text-black border-emerald-950' 
          : 'text-gray-500 border-transparent hover:text-gray-700'
      }`}
      onClick={() => setActiveTab('workflows')}
    >
      Workflows
    </button>
  </div>
</div>
\`\`\`

## Pestaña de Resumen del Cliente

### Contenedor de Resumen
\`\`\`tsx
<div className="p-4 md:p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Tarjetas de resumen */}
  </div>
</div>
\`\`\`

### Tarjeta de Información del Cliente
\`\`\`tsx
<div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
  <div className="flex items-start">
    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
      <Building className="w-6 h-6 text-gray-700" />
    </div>
    <div>
      <h4 className="text-lg font-medium text-black">Acme Corporation</h4>
      <div className="mt-1 flex items-center">
        <span className="text-xs text-gray-500">Client since: May 2023</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-black border border-gray-300">
          3 key contacts
        </span>
        <span className="rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-black border border-gray-300">
          Estimated value: $275K
        </span>
        <span className="rounded-xl bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-950 border border-emerald-950/20">
          Priority: High
        </span>
      </div>
    </div>
  </div>
</div>
\`\`\`

### Tarjeta de Actividad
\`\`\`tsx
<div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
  <h4 className="text-sm font-medium text-black mb-3">Recent Activity</h4>
  <div className="space-y-3">
    <div className="flex items-start">
      <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center mr-3">
        <Mail className="w-4 h-4 text-gray-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600">Email sent to John regarding Q3 proposal</p>
        <p className="text-[10px] text-gray-500 mt-1">2 hours ago</p>
      </div>
    </div>
    <div className="flex items-start">
      <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center mr-3">
        <Phone className="w-4 h-4 text-gray-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600">Call scheduled with Sarah for tomorrow</p>
        <p className="text-[10px] text-gray-500 mt-1">Yesterday</p>
      </div>
    </div>
  </div>
</div>
\`\`\`

### Tarjeta de Oportunidad
\`\`\`tsx
<div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
  <div className="flex items-center justify-between mb-3">
    <h4 className="text-sm font-medium text-black">Current Opportunity</h4>
    <span className="rounded-xl bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-950 border border-emerald-950/20">
      Active opportunity
    </span>
  </div>
  <div>
    <h5 className="text-base font-medium text-black">Global Travel Program</h5>
    <p className="text-xs text-gray-600 mt-1">Implementation of corporate travel solution for 500+ employees</p>
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Progress</span>
        <span className="text-gray-700">65%</span>
      </div>
      <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-emerald-950 h-1.5 rounded-full" style={{ width: '65%' }}></div>
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-medium rounded-lg transition-colors">
        View details
      </button>
    </div>
  </div>
</div>
\`\`\`

## Pestaña de Contactos

### Contenedor de Contactos
\`\`\`tsx
<div className="p-4 md:p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-medium text-black">Key Contacts</h3>
    <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-black text-xs font-medium rounded-lg transition-colors">
      Add Contact
    </button>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Tarjetas de contactos */}
  </div>
</div>
\`\`\`

### Tarjeta de Contacto
\`\`\`tsx
<div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
  <div className="flex items-center">
    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
      <Image 
        src="/community/jordan-burgess.webp"
        alt="Jordan Burgess"
        width={48}
        height={48}
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <h4 className="text-base font-medium text-black">Jordan Burgess</h4>
      <p className="text-xs text-gray-500">Chief Technology Officer</p>
    </div>
  </div>
  <div className="mt-3 space-y-2">
    <div className="flex items-center text-xs text-gray-600">
      <Mail className="w-3.5 h-3.5 mr-2 text-gray-500" />
      <span>jordan.burgess@acme.com</span>
    </div>
    <div className="flex items-center text-xs text-gray-600">
      <Phone className="w-3.5 h-3.5 mr-2 text-gray-500" />
      <span>+1 (555) 123-4567</span>
    </div>
  </div>
  <div className="mt-3 flex flex-wrap gap-2">
    <span className="rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-black border border-gray-300">
      Decision Maker
    </span>
    <span className="rounded-xl bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-950 border border-emerald-950/20">
      Key Stakeholder
    </span>
  </div>
  <div className="mt-4 flex justify-end space-x-2">
    <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black transition-colors">
      <Mail className="w-4 h-4" />
    </button>
    <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black transition-colors">
      <Phone className="w-4 h-4" />
    </button>
    <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black transition-colors">
      <MoreVertical className="w-4 h-4" />
    </button>
  </div>
</div>
\`\`\`

## Pestaña de Acuerdos

### Contenedor de Acuerdos
\`\`\`tsx
<div className="p-4 md:p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-medium text-black">Active Deals</h3>
    <div className="flex items-center space-x-2">
      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-medium rounded-lg transition-colors">
        Filter
      </button>
      <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-black text-xs font-medium rounded-lg transition-colors">
        New Deal
      </button>
    </div>
  </div>
  <div className="space-y-4">
    {/* Tarjetas de acuerdos */}
  </div>
</div>
\`\`\`

### Tarjeta de Acuerdo
\`\`\`tsx
<div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
        <Briefcase className="w-5 h-5 text-gray-700" />
      </div>
      <div>
        <h4 className="text-base font-medium text-black">Global Travel Program</h4>
        <p className="text-xs text-gray-500">Created: May 15, 2023</p>
      </div>
    </div>
    <span className="rounded-xl bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-950 border border-emerald-950/20">
      Negotiation
    </span>
  </div>
  <div className="mt-4">
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">Deal Progress</span>
      <span className="text-gray-700">65%</span>
    </div>
    <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
      <div className="bg-emerald-950 h-1.5 rounded-full" style={{ width: '65%' }}></div>
    </div>
  </div>
  <div className="mt-4 flex justify-between">
    <div>
      <span className="text-xs text-gray-500">Value:</span>
      <span className="ml-1 text-sm font-medium text-black">$275,000</span>
    </div>
    <div>
      <span className="text-xs text-gray-500">Closing:</span>
      <span className="ml-1 text-sm font-medium text-black">Q3 2023</span>
    </div>
  </div>
  <div className="mt-4 flex justify-end space-x-2">
    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-medium rounded-lg transition-colors">
      View details
    </button>
    <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-black text-xs font-medium rounded-lg transition-colors">
      Update
    </button>
  </div>
</div>
\`\`\`

## Pestaña de Flujos de Trabajo

### Contenedor de Flujos de Trabajo
\`\`\`tsx
<div className="p-4 md:p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-medium text-black">Business Workflows</h3>
    <div className="flex items-center space-x-2">
      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-medium rounded-lg transition-colors">
        All Workflows
      </button>
      <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-black text-xs font-medium rounded-lg transition-colors">
        New Workflow
      </button>
    </div>
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-medium text-black">Negotiation Process</h4>
        <span className="rounded-xl bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-950 border border-emerald-950/20">
          In progress
        </span>
      </div>
      <div className="space-y-4">
        {/* Pasos del flujo de trabajo */}
        <div className="relative pl-8 pb-4">
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-emerald-950/10 border border-emerald-950/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-950" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-black">Initial Proposal</h5>
            <p className="text-xs text-gray-600 mt-1">Sent detailed proposal document to client</p>
            <p className="text-[10px] text-gray-500 mt-1">Completed: June 2, 2023</p>
          </div>
        </div>
        <div className="relative pl-8 pb-4">
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-emerald-950/10 border border-emerald-950/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-950" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-black">Client Feedback</h5>
            <p className="text-xs text-gray-600 mt-1">Received and processed client feedback</p>
            <p className="text-[10px] text-gray-500 mt-1">Completed: June 15, 2023</p>
          </div>
        </div>
        <div className="relative pl-8 pb-4">
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
            <CircleDot className="w-3 h-3 text-black" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-black">Contract Revision</h5>
            <p className="text-xs text-gray-600 mt-1">Updating contract based on feedback</p>
            <p className="text-[10px] text-gray-500 mt-1">In progress</p>
          </div>
        </div>
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <Circle className="w-3 h-3 text-gray-500" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-500">Final Agreement</h5>
            <p className="text-xs text-gray-500 mt-1">Pending contract revision</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">Last update: 2 days ago</p>
        <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-medium rounded-lg transition-colors">
          Update
        </button>
      </div>
    </div>
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-medium text-black">Implementation Plan</h4>
        <span className="rounded-xl bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200">
          Pending
        </span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-center h-48 shadow-sm">
        <div className="text-center">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Waiting for contract finalization</p>
          <button className="mt-4 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-medium rounded-lg transition-colors">
            Prepare plan
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
\`\`\`

## Comportamiento Responsivo

### Escritorio (1024px y superior)
- Diseño de tres columnas para tarjetas de resumen
- Diseño de tres columnas para contactos
- Diseño de dos columnas para flujos de trabajo
- Vista completa del dashboard con todos los elementos visibles

### Tablet (768px a 1023px)
- Diseño de dos columnas para tarjetas de resumen
- Diseño de dos columnas para contactos
- Diseño de una columna para flujos de trabajo
- Espaciado ligeramente comprimido

### Móvil (menos de 768px)
- Diseño de una columna para todos los elementos
- Tarjetas apiladas
- Padding y márgenes reducidos
- Pestañas desplazables

## Animaciones y Transiciones

### Efectos de Hover en Tarjetas
\`\`\`tsx
<motion.div 
  whileHover={{ y: -5, scale: 1.02 }}
  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
>
  {/* Contenido de la tarjeta */}
</motion.div>
\`\`\`

### Transiciones de Pestañas
\`\`\`tsx
<AnimatePresence mode="wait">
  {activeTab === 'overview' && (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6"
    >
      {/* Contenido de resumen */}
    </motion.div>
  )}
  {/* Otras pestañas */}
</AnimatePresence>
\`\`\`

## Consideraciones de Accesibilidad

- Jerarquía de encabezados adecuada (h2, h3, h4, etc.)
- Contraste de color suficiente para legibilidad de texto
- Etiquetas ARIA para elementos interactivos
- Estados de foco para navegación por teclado
- Texto alternativo para imágenes
