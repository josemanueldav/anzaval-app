export default function TabPrecios({ producto, updateField }: any) {
  return (
    <div className="space-y-4">

      <input
        type="number"
        className="input"
        value={producto.costo || ""}
        onChange={e => updateField("costo", Number(e.target.value))}
        placeholder="Costo"
      />

      <input
        type="number"
        className="input"
        value={producto.precio || ""}
        onChange={e => updateField("precio", Number(e.target.value))}
        placeholder="Precio de venta"
      />

      <input
        className="input"
        value={producto.proveedor || ""}
        onChange={e => updateField("proveedor", e.target.value)}
        placeholder="Proveedor"
      />

      <input
        className="input"
        value={producto.factura || ""}
        onChange={e => updateField("factura", e.target.value)}
        placeholder="Número de factura"
      />

    </div>
  );
}
