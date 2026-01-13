export default function TabResumen({ producto }: any) {
  return (
    <div className="space-y-2 text-sm">

      <div><b>Nombre:</b> {producto.nombre}</div>
      <div><b>SKU:</b> {producto.sku}</div>
      <div><b>Código:</b> {producto.codigo}</div>
      <div><b>Marca:</b> {producto.marca}</div>
      <div><b>Modelo:</b> {producto.modelo}</div>
      <div><b>Serie:</b> {producto.serie}</div>

      <hr />

      <div><b>Estado físico:</b> {producto.estadoFisico}</div>
      <div><b>Operatividad:</b> {producto.operatividad}</div>

      <hr />

      <div><b>Costo:</b> {producto.costo}</div>
      <div><b>Precio:</b> {producto.precio}</div>
      <div><b>Proveedor:</b> {producto.proveedor}</div>

      <hr />

      <div><b>Existencias:</b> {producto.existencias}</div>
      <div><b>Ubicación:</b> {producto.ubicacion}</div>

      <hr />

      <div>
        <b>Descripción:</b><br />
        {producto.descripcion}
      </div>

      <div>
        <b>Especificaciones:</b><br />
        {producto.especificaciones}
      </div>

    </div>
  );
}
