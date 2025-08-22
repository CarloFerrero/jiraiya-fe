import React, { useRef, useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { TextFormattingToolbar } from './TextFormattingToolbar';
import { cn } from '@/lib/utils';

interface TranscriptEditorProps {
  text: string;
  onChange: (text: string) => void;
  isEditing?: boolean;
  className?: string;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  text,
  onChange,
  isEditing = true,
  className
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Auto-resize per la textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 400)}px`;
    }
  }, [text]);

  // Funzione per copiare il testo
  const handleCopy = async () => {
    if (!text.trim()) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset dopo 2 secondi
    } catch (error) {
      console.error('Errore durante la copia:', error);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar di formattazione - visibile solo in modalità editing */}
      {isEditing && text.trim() && (
        <div className="mb-2">
          <TextFormattingToolbar
            text={text}
            onTextChange={onChange}
            onCopy={handleCopy}
            isCopied={isCopied}
          />
        </div>
      )}
      
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Il testo OCR apparirà qui dopo l'elaborazione..."
        className="flex-1 resize-none border-0 focus-visible:ring-0 text-sm leading-relaxed min-h-[320px] h-full"
        disabled={!isEditing}
        readOnly={!isEditing}
      />
      
      {/* Footer con statistiche */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
        <div className="flex items-center gap-4">
          <span>{characterCount} caratteri</span>
          <span>{wordCount} parole</span>
        </div>
      </div>
    </div>
  );
};