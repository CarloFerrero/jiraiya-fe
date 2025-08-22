import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Type,
  RotateCcw,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Scissors,
  Copy,
  Check,
  ChevronDown,
  Zap,
  FileText,
  Hash,
  Quote,
  Minus,
  Plus
} from 'lucide-react';
import {
  formatText,
  toLowerCase,
  toUpperCase,
  capitalizeSentences,
  capitalizeWords,
  removeExtraSpaces,
  removePunctuation,
  removeNumbers,
  removeMultipleEmptyLines,
  fixPunctuationSpacing,
  toTitleCase,
  removeEmptyLines,
  normalizeQuotes,
  removeControlCharacters,
  formatForReadability,
  removeDuplicateWords,
  countWords,
  countCharacters,
  countSentences,
  estimateTokens
} from '@/utils/textFormatting';

interface TextFormattingToolbarProps {
  text: string;
  onTextChange: (text: string) => void;
  onCopy?: () => void;
  isCopied?: boolean;
}

export const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
  text,
  onTextChange,
  onCopy,
  isCopied = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFormat = async (formatter: (text: string) => string, label: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simula un piccolo delay per feedback visivo
      await new Promise(resolve => setTimeout(resolve, 100));
      const formattedText = formatter(text);
      onTextChange(formattedText);
    } catch (error) {
      console.error(`Error applying ${label}:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!text.trim() || !onCopy) return;
    onCopy();
  };

  const textStats = {
    words: countWords(text),
    characters: countCharacters(text),
    sentences: countSentences(text),
    tokens: estimateTokens(text)
  };

  const formattingOptions = [
    {
      label: 'Formattazione Base',
      items: [
        { label: 'Formatta Testo', icon: Zap, action: () => handleFormat(formatText, 'formattazione base') },
        { label: 'Rimuovi Spazi Extra', icon: Scissors, action: () => handleFormat(removeExtraSpaces, 'rimozione spazi') },
        { label: 'Normalizza Virgolette', icon: Quote, action: () => handleFormat(normalizeQuotes, 'normalizzazione virgolette') },
        { label: 'Rimuovi Righe Vuote', icon: Minus, action: () => handleFormat(removeEmptyLines, 'rimozione righe vuote') },
      ]
    },
    {
      label: 'Trasformazioni Testo',
      items: [
        { label: 'Tutto Maiuscolo', icon: Bold, action: () => handleFormat(toUpperCase, 'maiuscolo') },
        { label: 'Tutto Minuscolo', icon: Italic, action: () => handleFormat(toLowerCase, 'minuscolo') },
        { label: 'Capitalizza Frasi', icon: AlignLeft, action: () => handleFormat(capitalizeSentences, 'capitalizzazione frasi') },
        { label: 'Capitalizza Parole', icon: AlignCenter, action: () => handleFormat(capitalizeWords, 'capitalizzazione parole') },
        { label: 'Formato Titolo', icon: AlignRight, action: () => handleFormat(toTitleCase, 'formato titolo') },
      ]
    },
    {
      label: 'Pulizia Avanzata',
      items: [
        { label: 'Rimuovi Punteggiatura', icon: Trash2, action: () => handleFormat(removePunctuation, 'rimozione punteggiatura') },
        { label: 'Rimuovi Numeri', icon: Hash, action: () => handleFormat(removeNumbers, 'rimozione numeri') },
        { label: 'Rimuovi Caratteri Controllo', icon: FileText, action: () => handleFormat(removeControlCharacters, 'rimozione caratteri controllo') },
        { label: 'Rimuovi Parole Duplicate', icon: Copy, action: () => handleFormat(removeDuplicateWords, 'rimozione parole duplicate') },
      ]
    },
    {
      label: 'Formattazione Leggibilità',
      items: [
        { label: 'Formatta per Leggibilità', icon: Type, action: () => handleFormat(formatForReadability, 'formattazione leggibilità') },
        { label: 'Correggi Spazi Punteggiatura', icon: Plus, action: () => handleFormat(fixPunctuationSpacing, 'correzione spazi punteggiatura') },
        { label: 'Rimuovi Righe Multiple', icon: Minus, action: () => handleFormat(removeMultipleEmptyLines, 'rimozione righe multiple') },
      ]
    }
  ];

  return (
    <div className="p-2 bg-muted/30 rounded-md border">
      {/* Mobile: Stacked layout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* Header con titolo e stats */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Type className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground hidden sm:inline">Formattazione Testo</span>
            <span className="text-xs text-muted-foreground sm:hidden">Formato</span>
            {isProcessing && (
              <div className="animate-spin rounded-full h-2 w-2 border-b border-primary" />
            )}
          </div>

          {/* Statistiche - sempre visibili su mobile */}
          {text.trim() && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="hidden sm:inline">{textStats.characters} caratteri</span>
              <span className="sm:hidden">{textStats.characters}c</span>
              <span>•</span>
              <span className="hidden sm:inline">~{textStats.tokens} token</span>
              <span className="sm:hidden">~{textStats.tokens}t</span>
            </div>
          )}
        </div>

        {/* Controlli */}
        <div className="flex items-center gap-1 w-full sm:w-auto">
          {/* Pulsante rapido per formattazione base */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat(formatText, 'formattazione base')}
            disabled={!text.trim() || isProcessing}
            className="h-7 px-2 text-xs flex-1 sm:flex-none"
          >
            <Zap className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Formatta</span>
            <span className="sm:hidden">Auto</span>
          </Button>

          {/* Pulsante copia */}
          {onCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!text.trim()}
              className="h-7 px-2 text-xs flex-shrink-0"
            >
              {isCopied ? (
                <Check className="w-3 h-3 mr-1 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              <span className="hidden sm:inline">{isCopied ? 'Copiato!' : 'Copia'}</span>
              <span className="sm:hidden">{isCopied ? '✓' : ''}</span>
            </Button>
          )}

          {/* Menu a tendina per opzioni avanzate */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={!text.trim() || isProcessing}
                className="h-7 px-2 text-xs flex-shrink-0"
              >
                <span className="hidden sm:inline">Opzioni</span>
                <span className="sm:hidden">+</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {formattingOptions.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                    {section.label}
                  </DropdownMenuLabel>
                  {section.items.map((item, itemIndex) => (
                    <DropdownMenuItem
                      key={itemIndex}
                      onClick={item.action}
                      disabled={!text.trim() || isProcessing}
                      className="flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <item.icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                  {sectionIndex < formattingOptions.length - 1 && (
                    <DropdownMenuSeparator />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
