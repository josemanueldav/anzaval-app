type Cliente = {
  id: string;
  nombre: string;
  logo_url?: string;
};

export default function ClienteSelectorModal({
  clientes,
  clienteActivoId,
  onSelectCliente,
  onClose,
}: {
  clientes: Cliente[];
  clienteActivoId: string | null;
  onSelectCliente: (cliente: Cliente) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="
        w-full h-full md:h-auto md:max-w-lg
        bg-white dark:bg-[#020617]
        rounded-none md:rounded-2xl
        shadow-xl
        flex flex-col
      ">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Seleccionar cliente
            </h2>
            <p className="text-sm text-tertiary">
              Este cliente se mantendrá activo durante la captura.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-700 dark:text-white/60"
          >
            ✕
          </button>
        </div>

        {/* LISTA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {clientes.map((cliente) => {
            const activo = cliente.id === clienteActivoId;

            return (
              <button
                key={cliente.id}
                onClick={() => onSelectCliente(cliente)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl text-left
                  border transition
                  ${activo
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                    : "border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"}
                `}
              >
                {cliente.logo_url ? (
                  <img
                    src={cliente.logo_url}
                    alt={cliente.nombre}
                    className="w-10 h-10 rounded-lg object-contain bg-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center text-sm font-bold">
                    {cliente.nombre.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {cliente.nombre}
                  </p>
                  {activo && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Cliente activo
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="w-full btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
