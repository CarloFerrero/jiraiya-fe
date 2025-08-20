import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, BookOpen, Eye, Brain, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AiResults } from '@/types';
import { useState } from 'react';

interface LiteraryAnalysisTabsProps {
  results: AiResults;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const LiteraryAnalysisTabs: React.FC<LiteraryAnalysisTabsProps> = ({ 
  results, 
  activeTab, 
  onTabChange 
}) => {
  const [personalReflection, setPersonalReflection] = useState('');
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  const handleCopy = async (text: string, itemKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [itemKey]: true }));
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [itemKey]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const CopyButton: React.FC<{ text: string; itemKey: string }> = ({ text, itemKey }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleCopy(text, itemKey)}
      className="h-8 w-8 p-0 hover:bg-accent"
    >
      {copiedItems[itemKey] ? (
        <Check className="w-3 h-3 text-success" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">📖 Analisi Letteraria e Simbolica</h2>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="plot" className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            Trama
          </TabsTrigger>
          <TabsTrigger value="symbolic" className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            Simboli
          </TabsTrigger>
          <TabsTrigger value="meaning" className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            Significato
          </TabsTrigger>
          <TabsTrigger value="lesson" className="flex items-center gap-1">
            <Lightbulb className="w-4 h-4" />
            Lezione
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plot" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Sintesi della Trama
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {results.plotSummary.split(' ').length} parole
                  </Badge>
                  <CopyButton text={results.plotSummary} itemKey="plot" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {results.plotSummary}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symbolic" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🔍 Elementi Simbolici Chiave
              </h3>
              <Badge variant="secondary">
                {results.symbolicAnalysis.keyElements.length} elementi
              </Badge>
            </div>
            
            {results.symbolicAnalysis.keyElements.map((element, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {element.element}
                    </CardTitle>
                    <CopyButton 
                      text={`${element.element}: ${element.symbolicMeaning}\n\nDescrizione: ${element.description}\n\nRiferimenti culturali: ${element.culturalReferences}`} 
                      itemKey={`element-${index}`} 
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Nel testo:
                    </h4>
                    <p className="text-sm italic">
                      "{element.description}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Significato simbolico:
                    </h4>
                    <p className="text-sm leading-relaxed">
                      {element.symbolicMeaning}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Riferimenti culturali:
                    </h4>
                    <p className="text-sm text-accent leading-relaxed">
                      {element.culturalReferences}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meaning" className="space-y-4">
          {/* Philosophical Themes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  🧠 Temi Filosofici
                </CardTitle>
                <CopyButton 
                  text={results.deepMeaning.philosophicalThemes.join(', ')} 
                  itemKey="themes" 
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.deepMeaning.philosophicalThemes.map((theme, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5">
                    {theme}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Existential Interpretation */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  ✨ Interpretazione Esistenziale
                </CardTitle>
                <CopyButton text={results.deepMeaning.existentialInterpretation} itemKey="existential" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {results.deepMeaning.existentialInterpretation}
              </p>
            </CardContent>
          </Card>

          {/* Universal Truths */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  🌟 Verità Universali
                </CardTitle>
                <CopyButton text={results.deepMeaning.universalTruths} itemKey="truths" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-accent">
                <p className="text-sm leading-relaxed italic">
                  {results.deepMeaning.universalTruths}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lesson" className="space-y-4">
          {/* Main Insight */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  💡 Insight Principale
                </CardTitle>
                <CopyButton text={results.personalLesson.mainInsight} itemKey="insight" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-sensei/10 p-4 rounded-lg border">
                <p className="text-sm leading-relaxed font-medium">
                  {results.personalLesson.mainInsight}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Practical Applications */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  🎯 Applicazioni Pratiche
                </CardTitle>
                <CopyButton 
                  text={results.personalLesson.practicalApplications.map((app, i) => `${i + 1}. ${app}`).join('\n')} 
                  itemKey="applications" 
                />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.personalLesson.practicalApplications.map((application, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{application}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Reflective Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🤔 Domanda Riflessiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm leading-relaxed italic">
                  "{results.personalLesson.reflectiveQuestion}"
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  💭 La tua riflessione personale:
                </label>
                <Textarea
                  placeholder="Prenditi il tempo per riflettere profondamente su questa domanda. Lascia che i tuoi pensieri fluiscano liberamente..."
                  value={personalReflection}
                  onChange={(e) => setPersonalReflection(e.target.value)}
                  className="min-h-32 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  ✨ La riflessione personale trasforma la lettura in saggezza vissuta
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};