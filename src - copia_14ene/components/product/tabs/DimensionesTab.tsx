import NumberInput from "../ui/NumberInput";
import Input from "../ui/Input";

export default function DimensionesTab({ producto, onChange }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <NumberInput label="Largo" field="largo" value={producto} onChange={onChange} />
      <NumberInput label="Ancho" field="ancho" value={producto} onChange={onChange} />
      <NumberInput label="Alto" field="alto" value={producto} onChange={onChange} />

      <Input label="UM Dimensiones" field="unidad_medida_dimensiones" value={producto} onChange={onChange} />

      <NumberInput label="Diámetro" field="diametro" value={producto} onChange={onChange} />
      <Input label="UM Diámetro" field="um_diametro" value={producto} onChange={onChange} />

      <NumberInput label="Capacidad" field="capacidad" value={producto} onChange={onChange} />
      <Input label="UM Capacidad" field="um_capacidad" value={producto} onChange={onChange} />
    </div>
  );
}
