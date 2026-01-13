export default function Textarea({ label, field, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <textarea
        value={value?.[field] ?? ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="input h-24"
      />
    </div>
  );
}
