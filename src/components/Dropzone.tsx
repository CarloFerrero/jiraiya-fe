import React, { useCallback, useState } from 'react';
import { FileImage, AlertCircle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  accept?: string;
  maxFiles?: number;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, isProcessing, accept = "image/*,.pdf", maxFiles = 10 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    
    for (const file of files) {
      if (validTypes.includes(file.type) && validFiles.length < maxFiles) {
        validFiles.push(file);
      }
    }
    
    if (validFiles.length !== files.length) {
      setError(`Alcuni file non sono supportati o hai superato il limite di ${maxFiles} file.`);
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
    <div className="space-y-3">
      <div
        className={cn(
          "border border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer",
          isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/20 hover:border-muted-foreground/40",
          isProcessing && "opacity-50 pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "p-3 rounded-full transition-colors",
            isDragOver ? "bg-primary text-primary-foreground" : "bg-muted/50"
          )}>
            <FileImage className="w-6 h-6" />
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Carica le pagine del libro</span>
              </div>
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Trascina i file qui o clicca per selezionarli
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, PDF (max {maxFiles} file)
            </p>
          </div>
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        multiple
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded-md text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};