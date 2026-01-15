export async function barcodeToPNG(svgElement: SVGSVGElement): Promise<string> {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const img = new Image();

  const svgBase64 =
    "data:image/svg+xml;base64," +
    window.btoa(unescape(encodeURIComponent(svgString)));

  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = svgBase64;
  });
}
