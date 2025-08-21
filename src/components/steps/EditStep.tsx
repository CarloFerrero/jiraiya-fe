import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Wand2, FileText, Check, AlertCircle, Copy } from 'lucide-react';
import { TranscriptEditor } from '../TranscriptEditor';
import { TextFormattingToolbar } from '../TextFormattingToolbar';

interface EditStepProps {
  mergedText: string;
  onTextChange: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export const EditStep: React.FC<EditStepProps> = ({
  mergedText,
  onTextChange,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(mergedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  const wordCount = mergedText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = mergedText.length;
  const hasText = mergedText.trim().length > 0;
  const isTextReady = hasText && wordCount >= 10; // Minimo per analisi significativa

  // Status intelligente del testo
  const getTextStatus = () => {
    if (!hasText) return { 
      icon: AlertCircle, 
      text: 'Nessun testo da modificare', 
      color: 'text-muted-foreground',
      action: 'Torna al caricamento per aggiungere pagine'
    };
    if (wordCount < 10) return { 
      icon: AlertCircle, 
      text: 'Testo troppo breve', 
      color: 'text-orange-600',
      action: 'Aggiungi almeno 10 parole per l\'analisi'
    };
    if (isAnalyzing) return { 
      icon: Wand2, 
      text: 'Jiraiya Sensei sta analizzando...', 
      color: 'text-primary',
      action: 'Attendere il completamento'
    };
    return { 
      icon: Check, 
      text: 'Testo pronto per l\'analisi', 
      color: 'text-green-600',
      action: 'Modifica se necessario, poi analizza'
    };
  };

  const status = getTextStatus();
  const StatusIcon = status.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-card/50 rounded-lg px-4 py-3 border">
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-4 h-4 ${status.color} ${isAnalyzing ? 'animate-spin' : ''}`} />
          <div>
            <span className={`text-sm font-medium ${status.color}`}>
              {status.text}
            </span>
            <div className="hidden sm:block text-xs text-muted-foreground mt-0.5">
              {status.action}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {hasText && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="hidden md:flex items-center gap-1">
              <span>{charCount}</span>
              <span>caratteri</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{wordCount}</span>
              <span className="hidden sm:inline">parole</span>
              <span className="sm:hidden">p</span>
            </div>
          </div>
        )}
      </div>

      {/* Barra di Formattazione */}
      <TextFormattingToolbar
        text={mergedText}
        onTextChange={onTextChange}
        onCopy={handleCopyText}
        isCopied={isCopied}
      />

      {/* Editor */}
      <Card className="flex-1">
        <CardContent className="p-3">
          <TranscriptEditor
            text={mergedText}
            onTextChange={onTextChange}
            onAnalyze={onAnalyze}
            isAnalyzing={isAnalyzing}
            canAnalyze={canAnalyze}
          />
        </CardContent>
      </Card>

      {/* Status Info */}
      <div className="pt-3 text-center">
        <div className="text-sm text-muted-foreground">
          {hasText && (
            <div className="flex items-center justify-center gap-4">
              <span>{wordCount} parole</span>
              <span>•</span>
              <span>{isTextReady ? 'Pronto per analisi' : 'Troppo breve (min. 10 parole)'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};