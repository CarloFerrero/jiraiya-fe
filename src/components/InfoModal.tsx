import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderOpen, 
  Settings, 
  CheckCircle,
  X
} from 'lucide-react';

interface InfoModalProps {
  type: 'project' | 'methodology';
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, isOpen, onClose }) => {
  if (!isOpen) return null;

  if (type === 'project') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <Card className="w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                Che cos'è un Progetto?
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Un Progetto è un contenitore per l'analisi di un'opera letteraria. 
              Contiene le pagine digitalizzate, la trascrizione OCR e i risultati dell'analisi AI.
            </p>
            
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">Cosa include:</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Pagine digitalizzate (immagini/PDF)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Trascrizione automatica OCR
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Analisi AI personalizzata
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Quiz interattivi generati
                </li>
              </ul>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={onClose} variant="github" size="sm">
                Ho Capito
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Methodology modal
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Che cos'è una Metodologia?
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Una Metodologia definisce come l'AI analizza il testo letterario. 
            Fornisce istruzioni specifiche per interpretare significati, temi e simboli.
          </p>
          
          <div className="bg-muted/30 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2">Include:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                Prompt di sistema per l'AI
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                Schema di output strutturato
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                Post-elaborazione del testo
              </li>
            </ul>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2">Tipi disponibili:</h4>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">Sistema</Badge>
              <Badge variant="outline" className="text-xs">Personalizzate</Badge>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="github" size="sm">
              Ho Capito
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
