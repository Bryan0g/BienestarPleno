import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, Flag } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  onSubmit: (postId: string, reason: string, details: string) => void;
}

const reportReasons = [
  { value: "spam", label: "Spam o contenido repetitivo" },
  { value: "harassment", label: "Acoso o bullying" },
  { value: "hate", label: "Discurso de odio" },
  { value: "misinformation", label: "Información falsa o engañosa" },
  { value: "inappropriate", label: "Contenido inapropiado" },
  { value: "other", label: "Otro motivo" }
];

export function ReportModal({ isOpen, onClose, postId, postTitle, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(postId, selectedReason, details);
      
      // Reset form
      setSelectedReason("");
      setDetails("");
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setDetails("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            Reportar Publicación
          </DialogTitle>
          <DialogDescription>
            ¿Por qué estás reportando esta publicación? Tu reporte nos ayuda a mantener una comunidad segura y positiva.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Post:</strong> "{postTitle.substring(0, 50)}..."
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Label>Motivo del reporte:</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label 
                    htmlFor={reason.value} 
                    className="cursor-pointer flex-1 text-sm"
                  >
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">
              Detalles adicionales (opcional):
            </Label>
            <Textarea
              id="details"
              placeholder="Proporciona más información sobre el problema..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedReason || isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Enviando..." : "Enviar Reporte"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}