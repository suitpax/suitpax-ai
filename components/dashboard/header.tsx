// Actualiza tu componente Header para incluir estas props:

interface HeaderProps {
  user: User
  userPlan: string
  subscriptionStatus: string
  onToggleSidebar: () => void
  isMobile: boolean
  sidebarCollapsed: boolean
}

export default function Header({ 
  user, 
  userPlan, 
  subscriptionStatus, 
  onToggleSidebar,
  isMobile,
  sidebarCollapsed 
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Botón de menú móvil / toggle sidebar */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={isMobile ? "Open menu" : "Toggle sidebar"}
      >
        {isMobile ? (
          // Icono de hamburguesa para móvil
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          // Icono de sidebar toggle para desktop
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M13 5l7 7-7 7"} 
            />
          </svg>
        )}
      </button>

      {/* Título dinámico solo en móvil */}
      {isMobile && (
        <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
      )}

      {/* Área derecha del header */}
      <div className="flex items-center space-x-4">
        {/* Notificaciones, perfil, etc. */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{userPlan}</span>
          {/* Avatar del usuario */}
        </div>
      </div>
    </header>
  )
}