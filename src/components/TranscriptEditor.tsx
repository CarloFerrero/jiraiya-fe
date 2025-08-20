import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Wand2, RotateCcw, Copy, Check, Loader } from 'lucide-react';
import { cleanOCRText, estimateTokens } from '@/utils/ocr';
import { cn } from '@/lib/utils';

interface TranscriptEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  text,
  onTextChange,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCleanText = () => {
    const cleanedText = cleanOCRText(text);
    onTextChange(cleanedText);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (canAnalyze && !isAnalyzing) {
        onAnalyze();
      }
    }
  };

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedTokens = estimateTokens(text);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          ✍️ Trascrizione
        </h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanText}
            disabled={!text.trim()}
            className="hover:bg-accent"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Pulizia OCR
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyText}
            disabled={!text.trim()}
            className="hover:bg-accent"
          >
            {isCopied ? (
              <Check className="w-3 h-3 mr-1 text-success" />
            ) : (
              <Copy className="w-3 h-3 mr-1" />
            )}
            {isCopied ? 'Copiato!' : 'Copia'}
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4 bg-card">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Il testo OCR unito apparirà qui. Puoi modificarlo prima di inviarlo a Jiraiya Sensei per l'analisi."
          className="min-h-[200px] resize-none border-0 p-0 focus-visible:ring-0 bg-transparent"
          style={{ height: 'auto' }}
        />
      </div>

      {/* Statistics */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>Caratteri:</span>
          <Badge variant="secondary" className="font-mono">
            {characterCount.toLocaleString()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <span>Parole:</span>
          <Badge variant="secondary" className="font-mono">
            {wordCount.toLocaleString()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <span>Token stimati:</span>
          <Badge 
            variant="secondary" 
            className={cn(
              "font-mono",
              estimatedTokens > 4000 && "bg-destructive/20 text-destructive"
            )}
          >
            ~{estimatedTokens.toLocaleString()}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Analyze Button */}
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="bg-gradient-sensei hover:shadow-warm transition-all duration-300 text-lg py-6 px-8"
          size="lg"
        >
          {isAnalyzing ? (
            <Loader className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5 mr-2" />
          )}
          {isAnalyzing ? 'Jiraiya Sensei sta analizzando...' : '🧙‍♂️ Analizza con Sensei'}
        </Button>
        
        {!canAnalyze && (
          <p className="text-sm text-muted-foreground text-center">
            Inserisci del testo per attivare l'analisi
          </p>
        )}
        
        {canAnalyze && !isAnalyzing && (
          <p className="text-xs text-muted-foreground text-center">
            💡 Suggerimento: usa Cmd/Ctrl + Enter per analizzare rapidamente
          </p>
        )}
      </div>
    </div>
  );
};