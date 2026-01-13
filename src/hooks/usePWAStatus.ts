import { useEffect, useState } from "react";

export function usePWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Android / Desktop Chrome
    const standaloneChrome =
      window.matchMedia("(display-mode: standalone)").matches;

    // iOS detection
    const standaloneIOS = (window.navigator as any).standalone === true;

    setIsStandalone(standaloneChrome || standaloneIOS);
    setIsInstalled(standaloneChrome || standaloneIOS);

    // Detect installation event (Chrome)
    window.addEventListener("appinstalled", () => {
      console.log("PWA instalada");
      setIsInstalled(true);
    });
  }, []);

  return { isInstalled, isStandalone };
}
