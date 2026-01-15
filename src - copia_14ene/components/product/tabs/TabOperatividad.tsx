export default function TabOperatividad({ producto, updateField }: any) {
  return (
    <div className="space-y-4">

      <select
        className="input"
        value={producto.estadoFisico || ""}
        onChange={e => updateField("estadoFisico", e.target.value)}
      >
        <option value="">Estado físico</option>
        <option value="Excelente">Excelente</option>
        <option value="Bueno">Bueno</option>
        <option value="Regular">Regular</option>
        <option value="Deteriorado">Deteriorado</option>
      </select>

      <select
        className="input"
        value={producto.operatividad || ""}
        onChange={e => updateField("operatividad", e.target.value)}
      >
        <option value="">Operatividad</option>
        <option value="Funciona">Funciona</option>
        <option value="Funciona parcialmente">Funciona parcialmente</option>
        <option value="No funciona">No funciona</option>
      </select>

      <textarea
        className="textarea"
        value={producto.observaciones || ""}
        onChange={e => updateField("observaciones", e.target.value)}
        placeholder="Observaciones adicionales"
      />

    </div>
  );
}
