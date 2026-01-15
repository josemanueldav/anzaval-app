import { useEffect, useState } from "react";
import { usePWAStatus } from "../hooks/usePWAStatus";

export default function PWAModal() {
  const { isInstalled } = usePWAStatus();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Detect Chrome installation event
  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setShowModal(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Detect iOS (no beforeinstallprompt exists)
  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isInStandalone = (window.navigator as any).standalone === true;

    if (isIOS && !isInStandalone) {
      setShowModal(true);
    }
  }, []);

  if (!showModal || isInstalled) return null;

  // Android installation
  const installPWA = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    console.log("Resultado instalación:", result);

    if (result.outcome === "accepted") {
      setShowModal(false);
    }

    setDeferredPrompt(null);
  };

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-80 shadow-xl border dark:border-gray-700">

        <h2 className="text-xl font-semibold mb-3 dark:text-white">
          Instalar Anzaval App
        </h2>

        {isIOS ? (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Para instalar esta app en iOS:
            </p>
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1 mb-4">
              <li>Pulsa el botón <strong>Compartir</strong> en Safari.</li>
              <li>Selecciona <strong>“Agregar a inicio”</strong>.</li>
            </ol>
          </>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Puedes instalar esta app en tu dispositivo.
            </p>

            <button
              onClick={installPWA}
              className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700"
            >
              Instalar
            </button>
          </>
        )}

        <button
          className="mt-4 w-full py-2 border rounded-md dark:text-white"
          onClick={() => setShowModal(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
