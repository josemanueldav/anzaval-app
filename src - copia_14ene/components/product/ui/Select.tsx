export default function Select({ label, field, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select
        value={value?.[field] ?? ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="select"
      >
        <option value="">Seleccione...</option>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
