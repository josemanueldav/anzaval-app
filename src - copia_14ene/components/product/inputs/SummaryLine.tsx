// src/components/product/inputs/SummaryLine.tsx
//import React from "react";

export default function SummaryLine({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value ?? "—"}</span>
    </div>
  );
}
