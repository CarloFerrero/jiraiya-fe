import React, { useCallback, useState } from 'react';
import { Upload, FileImage, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    
    for (const file of files) {
      if (validTypes.includes(file.type)) {
        validFiles.push(file);
      }
    }
    
    if (validFiles.length !== files.length) {
      setError('Alcuni file non sono supportati. Usa PNG, JPG o PDF.');
      setTimeout(() => setError(null), 3000);
    }
    
    return validFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);
      
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  }, [onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
          isDragOver 
            ? "border-primary bg-primary/5 shadow-warm" 
            : "border-muted-foreground/25 hover:border-primary/50",
          isProcessing && "opacity-50 pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "p-4 rounded-full transition-colors",
            isDragOver ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <FileImage className="w-8 h-8" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              📚 Carica le pagine del libro
            </h3>
            <p className="text-muted-foreground mb-4">
              Trascina i file qui o clicca per selezionarli
            </p>
            <p className="text-sm text-muted-foreground">
              Supportati: PNG, JPG, PDF (max 10MB per file)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={isProcessing}
          className="bg-gradient-sensei hover:shadow-warm transition-all duration-300"
        >
          <Upload className="w-4 h-4 mr-2" />
          Seleziona File
        </Button>
      </div>

      <input
        id="file-input"
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.pdf"
        onChange={handleFileInput}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg animate-bounce-in">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};