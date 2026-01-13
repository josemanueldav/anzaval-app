// src/components/product/widgets/BarcodeImage.tsx
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export default function BarcodeImage({ value }: { value: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;

    JsBarcode(svgRef.current, value, {
      format: "CODE128",
      lineColor: "#ffffff",
      background: "transparent",
      displayValue: true,
      fontSize: 16,
      width: 2,
      height: 80,
      margin: 10,
    });
  }, [value]);

  return (
    <div className="p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/20 inline-block">
      <svg ref={svgRef} className="text-white"></svg>
    </div>
  );
}
