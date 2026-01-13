import Input from "../inputs/Input";

export default function Pantalla9Auditoria({
  producto,
  handleChange,
}: any) {
  return (
    <div className="space-y-6 px-1 md:px-0">

      {/* ===================== INFO ===================== */}
      <div className="card-base text-sm text-tertiary">
        Campos de auditoría, migración o casos especiales.  
        Complete esta sección solo si el activo fue migrado, re-etiquetado
        o requiere trazabilidad adicional.
      </div>

      {/* ===================== IDENTIFICACIÓN HISTÓRICA ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          🏷️ Identificación histórica
        </h3>

        <Input
          label="Etiqueta anterior"
          field="tag_anterior"
          value={producto.tag_anterior}
          onChange={handleChange}
        />

        <Input
          label="Etiqueta colocada nueva"
          field="tag_colocado_nuevo"
          value={producto.tag_colocado_nuevo}
          onChange={handleChange}
        />
      </div>

      {/* ===================== RESPONSABLES ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          🧍 Responsables / contexto
        </h3>

        <Input
          label="Usuario"
          field="usuario"
          value={producto.usuario}
          onChange={handleChange}
        />

        <Input
          label="Consultor"
          field="consultor"
          value={producto.consultor}
          onChange={handleChange}
        />

        <Input
          label="Área específica"
          field="area_especifica"
          value={producto.area_especifica}
          onChange={handleChange}
        />
      </div>

      {/* ===================== INFORMACIÓN ADICIONAL ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          📝 Información adicional
        </h3>

        <div>
          <label className="label-base">Descripción larga</label>
          <textarea
            className="textarea-base"
            value={producto.descripcion_larga ?? ""}
            onChange={(e) =>
              handleChange("descripcion_larga", e.target.value)
            }
          />
        </div>

        <div>
          <label className="label-base">Notas adicionales</label>
          <textarea
            className="textarea-base"
            value={producto.notas_adicionales ?? ""}
            onChange={(e) =>
              handleChange("notas_adicionales", e.target.value)
            }
          />
        </div>

        <div>
          <label className="label-base">Observaciones</label>
          <textarea
            className="textarea-base"
            value={producto.observaciones ?? ""}
            onChange={(e) =>
              handleChange("observaciones", e.target.value)
            }
          />
        </div>
      </div>

    </div>
  );
}
