export default function TabInventario({ producto, updateField }: any) {
  return (
    <div className="space-y-4">

      <input
        type="number"
        className="input"
        value={producto.existencias || ""}
        onChange={e => updateField("existencias", Number(e.target.value))}
        placeholder="Existencias"
      />

      <input
        className="input"
        value={producto.ubicacion || ""}
        onChange={e => updateField("ubicacion", e.target.value)}
        placeholder="Ubicación (bodega, oficina, anaquel…)"
      />

      <textarea
        className="textarea"
        value={producto.movimientos || ""}
        onChange={e => updateField("movimientos", e.target.value)}
        placeholder="Movimientos o historial"
      />

    </div>
  );
}
