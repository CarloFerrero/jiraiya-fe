import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, Brain, Lightbulb, Sparkles, Target, Heart } from 'lucide-react';
import type { AiResults } from '@/types';

interface LiteraryAnalysisTabsProps {
  aiResults: AiResults;
}

export const LiteraryAnalysisTabs: React.FC<LiteraryAnalysisTabsProps> = ({ 
  aiResults 
}) => {
  const [activeTab, setActiveTab] = useState('plot');
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">📖 Analisi Letteraria e Simbolica</h2>
        <Badge variant="secondary" className="ml-auto">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-4 bg-muted/50 flex-wrap gap-1">
          <TabsTrigger value="plot" className="flex items-center gap-1 text-xs sm:text-sm">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Trama</span>
            <span className="sm:hidden">📖</span>
          </TabsTrigger>
          <TabsTrigger value="symbolic" className="flex items-center gap-1 text-xs sm:text-sm">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Simboli</span>
            <span className="sm:hidden">👁️</span>
          </TabsTrigger>
          <TabsTrigger value="meaning" className="flex items-center gap-1 text-xs sm:text-sm">
            <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Significato</span>
            <span className="sm:hidden">🧠</span>
          </TabsTrigger>
          <TabsTrigger value="lesson" className="flex items-center gap-1 text-xs sm:text-sm">
            <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Lezione</span>
            <span className="sm:hidden">💡</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Sintesi della Trama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed">
                  {aiResults.plotSummary}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symbolic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Analisi Simbolica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aiResults.symbolicAnalysis.keyElements.map((element, index) => (
                  <div key={index} className="border-l-4 border-primary/20 pl-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-foreground">
                          {element.element}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Nel testo:</strong> {element.description}
                        </p>
                        <p className="text-sm text-foreground">
                          <strong>Significato simbolico:</strong> {element.symbolicMeaning}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Riferimenti culturali:</strong> {element.culturalReferences}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meaning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Significato Profondo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Temi Filosofici */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Temi Filosofici
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {aiResults.deepMeaning.philosophicalThemes.map((theme, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Interpretazione Esistenziale */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Interpretazione Esistenziale</h4>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {aiResults.deepMeaning.existentialInterpretation}
                    </p>
                  </div>
                </div>

                {/* Verità Universali */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Verdà Universali</h4>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {aiResults.deepMeaning.universalTruths}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lesson" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Lezione Personale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Principale Insight */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Principale Lezione
                  </h4>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {aiResults.personalLesson.mainInsight}
                    </p>
                  </div>
                </div>

                {/* Applicazioni Pratiche */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Applicazioni Pratiche</h4>
                  <div className="space-y-2">
                    {aiResults.personalLesson.practicalApplications.map((application, index) => (
                      <div key={index} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                        <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        <p className="text-sm text-foreground">{application}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Domanda Riflessiva */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Domanda per la Riflessione</h4>
                  <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                    <p className="text-sm text-foreground leading-relaxed italic">
                      "{aiResults.personalLesson.reflectiveQuestion}"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};