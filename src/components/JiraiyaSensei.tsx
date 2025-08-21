import React, { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

import { UploadStep } from './steps/UploadStep';
import { EditStep } from './steps/EditStep';
import { AnalysisStep } from './steps/AnalysisStep';
import { QuizStep } from './steps/QuizStep';
import { processImageOCR, validateFileForOCR } from '@/utils/ocr';
import { callAI, generateQuiz } from '@/utils/ai';
import { getDemoData, getDemoDataWithoutQuiz } from '@/utils/demoData';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye } from 'lucide-react';
import type { Page, AiResults, OcrProgress, AppState, AppStep } from '@/types';

export const JiraiyaSensei: React.FC = () => {
  const [state, setState] = useState<AppState>({
    pages: [],
    mergedText: '',
    aiResults: null,
    ui: {
      isProcessingOCR: false,
      isCallingAI: false,
      activeTab: 'plot',
      currentStep: 'upload',
      isDemoMode: false,
      isStudyMode: false
    }
  });

  // Generate unique ID for pages
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Handle file uploads
  const handleFilesSelected = useCallback(async (files: File[]) => {
    // Validate files before processing
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    for (const file of files) {
      const validation = validateFileForOCR(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(`${file.name}: ${validation.error}`);
      }
    }

    if (invalidFiles.length > 0) {
      toast.error(`❌ File non validi:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length === 0) {
      return;
    }

    const newPages: Page[] = validFiles.map((file) => ({
      id: generateId(),
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      imageURL: URL.createObjectURL(file),
      file,
      ocrText: '',
      status: 'pending'
    }));

    setState(prev => ({
      ...prev,
      pages: [...prev.pages, ...newPages]
    }));

    toast.success(`📚 ${validFiles.length} pagine caricate`);

    // Start OCR processing
    processPages(newPages);
  }, []);

  // Process OCR for pages
  const processPages = async (pages: Page[]) => {
    setState(prev => ({ ...prev, ui: { ...prev.ui, isProcessingOCR: true } }));

    for (const page of pages) {
      try {
        // Update page status to processing
        setState(prev => ({
          ...prev,
          pages: prev.pages.map(p =>
            p.id === page.id ? { ...p, status: 'processing' as const, progress: 0 } : p
          )
        }));

        const handleProgress = (progress: OcrProgress) => {
          setState(prev => ({
            ...prev,
            pages: prev.pages.map(p =>
              p.id === progress.pageId
                ? { ...p, progress: progress.progress }
                : p
            )
          }));
        };

        const ocrText = await processImageOCR(page, handleProgress);

        // Update page with OCR result
        setState(prev => ({
          ...prev,
          pages: prev.pages.map(p =>
            p.id === page.id
              ? { ...p, ocrText, status: 'completed' as const, progress: 100 }
              : p
          )
        }));

        toast.success(`✅ OCR completato per "${page.name}"`);

      } catch (error) {
        console.error('OCR failed for page:', page.name, error);

        setState(prev => ({
          ...prev,
          pages: prev.pages.map(p =>
            p.id === page.id ? { ...p, status: 'error' as const } : p
          )
        }));

        toast.error(`❌ OCR fallito per "${page.name}"`);
      }
    }

    setState(prev => ({ ...prev, ui: { ...prev.ui, isProcessingOCR: false } }));
  };

  // Handle page operations
  const handleReorderPages = (startIndex: number, endIndex: number) => {
    setState(prev => {
      const result = Array.from(prev.pages);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, pages: result };
    });
  };

  const handleRenamePage = (id: string, newName: string) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === id ? { ...p, name: newName } : p)
    }));
    toast.success('📝 Pagina rinominata');
  };

  const handleDeletePage = (id: string) => {
    setState(prev => {
      const page = prev.pages.find(p => p.id === id);
      if (page) {
        URL.revokeObjectURL(page.imageURL);
      }
      return {
        ...prev,
        pages: prev.pages.filter(p => p.id !== id)
      };
    });
    toast.success('🗑️ Pagina eliminata');
  };

  // Merge OCR text from all completed pages
  const handleMergeText = () => {
    const completedPages = state.pages
      .filter(p => p.status === 'completed')
      .sort((a, b) => state.pages.indexOf(a) - state.pages.indexOf(b));

    const mergedText = completedPages
      .map(p => p.ocrText)
      .join('\n\n')
      .trim();

    setState(prev => ({ ...prev, mergedText }));
    toast.success(`📄 Testo unito da ${completedPages.length} pagine`);
  };

  // Handle AI analysis
  const handleAnalyze = async () => {
    if (!state.mergedText.trim()) {
      toast.error('❌ Nessun testo da analizzare');
      return;
    }

    setState(prev => ({ ...prev, ui: { ...prev.ui, isCallingAI: true } }));

    try {
      let results: AiResults;
      
      if (state.ui.isDemoMode) {
        // Use demo data instead of API call
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        results = getDemoDataWithoutQuiz();
        toast.success('✨ Demo: Analisi completata con successo!');
      } else {
        // Use real API call
        results = await callAI(state.mergedText);
        toast.success('✨ Analisi completata con successo!');
      }
      
      setState(prev => ({
        ...prev,
        aiResults: results,
        ui: { ...prev.ui, isCallingAI: false }
      }));
      
      // Passa automaticamente al step di analisi
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentStep: 'analysis' } }));

    } catch (error) {
      console.error('Errore durante l\'analisi AI:', error);
      
      setState(prev => ({ ...prev, ui: { ...prev.ui, isCallingAI: false } }));
      
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      toast.error(`❌ Errore durante l'analisi: ${errorMessage}`);
    }
  };

  // Handle quiz generation
  const handleGenerateQuiz = async () => {
    if (!state.aiResults) {
      toast.error('❌ Nessuna analisi disponibile per generare quiz');
      return;
    }

    setState(prev => ({ ...prev, ui: { ...prev.ui, isCallingAI: true } }));

    try {
      let quizResults;
      
      if (state.ui.isDemoMode) {
        // Use demo data instead of API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        const demoData = getDemoData();
        quizResults = demoData.interactiveLearning;
        toast.success('🎯 Demo: Quiz generati con successo!');
      } else {
        // Use real API call
        quizResults = await generateQuiz(state.aiResults);
        toast.success('🎯 Quiz generati con successo!');
      }
      
      setState(prev => ({
        ...prev,
        aiResults: {
          ...prev.aiResults,
          interactiveLearning: quizResults
        },
        ui: { ...prev.ui, isCallingAI: false }
      }));
      
      // Passa automaticamente al step quiz
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentStep: 'quiz' } }));

    } catch (error) {
      console.error('Errore durante la generazione quiz:', error);
      
      setState(prev => ({ ...prev, ui: { ...prev.ui, isCallingAI: false } }));
      
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      toast.error(`❌ Errore durante la generazione quiz: ${errorMessage}`);
    }
  };

  // Check if merge is possible
  const canMerge = state.pages.length > 0 &&
    state.pages.every(p => p.status === 'completed') &&
    !state.ui.isProcessingOCR;

  // Check if analysis is possible
  const canAnalyze = state.mergedText.trim().length > 0 && !state.ui.isCallingAI;

  // Step navigation functions
  const handleStepChange = (step: AppStep) => {
    setState(prev => ({ ...prev, ui: { ...prev.ui, currentStep: step } }));
  };

  const handleNextStep = () => {
    const { currentStep } = state.ui;
    if (currentStep === 'upload' && canMerge) {
      handleMergeText();
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentStep: 'edit' } }));
    } else if (currentStep === 'edit' && canAnalyze) {
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentStep: 'analysis' } }));
    } else if (currentStep === 'analysis' && state.aiResults?.interactiveLearning) {
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentStep: 'quiz' } }));
    }
  };

  const handlePrevStep = () => {
    const { currentStep } = state.ui;
    if (currentStep === 'edit') {
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentStep: 'upload' } }));
    } else if (currentStep === 'analysis') {
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentStep: 'edit' } }));
    }
  };

  // Determine completed steps
  const completedSteps: AppStep[] = [];
  if (canMerge) completedSteps.push('upload');
  if (state.mergedText.trim().length > 0) completedSteps.push('edit');
  if (state.aiResults) completedSteps.push('analysis');
  if (state.aiResults?.interactiveLearning) completedSteps.push('quiz');

  // Determine navigation capabilities
  const canNavigate = {
    edit: canMerge || state.mergedText.trim().length > 0,
    analysis: canAnalyze || state.aiResults !== null,
    quiz: state.aiResults?.interactiveLearning !== undefined
  };

  return (
    <DragDropContext onDragEnd={() => { }}>
      <div className="min-h-screen bg-gradient-warm relative">
        {/* Header - Fixed Position */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
            {/* Logo and Title - Left */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/" className="flex items-center gap-2 sm:gap-3">
                <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50 p-1.5 sm:p-2">
                  <img src="/logo.png" alt="Jiraiya Sensei" className="w-6 h-6 sm:w-8 sm:h-8 object-cover" />
                </div>
                <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50 px-2 py-1.5 sm:px-3 sm:py-2 hidden sm:block">
                  <h1 className="text-xs sm:text-sm font-bold">Jiraiya Sensei</h1>
                  <p className="text-xs text-muted-foreground hidden xs:block">Analisi Letteraria e Simbolica</p>
                </div>
              </Link>
            </div>

            {/* Step Indicator - Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
              <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50 p-2 sm:p-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  {(['upload', 'edit', 'analysis', 'quiz'] as AppStep[]).map((step, index) => (
                    <div key={step} className="flex items-center">
                      <button
                        onClick={() => handleStepChange(step)}
                        disabled={!canNavigate[step as keyof typeof canNavigate]}
                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium transition-all ${
                          state.ui.currentStep === step
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : completedSteps.includes(step)
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'bg-muted/50 text-muted-foreground'
                        } ${canNavigate[step as keyof typeof canNavigate] ? 'hover:bg-primary/20' : 'cursor-not-allowed'}`}
                      >
                        <span className="hidden md:inline">
                          {step === 'upload' && '📚 Carica'}
                          {step === 'edit' && '✏️ Modifica'}
                          {step === 'analysis' && '🧠 Analizza'}
                          {step === 'quiz' && '🎯 Quiz'}
                        </span>
                      </button>
                      {index < 3 && (
                        <div className={`w-4 sm:w-6 h-0.5 mx-1 sm:mx-2 ${
                          completedSteps.includes(step) ? 'bg-primary/30' : 'bg-muted/30'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Step Indicator - Visible only on small screens */}
            <div className="sm:hidden">
              <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50 px-2 py-1.5">
                <div className="flex items-center gap-1">
                  {(['upload', 'edit', 'analysis', 'quiz'] as AppStep[]).map((step, index) => (
                    <div key={step} className="flex items-center">
                      <button
                        onClick={() => handleStepChange(step)}
                        disabled={!canNavigate[step as keyof typeof canNavigate]}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                          state.ui.currentStep === step
                            ? 'bg-primary text-primary-foreground'
                            : completedSteps.includes(step)
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        } ${canNavigate[step as keyof typeof canNavigate] ? 'hover:bg-primary/80' : 'cursor-not-allowed'}`}
                      >
                        {index + 1}
                      </button>
                      {index < 3 && (
                        <div className={`w-2 h-0.5 mx-0.5 ${
                          completedSteps.includes(step) ? 'bg-primary' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls - Right */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Demo Mode Toggle */}

              {/* Study Mode Toggle - Only visible in Analysis and Quiz steps */}
              {(state.ui.currentStep === 'analysis' || state.ui.currentStep === 'quiz') && (
                <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50 px-2 py-1.5 sm:px-3 sm:py-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setState(prev => ({
                          ...prev,
                          ui: { ...prev.ui, isStudyMode: !prev.ui.isStudyMode }
                        }));
                        if (!state.ui.isStudyMode) {
                          toast.success('👁️ Modalità Studio attivata');
                        } else {
                          toast.info('📱 Modalità normale attivata');
                        }
                      }}
                      className="h-5 w-5 sm:h-6 sm:w-auto px-1 sm:px-2 text-xs p-0 sm:p-1"
                      title="Modalità studio (focus)"
                    >
                      <Eye className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">
                        {state.ui.isStudyMode ? 'Esci' : 'Studio'}
                      </span>
                    </Button>
                  </div>
                </div>
              )}

              <Link
                to="/how-it-works"
                className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors hidden md:block"
              >
                ❓ Come Funziona
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content - Full View with Padding for Header */}
        <main className="pt-16 sm:pt-20 pb-20 sm:pb-24 px-3 sm:px-6">
          {/* Step Content */}
          <div className="bg-card rounded-lg border shadow-card p-8 min-h-[calc(100vh-200px)]">
            {state.ui.isDemoMode && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <span className="text-lg">🎭</span>
                  <span className="text-sm font-medium">Modalità Demo Attiva</span>
                  <span className="text-xs text-blue-600">(Nessuna chiamata API - Dati di test)</span>
                </div>
              </div>
            )}
            {state.ui.currentStep === 'upload' && (
              <div className="step-transition">
                <UploadStep
                  pages={state.pages}
                  isProcessingOCR={state.ui.isProcessingOCR}
                  onFilesSelected={handleFilesSelected}
                  onReorderPages={handleReorderPages}
                  onRenamePage={handleRenamePage}
                  onDeletePage={handleDeletePage}
                  onMergeText={handleMergeText}
                  canMerge={canMerge}
                />
              </div>
            )}

            {state.ui.currentStep === 'edit' && (
              <div className="step-transition">
                <EditStep
                  mergedText={state.mergedText}
                  onTextChange={(text) => setState(prev => ({ ...prev, mergedText: text }))}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={state.ui.isCallingAI}
                  canAnalyze={canAnalyze}
                />
              </div>
            )}

            {state.ui.currentStep === 'analysis' && (
              <div className="step-transition">
                <AnalysisStep
                  aiResults={state.aiResults}
                  mergedText={state.mergedText}
                  activeTab={state.ui.activeTab}
                  onTabChange={(tab) => setState(prev => ({
                    ...prev,
                    ui: { ...prev.ui, activeTab: tab as 'plot' | 'symbolic' | 'meaning' | 'lesson' }
                  }))}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={state.ui.isCallingAI}
                  canAnalyze={canAnalyze}
                  onGenerateQuiz={handleGenerateQuiz}
                  isGeneratingQuiz={state.ui.isCallingAI}
                  isStudyMode={state.ui.isStudyMode}
                  onToggleStudyMode={() => setState(prev => ({
                    ...prev,
                    ui: { ...prev.ui, isStudyMode: !prev.ui.isStudyMode }
                  }))}
                />
              </div>
            )}

            {state.ui.currentStep === 'quiz' && (
              <div className="step-transition">
                <QuizStep
                  aiResults={state.aiResults}
                  onGenerateQuiz={handleGenerateQuiz}
                  isGenerating={state.ui.isCallingAI}
                  isStudyMode={state.ui.isStudyMode}
                  onToggleStudyMode={() => setState(prev => ({
                    ...prev,
                    ui: { ...prev.ui, isStudyMode: !prev.ui.isStudyMode }
                  }))}
                />
              </div>
            )}
          </div>
        </main>

        {/* Footer - Fixed Position */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-transparent">
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
            {/* Left Side - Step Info */}
            <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50 px-3 py-2 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Step {(['upload', 'edit', 'analysis', 'quiz'] as AppStep[]).indexOf(state.ui.currentStep) + 1} di 4
                </div>
                <div className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                  {state.ui.currentStep === 'upload' && (
                    <>
                      <span>📚</span>
                      <span className="hidden xs:inline">Caricamento Pagine</span>
                      <span className="xs:hidden">Carica</span>
                    </>
                  )}
                  {state.ui.currentStep === 'edit' && (
                    <>
                      <span>✏️</span>
                      <span className="hidden xs:inline">Modifica Testo</span>
                      <span className="xs:hidden">Modifica</span>
                    </>
                  )}
                  {state.ui.currentStep === 'analysis' && (
                    <>
                      <span>🧠</span>
                      <span className="hidden xs:inline">Analisi AI</span>
                      <span className="xs:hidden">Analisi</span>
                    </>
                  )}
                  {state.ui.currentStep === 'quiz' && (
                    <>
                      <span>🎯</span>
                      <span className="hidden xs:inline">Quiz Interattivo</span>
                      <span className="xs:hidden">Quiz</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Navigation Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Back Button */}
              {state.ui.currentStep !== 'upload' && (
                <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
                  <Button
                    variant="ghost"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Indietro</span>
                  </Button>
                </div>
              )}

              {state.ui.currentStep === 'edit' && canAnalyze && (
                <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
                  <Button
                    onClick={handleAnalyze}
                    disabled={state.ui.isCallingAI}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2"
                  >
                    {state.ui.isCallingAI ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Analizzando...</span>
                      </>
                    ) : (
                      <>
                        <span>🧠</span>
                        <span className="hidden sm:inline">Analizza con AI</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {state.ui.currentStep === 'analysis' && state.aiResults && !state.aiResults.interactiveLearning && (
                <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
                  <Button
                    onClick={handleGenerateQuiz}
                    disabled={state.ui.isCallingAI}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2"
                  >
                    {state.ui.isCallingAI ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Generando Quiz...</span>
                      </>
                    ) : (
                      <>
                        <span>🎯</span>
                        <span className="hidden sm:inline">Genera Quiz</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {state.ui.currentStep === 'analysis' && state.aiResults?.interactiveLearning && (
                <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
                  <Button
                    onClick={handleNextStep}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2"
                  >
                    <span>🎯</span>
                    <span className="hidden sm:inline">Vai ai Quiz</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              )}

              {state.ui.currentStep === 'quiz' && (
                <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-sm border border-border/50">
                  <Button
                    variant="ghost"
                    onClick={() => window.print()}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2"
                  >
                    <span>🖨️</span>
                    <span className="hidden sm:inline">Stampa</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </DragDropContext>
  );
};