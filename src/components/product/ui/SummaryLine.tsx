export default function SummaryLine({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-white/10 py-1">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="font-semibold text-white">{value ?? "—"}</span>
    </div>
  );
}
