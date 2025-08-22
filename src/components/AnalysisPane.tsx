import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Brain,
  FileText,
  Play,
  Copy,
  Download,
  Edit3,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Settings,
  BookOpen,
  Quote,
  Hash,
  List,
  CheckSquare,
  Square
} from 'lucide-react';
import { TranscriptEditor } from './TranscriptEditor';
import type { AiResults, Methodology } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Funzione per convertire JSON in markdown
const convertJsonToMarkdown = (jsonData: any): string => {
  let markdown = '# 📖 Analisi Letteraria\n\n';
  
  // Trascrizione
  if (jsonData.transcription) {
    markdown += `## 📝 Trascrizione\n\n${jsonData.transcription}\n\n`;
  }
  
  // Riassunto della trama
  if (jsonData.plotSummary) {
    markdown += `## 📚 Riassunto della Trama\n\n${jsonData.plotSummary}\n\n`;
  }
  
  // Analisi simbolica
  if (jsonData.symbolicAnalysis && jsonData.symbolicAnalysis.keyElements) {
    markdown += `## 🔍 Analisi Simbolica\n\n`;
    jsonData.symbolicAnalysis.keyElements.forEach((element: any, index: number) => {
      markdown += `### ${index + 1}. ${element.element}\n\n`;
      markdown += `**Descrizione**: ${element.description}\n\n`;
      markdown += `**Significato Simbolico**: ${element.symbolicMeaning}\n\n`;
      if (element.culturalReferences) {
        markdown += `**Riferimenti Culturali**: ${element.culturalReferences}\n\n`;
      }
      markdown += `---\n\n`;
    });
  }
  
  // Significato profondo
  if (jsonData.deepMeaning) {
    markdown += `## 🧠 Significato Profondo\n\n`;
    
    if (jsonData.deepMeaning.philosophicalThemes) {
      markdown += `### Temi Filosofici\n\n`;
      if (Array.isArray(jsonData.deepMeaning.philosophicalThemes)) {
        jsonData.deepMeaning.philosophicalThemes.forEach((theme: string) => {
          markdown += `- ${theme}\n`;
        });
      } else {
        markdown += `${jsonData.deepMeaning.philosophicalThemes}\n`;
      }
      markdown += `\n`;
    }
    
    if (jsonData.deepMeaning.existentialInterpretation) {
      markdown += `### Interpretazione Esistenziale\n\n${jsonData.deepMeaning.existentialInterpretation}\n\n`;
    }
    
    if (jsonData.deepMeaning.universalTruths) {
      markdown += `### Verità Universali\n\n${jsonData.deepMeaning.universalTruths}\n\n`;
    }
  }
  
  // Lezione personale
  if (jsonData.personalLesson) {
    markdown += `## 💡 Lezione Personale\n\n`;
    
    if (jsonData.personalLesson.mainInsight) {
      markdown += `### Insight Principale\n\n${jsonData.personalLesson.mainInsight}\n\n`;
    }
    
    if (jsonData.personalLesson.practicalApplications) {
      markdown += `### Applicazioni Pratiche\n\n`;
      if (Array.isArray(jsonData.personalLesson.practicalApplications)) {
        jsonData.personalLesson.practicalApplications.forEach((app: string, index: number) => {
          markdown += `${index + 1}. ${app}\n`;
        });
      } else {
        markdown += `${jsonData.personalLesson.practicalApplications}\n`;
      }
      markdown += `\n`;
    }
    
    if (jsonData.personalLesson.reflectiveQuestion) {
      markdown += `### Domanda Riflessiva\n\n> ${jsonData.personalLesson.reflectiveQuestion}\n\n`;
    }
  }
  
  return markdown;
};

interface AnalysisPaneProps {
  mergedText: string;
  aiResults: AiResults | null;
  isCallingAI: boolean;
  onTextChange: (text: string) => void;
  onAnalyze: (methodologyId?: string) => void;
  onRetry: () => void;
  canAnalyze: boolean;
  methodologies: Methodology[];
  selectedMethodologyId: string;
  onMethodologyChange: (methodologyId: string) => void;
}

