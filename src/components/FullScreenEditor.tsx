import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Maximize2, 
  X, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  Undo2,
  Redo2,
  Type,
  FileText,
  Wand2
} from 'lucide-react';
import { cleanOCRText, estimateTokens } from '@/utils/ocr';
import { cn } from '@/lib/utils';
import { DialogClose } from '@radix-ui/react-dialog';

interface FullScreenEditorProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  onSave: (text: string) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  canAnalyze?: boolean;
}

export const FullScreenEditor: React.FC<FullScreenEditorProps> = ({
  isOpen,
  onClose,
  text: initialText,
  onSave,
  onAnalyze,
  isAnalyzing = false,
  canAnalyze = false
}) => {
  const [text, setText] = useState(initialText);
  const [history, setHistory] = useState<string[]>([initialText]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sincronizza il testo quando il modal si apre
  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setHistory([initialText]);
      setHistoryIndex(0);
      setHasChanges(false);
    }
  }, [isOpen, initialText]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, window.innerHeight - 300)}px`;
    }
  }, [text]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    setHasChanges(newText !== initialText);
    
    // Aggiungi alla history se diverso dall'ultimo elemento
    if (newText !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
      setHasChanges(history[newIndex] !== initialText);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
      setHasChanges(history[newIndex] !== initialText);
    }
  };

  const handleCleanText = () => {
    const cleanedText = cleanOCRText(text);
    handleTextChange(cleanedText);
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

  const handleSave = () => {
    onSave(text);
    setHasChanges(false);
  };

  const handleSaveAndClose = () => {
    handleSave();
    onClose();
  };

  const handleAnalyze = () => {
    if (hasChanges) {
      handleSave();
    }
    onAnalyze?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          handleSave();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (canAnalyze && !isAnalyzing) {
            handleAnalyze();
          }
          break;
      }
    }
  };

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.split('\n').length;
  const estimatedTokens = estimateTokens(text);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Editor Avanzato
              {hasChanges && <Badge variant="secondary" className="text-xs">Modificato</Badge>}
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              {/* Toolbar */}
              <div className="flex items-center gap-1 mr-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  title="Annulla (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  title="Ripeti (Ctrl+Shift+Z)"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
                
                <div className="w-px h-4 bg-border mx-1" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCleanText}
                  disabled={!text.trim()}
                  title="Formatta testo"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyText}
                  disabled={!text.trim()}
                  title="Copia tutto"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{wordCount} parole</span>
            </div>
            <div>{characterCount} caratteri</div>
            <div>{lineCount} righe</div>
            <div className="hidden sm:block">{estimatedTokens} token stimati</div>
            
            {/* Quality indicator */}
            <div className="ml-auto">
              {wordCount < 10 ? (
                <Badge variant="destructive" className="text-xs">Troppo breve</Badge>
              ) : wordCount < 50 ? (
                <Badge variant="secondary" className="text-xs">Breve</Badge>
              ) : wordCount < 200 ? (
                <Badge variant="default" className="text-xs">Ideale</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Lungo</Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Editor Area */}
        <div className="flex-1 p-6 overflow-hidden">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi o modifica il tuo testo qui. Usa Ctrl+S per salvare, Ctrl+Z per annullare, Ctrl+Enter per analizzare..."
            className={cn(
              "w-full h-full resize-none border-0 p-4 text-sm leading-relaxed",
              "focus-visible:ring-0 bg-background rounded-lg border",
              "font-mono" // Font monospace per better editing
            )}
            style={{ 
              minHeight: 'calc(100% - 2rem)',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
            }}
          />
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground">
              💡 Ctrl+S per salvare • Ctrl+Z per annullare • Ctrl+Enter per analizzare
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                size="sm"
              >
                Annulla
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={!hasChanges}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Salva
              </Button>

              {onAnalyze && (
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze || isAnalyzing || wordCount < 10}
                  size="sm"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Analizzando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Salva e Analizza
                    </>
                  )}
                </Button>
              )}
              
              <Button
                onClick={handleSaveAndClose}
                disabled={!hasChanges && !text.trim()}
                size="sm"
              >
                Salva e Chiudi
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
      <DialogClose asChild></DialogClose>
    </Dialog>
  );
};