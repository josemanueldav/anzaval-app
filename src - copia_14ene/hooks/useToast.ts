import { useCallback } from "react";

/**
 * Hook reutilizable para mostrar notificaciones tipo toast.
 * Uso: const { showToast } = useToast();
 * showToast("success", "Producto guardado correctamente");
 */

export function useToast() {
  const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
    // Crear contenedor si no existe
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed bottom-4 right-4 flex flex-col items-end gap-2 z-[9999]";
      document.body.appendChild(container);
    }

    // Crear toast individual
    const toast = document.createElement("div");
    toast.className = `
      flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border text-sm font-medium text-white
      backdrop-blur-lg animate-fadeIn
      ${
        type === "success"
          ? "bg-green-500/20 border-green-400/40"
          : type === "error"
          ? "bg-red-500/20 border-red-400/40"
          : "bg-blue-500/20 border-blue-400/40"
      }
    `;

    // Ícono según tipo
    const icon = document.createElement("span");
    icon.textContent = type === "success" ? "✔️" : type === "error" ? "⚠️" : "ℹ️";
    toast.appendChild(icon);

    // Mensaje
    const text = document.createElement("span");
    text.textContent = message;
    toast.appendChild(text);

    // Insertar en contenedor
    container.appendChild(toast);

    // Desaparecer con animación
    setTimeout(() => {
      toast.classList.add("animate-fadeOut");
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }, []);

  return { showToast };
}
