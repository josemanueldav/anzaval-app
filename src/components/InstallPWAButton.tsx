import { useEffect, useState } from "react";
import { usePWAStatus } from "@/hooks/usePWAStatus";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [canInstall, setCanInstall] = useState(false);
  const { isInstalled } = usePWAStatus();

  useEffect(() => {
    const handler = (e: Event) => {
      console.log("📦 beforeinstallprompt disparado");

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

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    console.log("📲 Resultado instalación:", result.outcome);

    setDeferredPrompt(null);
    setCanInstall(false);
  };

  // Ya instalada → no mostrar
  if (isInstalled) return null;

  // No instalable (Android/Chrome no disparó evento)
  if (!canInstall) return null;

  return (
    <button
      onClick={installApp}
      className="
        bg-blue-600 hover:bg-blue-700
        text-white px-3 py-1.5 rounded-md
        text-sm font-medium shadow
      "
    >
      Instalar App
    </button>
  );
}
