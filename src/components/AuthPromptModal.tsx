import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  action: string;
}

export function AuthPromptModal({ isOpen, onClose, onOpenLogin, action }: AuthPromptModalProps) {
  const handleLoginClick = () => {
    onClose();
    onOpenLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Inicia Sesión Requerida
          </DialogTitle>
          <DialogDescription>
            Para {action}, necesitas estar registrado en Bienestar Pleno.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">¿Por qué registrarse?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Guarda tus posts favoritos</li>
              <li>• Interactúa con la comunidad</li>
              <li>• Crea y comparte contenido</li>
              <li>• Accede a evaluaciones personalizadas</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleLoginClick} className="flex-1">
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}