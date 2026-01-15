import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center 
        bg-black/50 backdrop-blur-sm
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="
          w-[95%] max-w-lg rounded-xl shadow-lg p-6
          bg-white dark:bg-slate-800 
          text-gray-800 dark:text-gray-100
          animate-slideUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        {title && (
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
}
