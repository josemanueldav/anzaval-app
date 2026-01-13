import SummaryLine from "../ui/SummaryLine";

export default function ResumenTab({ producto }: any) {
  return (
    <div className="space-y-2">
      <SummaryLine label="Proyecto" value={producto?.cliente_id} />
      <SummaryLine label="Ubicación" value={producto?.ubicacion} />
      <SummaryLine label="Piso" value={producto?.piso} />
      <SummaryLine label="Área" value={producto?.area_sector} />
      <SummaryLine label="Descripción corta" value={producto?.descripcion_corta} />
      <SummaryLine label="Tipo" value={producto?.tipo} />
      <SummaryLine label="Tag" value={producto?.tag} />
    </div>
  );
}
