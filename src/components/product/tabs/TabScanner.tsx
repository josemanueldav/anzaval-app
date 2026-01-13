import { useZXingScanner } from "../hooks/useZXingScanner";

export default function TabScanner({ onDetect }: any) {
  const { videoRef, scanning, start, stop, detected } = useZXingScanner({
  onResult: (codigo) => {

    console.log("Código detectado:", codigo);
  if (detected) onDetect(detected);
 },
 onError: (err) => {
    console.error("Scanner error:", err);
  }
});
  return (
    <div className="scanner-container">
      {!scanning && (
        <button className="btn" onClick={start}>Iniciar Scanner</button>
      )}

      {scanning && (
        <div className="scanner-overlay">
          <video ref={videoRef} className="scanner-video" />
          <button className="btn" onClick={stop}>Detener</button>
        </div>
      )}
    </div>
  );
}
