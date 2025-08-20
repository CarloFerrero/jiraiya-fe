import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Download, Copy, Check } from 'lucide-react';
import type { AiResults } from '@/types';

interface MarkdownExporterProps {
  results: AiResults | null;
  transcription: string;
}

export const MarkdownExporter: React.FC<MarkdownExporterProps> = ({ 
  results, 
  transcription 
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const generateMarkdown = (): string => {
    if (!results) return '';

    const markdown = `# 📚 Analisi Jiraiya Sensei

## ✍️ Trascrizione

${transcription}

---

## 📝 Sintesi

### 🐦 Tweet
${results.summaries.tweet}

### 📄 Paragrafo
${results.summaries.paragraph}

### 📋 Schema Puntato
${results.summaries.bullets.map(bullet => `- ${bullet}`).join('\n')}

---

## 🧠 Quiz di Comprensione

${results.quiz.map((q, index) => `
### Domanda ${index + 1}
**${q.question}**

${q.options.map((option, optIndex) => `${String.fromCharCode(65 + optIndex)}. ${option}`).join('\n')}

**Risposta:** ${String.fromCharCode(65 + q.answerIndex)} - ${q.options[q.answerIndex]}
**Spiegazione:** ${q.explanation}
`).join('\n')}

---

## 🤔 Riflessione Socratica

> ${results.reflection}

_Spazio per la tua riflessione personale:_

---

## 🗃️ Flashcard

${results.flashcards.map((card, index) => `
### Card ${index + 1}
**Q:** ${card.q}
**A:** ${card.a}
`).join('\n')}

---

*Generato da Jiraiya Sensei - ${new Date().toLocaleDateString('it-IT')}*
`;

    return markdown.trim();
  };

  const handleCopy = async () => {
    try {
      const markdown = generateMarkdown();
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy markdown:', error);
    }
  };

  const handleDownload = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jiraiya-sensei-analisi-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!results) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-sensei hover:shadow-warm transition-all duration-300"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          📋 Esporta Markdown
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📋 Esporta Analisi Completa
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex gap-2">
            <Button 
              onClick={handleCopy}
              variant="outline"
              className="hover:bg-accent"
            >
              {isCopied ? (
                <Check className="w-4 h-4 mr-2 text-success" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {isCopied ? 'Copiato!' : 'Copia Markdown'}
            </Button>
            
            <Button 
              onClick={handleDownload}
              className="bg-gradient-sensei hover:shadow-warm"
            >
              <Download className="w-4 h-4 mr-2" />
              Scarica File
            </Button>
          </div>
          
          <Textarea
            value={generateMarkdown()}
            readOnly
            className="flex-1 font-mono text-xs resize-none"
            placeholder="Il markdown dell'analisi apparirà qui..."
          />
          
          <p className="text-xs text-muted-foreground text-center">
            💡 Puoi copiare il markdown o scaricarlo come file .md
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};