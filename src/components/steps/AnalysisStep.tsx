import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Brain,
  Wand2,
  Eye,
  EyeOff,
  Download,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Target
} from 'lucide-react';

import { MarkdownExporter } from '../MarkdownExporter';
import { Badge } from '@/components/ui/badge';
import { LiteraryAnalysisTabs } from '../LiteraryAnalysisTabs';
import type { AiResults } from '@/types';

interface AnalysisStepProps {
  aiResults: AiResults | null;
  mergedText: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  onGenerateQuiz?: () => Promise<void>;
  isGeneratingQuiz?: boolean;
  isStudyMode: boolean;
  onToggleStudyMode: () => void;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({
  aiResults,
  mergedText,
  activeTab,
  onTabChange,
  onAnalyze,
  isAnalyzing,
  canAnalyze,
  onGenerateQuiz,
  isGeneratingQuiz = false,
  isStudyMode,
  onToggleStudyMode
}) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Zen Mode Toggle
  const toggleZenMode = () => {
    onToggleStudyMode();
    if (!isStudyMode) {
      // Entering zen mode
      document.body.classList.add('zen-mode');
    } else {
      // Exiting zen mode
      document.body.classList.remove('zen-mode');
    }
  };

  // Ambient sound toggle (placeholder for future implementation)
  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    // TODO: Implement ambient sounds for focus
  };

  // Zen Mode - Modalità Studio Funzionante
  if (isStudyMode) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
        {/* Zen Header - Solo Logo */}
        <div className="absolute top-4 left-4 z-50">
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50 shadow-lg">
            <img src="/logo.png" alt="Jiraiya Sensei" className="w-6 h-6" />
            <span className="text-sm font-medium text-primary">Jiraiya Sensei</span>
          </div>
        </div>

        {/* Zen Content - Analisi a tutto schermo */}
        <div className="h-full flex items-start justify-center p-8 pt-20">
          <div className="w-full max-w-6xl">
            <div className="bg-background/95 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl">
              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                {aiResults ? (
                  <div className="p-8">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-center mb-4">Analisi Letteraria</h1>
                      <p className="text-lg text-muted-foreground text-center">Modalità Studio - Focus Completo</p>
                    </div>
                    
                    {/* Tabs per la navigazione */}
                    <div className="flex justify-center mb-8">
                      <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
                        {['plot', 'symbolic', 'meaning', 'lesson'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              activeTab === tab
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {tab === 'plot' && '📖 Trama'}
                            {tab === 'symbolic' && '🔮 Simboli'}
                            {tab === 'meaning' && '💭 Significato'}
                            {tab === 'lesson' && '🎓 Lezione'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contenuto delle tab */}
                    <div className="space-y-6">
                      {activeTab === 'plot' && (
                        <div className="space-y-4">
                          <h2 className="text-2xl font-bold">📖 Sintesi Narrativa</h2>
                          <div className="bg-muted/20 rounded-lg p-6">
                            <p className="text-lg leading-relaxed">{aiResults.plotSummary}</p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'symbolic' && (
                        <div className="space-y-4">
                          <h2 className="text-2xl font-bold">🔮 Analisi Simbolica</h2>
                          <div className="grid gap-4">
                            {aiResults.symbolicAnalysis.keyElements.map((element, index) => (
                              <div key={index} className="bg-muted/20 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3">{element.element}</h3>
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="font-medium text-muted-foreground">Descrizione</h4>
                                    <p className="mt-1">{element.description}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-muted-foreground">Significato Simbolico</h4>
                                    <p className="mt-1">{element.symbolicMeaning}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-muted-foreground">Riferimenti Culturali</h4>
                                    <p className="mt-1">{element.culturalReferences}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'meaning' && (
                        <div className="space-y-4">
                          <h2 className="text-2xl font-bold">💭 Significato Profondo</h2>
                          <div className="space-y-6">
                            <div className="bg-muted/20 rounded-lg p-6">
                              <h3 className="text-xl font-semibold mb-3">Temi Filosofici</h3>
                              <ul className="space-y-2">
                                {aiResults.deepMeaning.philosophicalThemes.map((theme, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{theme}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-muted/20 rounded-lg p-6">
                              <h3 className="text-xl font-semibold mb-3">Interpretazione Esistenziale</h3>
                              <p className="text-lg leading-relaxed">{aiResults.deepMeaning.existentialInterpretation}</p>
                            </div>
                            <div className="bg-muted/20 rounded-lg p-6">
                              <h3 className="text-xl font-semibold mb-3">Verdà Universali</h3>
                              <p className="text-lg leading-relaxed">{aiResults.deepMeaning.universalTruths}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'lesson' && (
                        <div className="space-y-4">
                          <h2 className="text-2xl font-bold">🎓 Lezione Personale</h2>
                          <div className="space-y-6">
                            <div className="bg-muted/20 rounded-lg p-6">
                              <h3 className="text-xl font-semibold mb-3">Principale Insight</h3>
                              <p className="text-lg leading-relaxed">{aiResults.personalLesson.mainInsight}</p>
                            </div>
                            <div className="bg-muted/20 rounded-lg p-6">
                              <h3 className="text-xl font-semibold mb-3">Applicazioni Pratiche</h3>
                              <ul className="space-y-2">
                                {aiResults.personalLesson.practicalApplications.map((app, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{app}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-muted/20 rounded-lg p-6">
                              <h3 className="text-xl font-semibold mb-3">Domanda Riflessiva</h3>
                              <p className="text-lg leading-relaxed italic">"{aiResults.personalLesson.reflectiveQuestion}"</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h2 className="text-xl font-semibold mb-2">Modalità Studio Attiva</h2>
                      <p className="text-sm">Completa l'analisi per visualizzare il contenuto in modalità studio</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Zen Controls - Angolo in alto a destra */}
        <div className="absolute top-4 right-4 z-50">
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50 shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSound}
              className="h-8 w-8 p-0"
              title={isSoundEnabled ? "Disattiva suoni" : "Attiva suoni ambientali"}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleZenMode}
              className="h-8 w-8 p-0"
              title="Esci dalla modalità studio"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Zen Footer - Centrato in basso */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 border border-border/50 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground">
                {aiResults ? 'Modalità Studio - Analisi Completa' : 'Modalità Studio Attiva'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Mode
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Main Content */}
      {aiResults ? (
        <LiteraryAnalysisTabs
          results={aiResults}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-lg font-semibold mb-3">Inizia l'Analisi Letteraria</h3>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                <strong>Jiraiya Sensei</strong> analizzerà il tuo testo fornendo:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Sintesi della trama</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Analisi simbolica</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Significati filosofici</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Lezioni di vita</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Quiz interattivi e contenuti di apprendimento</span>
                </div>
              </div>

              <Button 
                onClick={onAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                size="lg" 
                className="w-full sm:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Analizzando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Analizza con AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Info */}
      <div className="pt-3 text-center">
        <div className="text-xs text-muted-foreground">
          <span>🧙‍♂️ {aiResults ? 'Analisi completata' : 'Pronto per l\'analisi'}</span>
        </div>
      </div>

      <style>{`
        .zen-mode {
          overflow: hidden;
        }
        .zen-mode * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .zen-mode *::-webkit-scrollbar {
          display: none;
        }
        
        /* Zen mode fullscreen styles */
        .zen-mode body {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
        
        .zen-mode #root {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};