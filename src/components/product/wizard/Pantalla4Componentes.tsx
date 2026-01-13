//import React from "react";
//import CampoObligatorio from "./CampoObligatorio";
import Input from "../inputs/Input";

export default function Pantalla4Mobiliario({
  producto,
  handleChange,
}: any) {
  if (producto.tipo !== "mobiliario") {
    return (
      <div className="card-base text-sm text-tertiary">
        Este activo no es mobiliario. No hay datos que capturar en esta sección.
      </div>
    );
  }

  return (
    <div className="space-y-6 px-1 md:px-0">

      {/* ===================== ESTRUCTURA ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          🪑 Estructura del mobiliario
        </h3>

        <Input
          label="Asiento"
          field="asiento"
          value={producto.asiento}
          onChange={handleChange}
        />

        <Input
          label="Respaldo"
          field="respaldo"
          value={producto.respaldo}
          onChange={handleChange}
        />

        <Input
          label="Base"
          field="base"
          value={producto.base}
          onChange={handleChange}
        />

        <Input
          label="Cubierta"
          field="cubierta"
          value={producto.cubierta}
          onChange={handleChange}
        />

        <Input
          label="Rodajas"
          field="rodajas"
          value={producto.rodajas}
          onChange={handleChange}
        />

        <Input
          label="Descansabrazos"
          field="descansabrazos"
          value={producto.descansabrazos}
          onChange={handleChange}
        />
      </div>

      {/* ===================== COMPARTIMIENTOS ===================== */}
      <div className="card-base space-y-4">
        <h3 className="section-title text-blue-500">
          📦 Compartimientos
        </h3>

        <Input
          type="number"
          label="Número de cajones"
          field="no_cajones"
          value={producto.no_cajones}
          onChange={handleChange}
        />

        <Input
          type="number"
          label="Número de gavetas"
          field="no_gavetas"
          value={producto.no_gavetas}
          onChange={handleChange}
        />

        <Input
          type="number"
          label="Número de entrepaños"
          field="no_entrepanos"
          value={producto.no_entrepanos}
          onChange={handleChange}
        />

        <Input
          type="number"
          label="Puertas abatibles"
          field="no_puertas_abatibles"
          value={producto.no_puertas_abatibles}
          onChange={handleChange}
        />

        <Input
          type="number"
          label="Puertas corredizas"
          field="no_puertas_corredizas"
          value={producto.no_puertas_corredizas}
          onChange={handleChange}
        />
      </div>

    </div>
  );
}
