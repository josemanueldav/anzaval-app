//import CampoObligatorio from "./CampoObligatorio";

export default function Pantalla2DatosActivo({
  producto,
  handleChange,
  //persistSticky,
  submitAttempted,
}: {
  producto: any;
  handleChange: (field: string, value: any) => void;
  persistSticky: (draft?: any) => void;
  submitAttempted: boolean;
}) {
  return (
    <div className="space-y-6 px-1 md:px-0">

      {/* ===================== IDENTIFICACIÓN GENERAL ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          🧾 Identificación del activo
        </h3>

        {/* Descripción corta */}
        <div>
          <label className="label-base">
            Descripción corta <span className="text-red-500">*</span>
          </label>
          <input
            value={producto.descripcion_corta ?? ""}
            onChange={(e) =>
              handleChange("descripcion_corta", e.target.value)
            }
            className="input-base"
            placeholder="Ej. Compresor industrial Atlas Copco"
          />

          {submitAttempted && !producto.descripcion_corta && (
            <p className="text-xs text-red-500 mt-1">
              Este campo es obligatorio
            </p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="label-base">Categoría</label>
          <input
            value={producto.categoria ?? ""}
            onChange={(e) => handleChange("categoria", e.target.value)}
            className="input-base"
            placeholder="Ej. Maquinaria, Equipo eléctrico, Mobiliario…"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="label-base">Estado del activo</label>
          <select
            value={producto.estado ?? ""}
            onChange={(e) => handleChange("estado", e.target.value)}
            className="select-base"
          >
            <option value="">Seleccionar estado</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="mantenimiento">En mantenimiento</option>
            <option value="baja">Dado de baja</option>
          </select>
        </div>
      </div>

      {/* ===================== GESTIÓN / PROVEEDOR ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          🏢 Gestión y proveedor
        </h3>

        {/* Proveedor */}
        <div>
          <label className="label-base">Proveedor</label>
          <input
            value={producto.proveedor ?? ""}
            onChange={(e) => handleChange("proveedor", e.target.value)}
            className="input-base"
            placeholder="Ej. Proveedor o fabricante"
          />
        </div>

        {/* Unidad */}
        <div>
          <label className="label-base">Unidad</label>
          <input
            value={producto.unidad ?? ""}
            onChange={(e) => handleChange("unidad", e.target.value)}
            className="input-base"
            placeholder="Ej. Unidad, pieza, juego…"
          />
        </div>
      </div>

    </div>
  );
}
