import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import type { Methodology } from '@/types';

interface JsonImportExportProps {
  methodology?: Methodology;
  onImport: (jsonData: string) => { success: boolean; error?: string };
  onExport: (methodology: Methodology) => void;
  onClose: () => void;
  isOpen: boolean;
  mode: 'import' | 'export';
}

export const JsonImportExport: React.FC<JsonImportExportProps> = ({
  methodology,
  onImport,
  onExport,
  onClose,
  isOpen,
  mode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = onImport(content);
      
      if (result.success) {
        onClose();
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (methodology) {
      onExport(methodology);
      onClose();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onImport(content);
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {mode === 'import' ? (
                <>
                  <Upload className="w-5 h-5" />
                  Importa Metodologia
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Esporta Metodologia
                </>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {mode === 'import' ? (
            <>
              <div className="text-sm text-muted-foreground">
                Carica un file JSON contenente una metodologia di analisi.
              </div>

              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Trascina qui il file JSON o clicca per selezionare
                </p>
                <p className="text-xs text-muted-foreground">
                  Supportato: file .json
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Formato richiesto:</p>
                    <ul className="space-y-1">
                      <li>• Nome e descrizione della metodologia</li>
                      <li>• System prompt con {{TRANSCRIPTION}}</li>
                      <li>• Schema JSON valido per l'output</li>
                      <li>• Impostazioni post-processing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {methodology && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium">{methodology.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {methodology.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Pronto per l'esportazione
                    </Badge>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Il file conterrà:</p>
                        <ul className="space-y-1">
                          <li>• Tutti i campi della metodologia</li>
                          <li>• System prompt e schema JSON</li>
                          <li>• Impostazioni post-processing</li>
                          <li>• Metadati (esclusi ID e timestamp)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Annulla
                </Button>
                <Button onClick={handleExport} className="flex-1" disabled={!methodology}>
                  <Download className="w-4 h-4 mr-2" />
                  Esporta JSON
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
