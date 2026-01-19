import { Link } from "react-router-dom"

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Fondo semitransparente en móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 transform bg-slate-900 dark:bg-slate-950 shadow-md w-64 p-4 z-30
        transition-transform duration-200 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <nav className="space-y-4">
          <Link to="/" className="block text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="/productos" className="block text-gray-700 hover:text-blue-600">Activos</Link>
          <Link to="/usuarios" className="block text-gray-700 hover:text-blue-600">Usuarios</Link>
          <Link to="/reportes" className="block text-gray-700 hover:text-blue-600">Reportes</Link>
        </nav>
      </aside>
    </>
  )
}
