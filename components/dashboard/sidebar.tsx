interface SidebarProps {
  onUserUpdate: (user: User) => void
  isCollapsed?: boolean
  isMobile?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ 
  onUserUpdate, 
  isCollapsed = false, 
  isMobile = false, 
  onCloseMobile 
}: SidebarProps) {
  // Tu implementación existente del sidebar
  // Añade lógica para manejar el estado collapsed y mobile
  
  const handleNavigation = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile()
    }
  }

  return (
    <div className={`
      bg-white border-r border-gray-200 flex flex-col h-full
      ${isCollapsed && !isMobile ? 'w-16' : 'w-64'}
    `}>
      {/* Header del sidebar */}
      <div className="p-4 border-b border-gray-200">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center space-x-2">
            {/* Tu logo y título */}
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto">
        {/* Tus elementos de navegación con handleNavigation en onClick */}
      </nav>

      {/* Usuario en la parte inferior */}
      <div className="p-4 border-t border-gray-200">
        {/* Tu componente de usuario */}
      </div>
    </div>
  )
}