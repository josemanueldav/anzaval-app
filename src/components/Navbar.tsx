import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  // Obtener usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email || null);
    };
    fetchUser();
  }, []);

  // Cerrar sesión
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error cerrando sesión:", error.message);
    } else {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <>
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + nombre */}
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <Link to="/" className="text-lg font-bold tracking-wide">
                Anzaval App
              </Link>
            </div>

            {/* Menú escritorio */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-blue-400 transition">
                📊 Dashboard
              </Link>
              <Link to="/productos" className="hover:text-blue-400 transition">
                📦 Activos
              </Link>
              <Link to="/clientes" className="hover:text-blue-400 transition">
                🏢 Proyectos
              </Link>
              <Link to="/usuarios" className="hover:text-blue-400 transition">
                👥 Usuarios
              </Link>

              {userEmail && (
                <span className="text-sm text-gray-300 italic">{userEmail}</span>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
              >
                Salir
              </button>
            </div>

            {/* Botón móvil */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none text-2xl"
              >
                {isOpen ? "✖" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil con animación y sombra */}
        <div
          className={`md:hidden bg-white/10 border-t border-white/20 backdrop-blur-md text-sm transform transition-all duration-300 ease-in-out shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
            isOpen
              ? "opacity-100 translate-y-0 max-h-[320px]"
              : "opacity-0 -translate-y-5 max-h-0 overflow-hidden"
          }`}
        >
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/dashboard"
              className="block hover:text-blue-400 transition"
              onClick={() => setIsOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/productos"
              className="block hover:text-blue-400 transition"
              onClick={() => setIsOpen(false)}
            >
              📦 Activos
            </Link>
            <Link
              to="/clientes"
              className="block hover:text-blue-400 transition"
              onClick={() => setIsOpen(false)}
            >
              🏢 Proyectos
            </Link>
            <Link
              to="/usuarios"
              className="block hover:text-blue-400 transition"
              onClick={() => setIsOpen(false)}
            >
              👥 Usuarios
            </Link>

            {userEmail && (
              <p className="text-xs text-gray-300 italic pt-1">{userEmail}</p>
            )}

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 px-3 py-1 rounded mt-2"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Toast de confirmación */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600/90 text-white text-sm px-5 py-2 rounded-lg shadow-lg animate-fade-in-out z-50">
          ✅ Sesión cerrada correctamente
        </div>
      )}

      {/* Animación fade-in-out */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 1.5s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}
