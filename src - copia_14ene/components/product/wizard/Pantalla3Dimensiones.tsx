//import React from "react";
//import CampoObligatorio from "./CampoObligatorio";

export default function Pantalla3Dimensiones({
  producto,
  handleChange,
}: {
  producto: any;
  handleChange: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6 px-1 md:px-0">

      {/* ===================== CARACTERÍSTICAS GENERALES ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          ⚙️ Características generales
        </h3>

        <div>
          <label className="label-base">País de origen</label>
          <input
            type="text"
            value={producto.pais_origen ?? ""}
            onChange={(e) => handleChange("pais_origen", e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="label-base">Año</label>
          <input
            type="number"
            value={producto.ano ?? ""}
            onChange={(e) => handleChange("ano", e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="label-base">Factor estado</label>
          <input
            type="text"
            value={producto.factor_estado ?? ""}
            onChange={(e) => handleChange("factor_estado", e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="label-base">Material</label>
          <input
            type="text"
            value={producto.material ?? ""}
            onChange={(e) => handleChange("material", e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      {/* ===================== DIMENSIONES FÍSICAS ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          📐 Dimensiones físicas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label-base">Largo</label>
            <input
              type="number"
              value={producto.largo ?? ""}
              onChange={(e) => handleChange("largo", e.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="label-base">Ancho</label>
            <input
              type="number"
              value={producto.ancho ?? ""}
              onChange={(e) => handleChange("ancho", e.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="label-base">Alto</label>
            <input
              type="number"
              value={producto.alto ?? ""}
              onChange={(e) => handleChange("alto", e.target.value)}
              className="input-base"
            />
          </div>
        </div>
      </div>

      {/* ===================== CAPACIDADES ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          📦 Capacidades
        </h3>

        <div>
          <label className="label-base">Capacidad</label>
          <input
            type="text"
            value={producto.capacidad ?? ""}
            onChange={(e) => handleChange("capacidad", e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="label-base">Volumen</label>
          <input
            type="text"
            value={producto.volumen ?? ""}
            onChange={(e) => handleChange("volumen", e.target.value)}
            className="input-base"
          />
        </div>

        <div>
  <label className="label-base">Peso</label>
  <input
    type="number"
    value={producto.peso ?? ""}
    onChange={(e) => handleChange("peso", e.target.value)}
    className="input-base"
    placeholder="Ej. 35"
  />
</div>

{/* ===================== DETALLES TÉCNICOS ADICIONALES ===================== */}
<div className="card-base space-y-4">
  <h3 className="section-title text-blue-500">
    📝 Detalles técnicos adicionales
  </h3>

  <div>
    <label className="label-base">Detalles adicionales</label>
    <textarea
      value={producto.detalles_adicionales ?? ""}
      onChange={(e) =>
        handleChange("detalles_adicionales", e.target.value)
      }
      className="textarea-base"
      placeholder="Información técnica adicional relevante…"
    />
  </div>
</div>


      </div>

    </div>
  );
}
