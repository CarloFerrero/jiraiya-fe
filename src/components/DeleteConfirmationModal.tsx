import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import type { Methodology } from '@/types';

interface DeleteConfirmationModalProps {
  methodology?: Methodology;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  methodology,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false
}) => {
  if (!isOpen || !methodology) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onKeyDown={handleKeyDown}
    >
      <Card className="w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Elimina Metodologia
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Sei sicuro di voler eliminare questa metodologia?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Questa azione non può essere annullata. La metodologia verrà eliminata definitivamente.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">Metodologia da eliminare:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Nome:</strong> {methodology.name}</p>
                  <p><strong>Descrizione:</strong> {methodology.description || 'Nessuna descrizione'}</p>
                  {methodology.isDefault && (
                    <p className="text-orange-600 font-medium">⚠️ Questa è una metodologia di sistema</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={isDeleting}
              size="sm"
            >
              Annulla
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isDeleting}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Elimina
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
