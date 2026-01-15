import { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
  NotFoundException,
} from "@zxing/library";

interface UseScannerOptions {
  onResult: (text: string, format: string) => void;
  onError?: (err: any) => void;
}

export function useZXingScanner({ onResult, onError }: UseScannerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState(false);

  /* ============================================================
     INIT: prepara ZXing + lista de cámaras (sin abrir la cámara)
  ============================================================ */
  const init = async () => {
    try {
      if (!readerRef.current) {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.QR_CODE,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.ITF,
          BarcodeFormat.CODABAR,
          BarcodeFormat.DATA_MATRIX,
          BarcodeFormat.PDF_417,
        ]);

        readerRef.current = new BrowserMultiFormatReader(hints);
      }

      // 🔹 En muchos móviles esto regresa [] si aún no hay permiso
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        const backCam = videoDevices.find((d) =>
          d.label.toLowerCase().includes("back")
        );
        setSelectedDeviceId(backCam?.deviceId || videoDevices[0].deviceId);
      } else {
        // No pasa nada, ZXing elegirá la cámara por defecto al llamar start()
        console.warn("No se encontraron cámaras en enumerateDevices (móvil sin permiso todavía).");
      }
    } catch (err) {
      console.error("Error inicializando ZXing:", err);
      onError?.(err);
    }
  };

  // Llamamos init automáticamente una vez
  useEffect(() => {
    init();

    return () => {
      stop();
      readerRef.current?.reset();
      readerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     START: se llama SOLO al dar click en "Iniciar escaneo"
  ============================================================ */
  const start = async () => {
    // Para evitar doble click
    if (scanning) return;
    if (!videoRef.current) {
      console.warn("videoRef.current aún es null al iniciar escaneo");
      return;
    }
    if (!readerRef.current) {
      console.warn("readerRef.current aún es null al iniciar escaneo");
      return;
    }

    setDetected(false);
    setScanning(true);

    try {
      // 🎯 IMPORTANTE:
      // Si selectedDeviceId es null, pasamos undefined
      // ZXing elegirá la cámara por defecto (esto ayuda en móvil)
      await readerRef.current.decodeFromVideoDevice(
        selectedDeviceId ?? null,
        videoRef.current,
        (result, err) => {
          if (result) {
            setDetected(true);

            // Convertimos el enum a string legible
            const rawFormat = result.getBarcodeFormat();
            const formatString =
              typeof rawFormat === "number"
                ? BarcodeFormat[rawFormat]
                : String(rawFormat);

            onResult(result.getText(), formatString);

            // pequeña pausa para ver el marco en verde
            setTimeout(() => stop(), 200);
          } else if (
            err &&
            !(err instanceof NotFoundException) &&
            err.message &&
            !err.message.includes("Not Found")
          ) {
            console.warn("Scanner error:", err);
            onError?.(err);
          }
        }
      );
    } catch (err) {
      console.error("Error al iniciar escaneo:", err);
      onError?.(err);
      stop();
    }
  };

  /* ============================================================
     STOP: cerrar cámara y resetear ZXing
  ============================================================ */
  const stop = () => {
    setScanning(false);
    setDetected(false);

    try {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    } catch (e) {
      console.warn("Error al detener stream:", e);
    }

    try {
      readerRef.current?.reset();
    } catch (e) {
      console.warn("Error al resetear reader:", e);
    }
  };

  return {
    init, // ya se llama en el useEffect, pero lo dejamos expuesto por si luego quieres usarlo manualmente
    videoRef,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    scanning,
    detected,
    start,
    stop,
  };
}
