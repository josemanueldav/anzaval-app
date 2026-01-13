import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DemoFeatureModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="text-amber-500" />
            Función limitada en modo demo
          </DialogTitle>

          <DialogDescription className="text-base mt-2">
            En esta versión de demostración, la creación de usuarios está
            deshabilitada por razones de seguridad.  
            <br />
            <br />
            La versión completa del sistema permite:
            <ul className="list-disc ml-5 mt-2">
              <li>Crear usuarios reales</li>
              <li>Asignar roles y permisos</li>
              <li>Administrar accesos a proyectos</li>
              <li>Restablecimiento de contraseñas</li>
            </ul>
            Si deseas probar la versión completa, contáctanos.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