export const AnalysisPane: React.FC<AnalysisPaneProps> = ({
  mergedText,
  aiResults,
  isCallingAI,
  onTextChange,
  onAnalyze,
  onRetry,
  canAnalyze,
  methodologies,
  selectedMethodologyId,
  onMethodologyChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('transcription');

  const selectedMethodology = methodologies.find(m => m.id === selectedMethodologyId) || methodologies[0];

  const handleCopyMarkdown = () => {
    if (aiResults?.markdownAnalysis) {
      navigator.clipboard.writeText(aiResults.markdownAnalysis);
    }
  };

  const handleAnalyze = () => {
    onAnalyze(selectedMethodologyId);
  };

  // Componenti personalizzati per ReactMarkdown
  const markdownComponents = {
    // Headings con stili migliorati
    h1: ({ children, ...props }: any) => (
      <h1 className="text-2xl font-bold text-foreground mb-4 mt-6 border-b border-border pb-2" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl font-semibold text-foreground mb-3 mt-5" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-lg font-medium text-foreground mb-2 mt-4" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 className="text-base font-medium text-foreground mb-2 mt-3" {...props}>
        {children}
      </h4>
    ),

    // Paragrafi con spaziatura migliorata
    p: ({ children, ...props }: any) => (
      <p className="text-sm leading-relaxed text-foreground mb-4 last:mb-0" {...props}>
        {children}
      </p>
    ),

    // Liste con icone
    ul: ({ children, ...props }: any) => (
      <ul className="space-y-2 mb-4 ml-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="space-y-2 mb-4 ml-4 list-decimal" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-sm text-foreground flex items-start gap-2" {...props}>
        <span className="text-primary mt-1">•</span>
        <span>{children}</span>
      </li>
    ),

    // Blockquote eleganti
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-primary/30 bg-muted/30 pl-4 py-3 italic text-muted-foreground rounded-r mb-4" {...props}>
        <div className="flex items-start gap-2">
          <Quote className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>{children}</div>
        </div>
      </blockquote>
    ),

    // Code blocks migliorati
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline ? (
        <div className="bg-muted border rounded-lg p-4 mb-4 overflow-x-auto">
          <code className="text-xs font-mono text-foreground" {...props}>
            {children}
          </code>
        </div>
      ) : (
        <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground" {...props}>
          {children}
        </code>
      );
    },

    // Link con stili
    a: ({ children, href, ...props }: any) => (
      <a
        href={href}
        className="text-primary hover:text-primary/80 underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),

    // Strong e em con stili
    strong: ({ children, ...props }: any) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em className="italic text-foreground" {...props}>
        {children}
      </em>
    ),

    // Tabelle (GFM)
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-border" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-muted" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: any) => (
      <tbody {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }: any) => (
      <tr className="border-b border-border" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }: any) => (
      <th className="border border-border px-3 py-2 text-left text-sm font-medium text-foreground" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="border border-border px-3 py-2 text-sm text-foreground" {...props}>
        {children}
      </td>
    ),

    // Task lists (GFM)
    input: ({ checked, ...props }: any) => (
      <input
        type="checkbox"
        checked={checked}
        readOnly
        className="mr-2 mt-1"
        {...props}
      />
    ),

    // Horizontal rule
    hr: ({ ...props }: any) => (
      <hr className="border-t border-border my-6" {...props} />
    ),
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Analisi</h2>
        </div>
        <div className="flex items-center gap-2">
          {aiResults && (
            <Badge variant="outline" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Analisi completata
            </Badge>
          )}
          {isCallingAI && (
            <Badge variant="secondary" className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Analizzando...
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transcription" className="text-xs">
            <FileText className="w-3 h-3 mr-1" />
            Trascrizione
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs" disabled={!aiResults}>
            <Brain className="w-3 h-3 mr-1" />
            Analisi AI
          </TabsTrigger>
        </TabsList>

        {/* Transcription Tab */}
        <TabsContent value="transcription" className="flex-1 flex flex-col space-y-3 mt-4">
          {/* Methodology and Analysis Controls - Responsive */}
          <div className="space-y-3">
            {/* Mobile: Stacked layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/30 rounded-lg border">
              {/* Methodology Selector */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                  <Settings className="w-3 h-3" />
                  <span className="hidden sm:inline">Metodologia:</span>
                  <span className="sm:hidden">Metodo:</span>
                </div>
                <Select value={selectedMethodologyId} onValueChange={onMethodologyChange}>
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="Seleziona metodologia" />
                  </SelectTrigger>
                  <SelectContent>
                    {methodologies.map((methodology) => (
                      <SelectItem key={methodology.id} value={methodology.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{methodology.name}</span>
                          {methodology.description && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {methodology.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Analysis Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Analysis Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze || isCallingAI}
                  size="sm"
                  className="h-8 px-3 text-xs flex-1 sm:flex-none"
                >
                  {isCallingAI ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      <span className="hidden sm:inline">Analizzando...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Analisi AI</span>
                      <span className="sm:hidden">Analisi</span>
                    </>
                  )}
                </Button>

                {/* Retry Button */}
                {aiResults && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRetry}
                    disabled={isCallingAI}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Editor Card */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Editor Trascrizione
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-8 w-8 p-0"
                    title={isEditing ? "Modalità lettura" : "Modalità modifica"}
                  >
                    {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              <TranscriptEditor
                text={mergedText}
                onChange={onTextChange}
                isEditing={isEditing}
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 flex flex-col space-y-4 mt-4">
          {aiResults ? (
            <>
              <CardContent className="pt-0 overflow-y-auto max-h-[calc(100vh-200px)] analysis-content-mobile p-0">
                {(() => {
                  // Check if aiResults exists first
                  if (!aiResults) {
                    return (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Nessuna analisi disponibile</p>
                        <p className="text-xs mt-2">Clicca "Analisi AI" per iniziare</p>
                      </div>
                    );
                  }

                  // Ensure we have a string
                  let markdownContent = aiResults.markdownAnalysis;

                  // Se il contenuto è JSON, convertilo in markdown
                  if (markdownContent && typeof markdownContent === 'string') {
                    try {
                      // Prova a parsare come JSON
                      const jsonData = JSON.parse(markdownContent);
                      
                      // Se è JSON valido, convertilo in markdown
                      if (jsonData && typeof jsonData === 'object') {
                        markdownContent = convertJsonToMarkdown(jsonData);
                      }
                    } catch (e) {
                      // Se non è JSON valido, usa il contenuto come è (markdown)
                      console.log('Contenuto non è JSON, usando come markdown');
                    }
                  }

                  if (markdownContent && typeof markdownContent === 'string') {
                    return (
                      <div className="space-y-6">
                        {/* Header con gradiente */}
                        <div className="relative overflow-hidden rounded-lg">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 opacity-90"></div>
                          <div className="relative p-6 text-white">
                            {/* Source e metadata */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Brain className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">Analisi AI</div>
                                <div className="text-xs opacity-80">
                                  {selectedMethodology.name} • {new Date().toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Titolo */}
                            <h1 className="text-2xl font-bold mb-2">
                              Analisi Letteraria Completa
                            </h1>

                            {/* Descrizione */}
                            <p className="text-sm opacity-90 leading-relaxed">
                              Analisi approfondita basata su {selectedMethodology.name.toLowerCase()},
                              con interpretazioni simboliche, temi filosofici e lezioni personali.
                            </p>
                          </div>
                        </div>

                        {/* Contenuto dell'analisi */}
                        <div className="bg-card border rounded-lg p-6 ">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {markdownContent}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Nessun contenuto di analisi disponibile</p>
                      </div>
                    );
                  }
                })()}
              </CardContent>


            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <CardContent className="text-center py-8">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-sm font-medium mb-2">Nessuna analisi disponibile</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Esegui l'analisi AI per visualizzare i risultati
                </p>
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  size="sm"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Esegui Analisi AI
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
