// src/components/product/detail/FieldRow.tsx
//import React from "react";

export default function FieldRow({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1 border-b border-white/10 last:border-b-0">
      <span className="text-gray-800 dark:text-gray-200
">{label}</span>
      <span className="font-medium text-gray-700 dark:text-gray-200
 text-right">
        {value ?? "—"}
      </span>
    </div>
  );
}
