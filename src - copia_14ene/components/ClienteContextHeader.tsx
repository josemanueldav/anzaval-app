// ClienteContextHeader.tsx (idea)
export default function ClienteContextHeader({
  cliente,
  onChangeCliente,
  compact = false,
}: {
  cliente: { nombre: string; logo_url?: string };
  onChangeCliente: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-white/50">
            Cliente activo
          </div>
          <div className="truncate text-sm font-medium text-white">
            {cliente.nombre}
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeCliente}
          className="shrink-0 rounFed-lg bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
        >
          Cambiar
        </button>
      </div>
    );
  }

  // ...tu versión “card” actual
}
