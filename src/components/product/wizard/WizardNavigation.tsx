/* Navegación inferior */
export function WizardNavigation({
  activeTab,
  setActiveTab,
  tabsOrden,
  setTransitionDirection,
  handleSave,
  producto,
  //submitAttempted,
  setSubmitAttempted
}: any) {

  const current = tabsOrden.indexOf(activeTab);

  // Campos obligatorios por pestaña
  const requeridos: Record<string, string[]> = {
    pantalla1: ["ubicacion", "piso", "area_sector", "tipo", "tag"],
    pantalla2: ["descripcion_corta"]
  };

  const faltan = (pantalla: string) => {
    if (!requeridos[pantalla]) return [];
    return requeridos[pantalla].filter(
      (campo) => !producto[campo] || producto[campo] === ""
    );
  };

  const faltantesActual = faltan(activeTab);

  const intentarSiguiente = () => {
    setSubmitAttempted(true);

    if (faltantesActual.length > 0) {
      // no avanza
      return;
    }

    setTransitionDirection("left");
    setActiveTab(tabsOrden[current + 1]);
  };

  return (
    <div className="flex justify-between pt-4">

      {/* Botón ANTERIOR */}
      {current > 0 ? (
        <button
          onClick={() => {
            setTransitionDirection("right");
            setActiveTab(tabsOrden[current - 1]);
          }}
          className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg text-gray-300 font-semibold"
        >
          ← Anterior
        </button>
      ) : (
        <div />
      )}

      {/* Botón SIGUIENTE o GUARDAR */}
      {activeTab !== "resumen" ? (
        <button
          onClick={intentarSiguiente}
          disabled={faltantesActual.length > 0}
          className={`
            px-6 py-2 rounded-lg font-semibold 
            ${faltantesActual.length > 0 
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          `}
        >
          Siguiente →
        </button>
      ) : (
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-semibold"
        >
          Guardar
        </button>
      )}

    </div>
  );
}
