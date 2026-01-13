import { useState, useRef, useEffect } from "react";

export default function DropdownCliente({
  items,
  value,
  onChange,
  label = "Seleccione un cliente...",
}: {
  items: { id: string; nombre: string }[];
  value: string | null;
  onChange: (id: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Botón */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full text-left rounded-xl bg-white/10 border border-white/20
          text-white text-[16px] px-4 py-3 flex items-center justify-between
        "
      >
        <span>
          {value
            ? items.find((c) => String(c.id) === String(value))?.nombre
            : label}
        </span>

        {/* Icono flecha */}
        <svg
          className={`w-5 h-5 text-white/60 transform transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Lista desplegable */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2 rounded-xl bg-[#111827] 
            border border-white/10 shadow-xl z-50 overflow-hidden
            animate-fade-in
          "
        >
          {items.length === 0 && (
            <div className="px-4 py-3 text-white/50 text-sm">
              No hay clientes
            </div>
          )}

          {items.map((cli) => (
            <button
              key={cli.id}
              onClick={() => {
                onChange(cli.id);
                setOpen(false);
              }}
              className="
                w-full text-left px-4 py-3 text-white text-[15px]
                hover:bg-white/10 transition-colors
              "
            >
              {cli.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
