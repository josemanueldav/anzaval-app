export default function TabIdentificacion({ producto, updateField }: any) {
  return (
    <div className="space-y-4">
      <input
        className="input"
        value={producto.nombre || ""}
        onChange={e => updateField("nombre", e.target.value)}
        placeholder="Nombre del producto"
      />

      <input
        className="input"
        value={producto.sku || ""}
        onChange={e => updateField("sku", e.target.value)}
        placeholder="SKU"
      />
    </div>
  );
}
