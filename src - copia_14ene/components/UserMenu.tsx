import { useState, useRef, useEffect } from "react";

type UserMenuProps = {
  name: string;
  onLogout: () => void;
};

export default function UserMenu({ name, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Botón */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2
          rounded-full
          bg-blue-600/15
          px-2 py-1
          hover:bg-blue-600/25
          transition
        "
      >
        <div
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full
            bg-blue-600
            text-xs font-semibold text-white
          "
        >
          {initials}
        </div>

        <span className="hidden lg:block text-sm font-medium text-white/90">
          {name}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-56
            rounded-xl
            bg-slate-800
            shadow-xl
            ring-1 ring-white/10
            overflow-hidden
            z-50
          "
        >
          {/* Header */}
          <div className="px-4 py-3 text-sm text-white/80 border-b border-white/10">
            Sesión activa
            <div className="font-medium text-white mt-1">{name}</div>
          </div>

          {/* Acciones */}
          <button
            onClick={onLogout}
            className="
              w-full px-4 py-3 text-left text-sm
              text-red-400
              hover:bg-white/5
              transition
            "
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
