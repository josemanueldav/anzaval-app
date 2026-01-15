import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

export function BarcodeImage({ value }: { value: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;

    JsBarcode(svgRef.current, value, {
      format: "CODE128",
      displayValue: true,
      lineColor: "#000",
      background: "#fff",
      width: 2,
      height: 80,
      margin: 10,
      fontSize: 16,
    });
  }, [value]);

  return (
    <div className="p-3 rounded-lg bg-white shadow border inline-block">
      <svg ref={svgRef}></svg>
    </div>
  );
}
