import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Wand2,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Type,
  FileText
} from 'lucide-react';
import { cleanOCRText, estimateTokens } from '@/utils/ocr';
import { cn } from '@/lib/utils';
import { FullScreenEditor } from './FullScreenEditor';

interface TranscriptEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  fullScreen?: boolean;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  text,
  onTextChange,
  onAnalyze,
  isAnalyzing,
  canAnalyze,
  fullScreen = false
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
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

  // Auto-resize per la textarea normale
  useEffect(() => {
    if (textareaRef.current && !fullScreen) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 400)}px`;
    }
  }, [text, fullScreen]);

  const getQualityBadge = () => {
    if (wordCount < 10) return <Badge variant="destructive" className="text-xs">Troppo breve</Badge>;
    if (wordCount < 50) return <Badge variant="secondary" className="text-xs">Breve</Badge>;
    if (wordCount < 200) return <Badge variant="default" className="text-xs">Ideale</Badge>;
    return <Badge variant="outline" className="text-xs">Lungo</Badge>;
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header compatto */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Type className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Editor di Testo</span>
            {text.trim() && getQualityBadge()}
          </div>

          {/* Toolbar compatto */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCleanText}
              disabled={!text.trim()}
              title="Formatta testo"
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyText}
              disabled={!text.trim()}
              title="Copia tutto"
              className="h-8 w-8 p-0"
            >
              {isCopied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>

            <div className="w-px h-4 bg-border mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullScreenOpen(true)}
              title="Editor fullscreen"
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Stats rapide */}
        {text.trim() && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{wordCount} parole</span>
            </div>
            <div className="hidden sm:block">{characterCount} caratteri</div>
            <div className="hidden md:block">{estimatedTokens} token</div>
          </div>
        )}

        {/* Editor area */}
        <div className={cn(
          "border border-border rounded-lg bg-card overflow-hidden",
          fullScreen ? "h-[calc(100vh-20rem)]" : ""
        )}>
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Il testo OCR unito apparirà qui. Puoi modificarlo o cliccare sull'icona fullscreen per un editing avanzato."
            className={cn(
              "resize-none border-0 p-4 focus-visible:ring-0 bg-transparent text-sm leading-relaxed",
              fullScreen
                ? "min-h-[calc(100vh-25rem)]"
                : "min-h-[200px] max-h-[400px]"
            )}
            style={{ height: fullScreen ? '100%' : 'auto' }}
          />
        </div>

        {/* Quick actions */}
        {text.trim() && canAnalyze && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              💡 Usa <kbd className="px-1 py-0.5 text-xs border rounded">Ctrl+Enter</kbd> per analizzare
            </div>

            <Button
              onClick={onAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              size="sm"
              variant="secondary"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
                  <span className="hidden sm:inline">Analizzando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3 h-3 mr-2" />
                  <span className="hidden sm:inline">Analizza con Jiraiya</span>
                  <span className="sm:hidden">Analizza</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Modal FullScreen */}
      <FullScreenEditor
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        text={text}
        onSave={onTextChange}
        onAnalyze={onAnalyze}
        isAnalyzing={isAnalyzing}
        canAnalyze={canAnalyze}
      />
    </>
  );
};