export default function Pantalla6Asignacion({
  producto,
  handleChange,
}: any) {
  return (
    <div className="space-y-6 px-1 md:px-0">

      {/* ===================== ASIGNACIÓN PRINCIPAL ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          🧍 Asignación del activo
        </h3>

        <div>
          <label className="label-base">Responsable</label>
          <input
            value={producto.responsable ?? ""}
            onChange={(e) =>
              handleChange("responsable", e.target.value)
            }
            className="input-base"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div>
          <label className="label-base">Área / Departamento</label>
          <input
            value={producto.area_asignada ?? ""}
            onChange={(e) =>
              handleChange("area_asignada", e.target.value)
            }
            className="input-base"
            placeholder="Ej. Operaciones, Mantenimiento…"
          />
        </div>

        <div>
          <label className="label-base">Fecha de asignación</label>
          <input
            type="date"
            value={producto.fecha_asignacion ?? ""}
            onChange={(e) =>
              handleChange("fecha_asignacion", e.target.value)
            }
            className="input-base"
          />
        </div>
      </div>

      {/* ===================== CONTEXTO Y OBSERVACIONES ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          📝 Contexto de asignación
        </h3>

        <div>
          <label className="label-base">Estado de asignación</label>
          <select
            value={producto.estado_asignacion ?? ""}
            onChange={(e) =>
              handleChange("estado_asignacion", e.target.value)
            }
            className="select-base"
          >
            <option value="">Seleccionar estado</option>
            <option value="asignado">Asignado</option>
            <option value="disponible">Disponible</option>
            <option value="en_mantenimiento">En mantenimiento</option>
            <option value="baja">Dado de baja</option>
          </select>
        </div>

        <div>
          <label className="label-base">Observaciones</label>
          <textarea
            value={producto.observaciones_asignacion ?? ""}
            onChange={(e) =>
              handleChange("observaciones_asignacion", e.target.value)
            }
            className="textarea-base"
            placeholder="Notas adicionales sobre la asignación…"
          />
        </div>
      </div>

    </div>
  );
}
