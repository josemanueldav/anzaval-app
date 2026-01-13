export default function TabCaracteristicas({ producto, updateField }: any) {
  return (
    <div className="space-y-4">

      <input
        className="input"
        value={producto.marca || ""}
        onChange={e => updateField("marca", e.target.value)}
        placeholder="Marca"
      />

      <input
        className="input"
        value={producto.modelo || ""}
        onChange={e => updateField("modelo", e.target.value)}
        placeholder="Modelo"
      />

      <input
        className="input"
        value={producto.serie || ""}
        onChange={e => updateField("serie", e.target.value)}
        placeholder="Número de serie"
      />

      <textarea
        className="textarea"
        value={producto.especificaciones || ""}
        onChange={e => updateField("especificaciones", e.target.value)}
        placeholder="Especificaciones técnicas"
      />

    </div>
  );
}
