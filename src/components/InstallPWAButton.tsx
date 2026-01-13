import { useEffect, useState } from "react";
import { usePWAStatus } from "../hooks/usePWAStatus";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [canInstall, setCanInstall] = useState(false);
  const { isInstalled } = usePWAStatus();

  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    console.log("Instalación:", result.outcome);

    setDeferredPrompt(null);
    setCanInstall(false);
  };

  // Ya instalada → NO mostrar botón
  if (isInstalled) return null;

  // No es instalable → NO mostrar botón
  if (!canInstall) return null;

  return (
    <button
      onClick={installApp}
      className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
    >
      Instalar App
    </button>
  );
}
