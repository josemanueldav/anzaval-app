import { useLocation, Link } from "react-router-dom";
import { breadcrumbNames } from "@/config/breadcrumbs";

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  if (parts.length === 0) return null;

  return (
     <nav className="text-sm mb-4 flex items-center gap-2 text-gray-500 dark:text-gray-400">


      {parts.map((part, index) => {
        const path = "/" + parts.slice(0, index + 1).join("/");
        const isLast = index === parts.length - 1;

        // Buscar nombre legible
        const label = breadcrumbNames[part] || part.charAt(0).toUpperCase() + part.slice(1);

        return (
          <span key={path} className="flex items-center gap-2">

            {/* No es el último → es enlace */}
            {!isLast ? (
              <Link
                to={path}
                className="hover:text-white transition-colors"
              >
                {label}
              </Link>
            ) : (
              <span className="text-white font-semibold flex items-center gap-1">
                {/* Icono del último elemento */}
                <span>📍</span>
                {label}
              </span>
            )}

            {/* Agregar separador si no es el último */}
            {!isLast && <span className="text-slate-600">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
