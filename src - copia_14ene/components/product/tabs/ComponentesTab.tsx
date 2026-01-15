import Input from "../ui/Input";
import NumberInput from "../ui/NumberInput";

export default function ComponentesTab({ producto, onChange }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Asiento" field="asiento" value={producto} onChange={onChange} />
      <Input label="Respaldo" field="respaldo" value={producto} onChange={onChange} />
      <Input label="Base" field="base" value={producto} onChange={onChange} />
      <Input label="Cubierta" field="cubierta" value={producto} onChange={onChange} />
      <Input label="Rodajas" field="rodajas" value={producto} onChange={onChange} />
      <Input label="Descansabrazos" field="descansabrazos" value={producto} onChange={onChange} />
      <NumberInput label="Cajones" field="no_cajones" value={producto} onChange={onChange} />
      <NumberInput label="Gavetas" field="no_gavetas" value={producto} onChange={onChange} />
      <NumberInput label="Entrepaños" field="no_entrepanos" value={producto} onChange={onChange} />
      <NumberInput label="Puertas abatibles" field="no_puertas_abatibles" value={producto} onChange={onChange} />
      <NumberInput label="Puertas corredizas" field="no_puertas_corredizas" value={producto} onChange={onChange} />
    </div>
  );
}
