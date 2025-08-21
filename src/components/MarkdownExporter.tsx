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

    const markdown = `# 📚 Analisi Letteraria di Jiraiya Sensei

## ✍️ Trascrizione

${transcription}

---

## 📖 Sintesi della Trama

${results.plotSummary}

---

## 🔍 Analisi Simbolica

### Elementi Simbolici Chiave

${results.symbolicAnalysis.keyElements.map(element => `
#### ${element.element}

**Nel testo:** "${element.description}"

**Significato simbolico:** ${element.symbolicMeaning}

**Riferimenti culturali:** ${element.culturalReferences}
`).join('\n')}

---

## 🧠 Significato Profondo

### Temi Filosofici
${results.deepMeaning.philosophicalThemes.map(theme => `- ${theme}`).join('\n')}

### Interpretazione Esistenziale
${results.deepMeaning.existentialInterpretation}

### Verità Universali
${results.deepMeaning.universalTruths}

---

## 💡 Lezione Personale

### Insight Principale
${results.personalLesson.mainInsight}

### Applicazioni Pratiche
${results.personalLesson.practicalApplications.map((app, index) => `${index + 1}. ${app}`).join('\n')}

### Domanda Riflessiva
> ${results.personalLesson.reflectiveQuestion}

_Spazio per la tua riflessione personale:_

---

*Analisi generata da Jiraiya Sensei - Critico Letterario e Simbolico*  
*${new Date().toLocaleDateString('it-IT')}*
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
    a.download = `jiraiya-sensei-analisi-letteraria-${new Date().toISOString().split('T')[0]}.md`;
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
          size="sm"
        >
          <Download className="w-2 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl flex flex-col h-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📋 Esporta Analisi Letteraria Completa
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
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            
            <Button 
              onClick={handleDownload}
              className="bg-gradient-sensei hover:shadow-warm"
            >
              <Download className="w-4 h-4 mr-2" />
              Scarica Analisi
            </Button>
          </div>
          
          <Textarea
            value={generateMarkdown()}
            readOnly
            className="flex-1 font-mono text-xs resize-none"
            placeholder="L'analisi letteraria completa apparirà qui..."
          />
          
          <p className="text-xs text-muted-foreground text-center">
            💡 Puoi copiare l'analisi letteraria o scaricarla come file .md
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};