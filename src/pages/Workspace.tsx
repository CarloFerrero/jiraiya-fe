import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppShell } from '@/components/AppShell';
import { ThreePane } from '@/components/ThreePane';
import { MobileWorkspace } from '@/components/MobileWorkspace';
import { SourcesPane } from '@/components/SourcesPane';
import { AnalysisPane } from '@/components/AnalysisPane';
import { StudyPane } from '@/components/StudyPane';
import { processImageOCR, validateFileForOCR } from '@/utils/ocr';
import { getDemoData } from '@/utils/demoData';
import { callAIWithMethodology, generateQuizWithMethodology } from '@/utils/ai';
import { useSessionState } from '@/hooks/use-session-state';
import { useWorkspaceLayout } from '@/hooks/use-workspace-layout';
import { AlertTriangle, BookOpen, Brain, CheckCircle, Search, Lightbulb } from 'lucide-react';
import type { Page, AiResults, OcrProgress } from '@/types';

const Workspace: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: sessionState, updateState } = useSessionState();
  const layout = useWorkspaceLayout();
  
  // Find the current project - also check sessionStorage directly
  const currentProject = projectId ? sessionState.projects.find(p => p.id === projectId) : null;
  
  // Also check sessionStorage directly as a fallback
  const sessionStorageProject = projectId ? (() => {
    try {
      const savedState = sessionStorage.getItem('jiraiya:state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed.projects?.find((p: any) => p.id === projectId);
      }
    } catch (e) {
      console.error('Error reading from sessionStorage:', e);
    }
    return null;
  })() : null;
  
  // Use sessionStorage project if sessionState project is not available
  const effectiveProject = currentProject || sessionStorageProject;
  
  // Add a flag to prevent multiple redirects
  const [hasRedirected, setHasRedirected] = useState(false);
  
  // If no project ID or project not found, redirect to home
  useEffect(() => {
    // Only proceed if we have a projectId and no effectiveProject
    if (!projectId || effectiveProject || hasRedirected) {
      return;
    }
    
    // Try to reload state from sessionStorage first
    const savedState = sessionStorage.getItem('jiraiya:state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const projectInStorage = parsed.projects?.find((p: any) => p.id === projectId);
        if (projectInStorage) {
          // Force a state reload by updating the session state
          updateState(prev => ({
            ...prev,
            projects: parsed.projects || prev.projects
          }));
          return; // Don't redirect yet, let the state update
        }
      } catch (e) {
        console.error('Error parsing sessionStorage:', e);
      }
    }
    
    // If still not found, redirect after delay
    const timeoutId = setTimeout(() => {
      // Check again after the state update
      const updatedSessionState = JSON.parse(sessionStorage.getItem('jiraiya:state') || '{}');
      const projectStillNotFound = !updatedSessionState.projects?.find((p: any) => p.id === projectId);
      
      if (projectStillNotFound && !hasRedirected) {
        setHasRedirected(true);
        toast.error('Progetto non trovato');
        navigate('/');
      }
    }, 2000); // Increased delay to 2 seconds
    
    return () => clearTimeout(timeoutId);
  }, [projectId, effectiveProject, navigate, updateState, hasRedirected]);

  // Use project data or create empty state
  const [state, setState] = useState<{
    pages: Page[];
    mergedText: string;
    aiResults: AiResults | null;
    ui: {
      leftPaneOpen: boolean;
      rightPaneOpen: boolean;
      theme: 'light' | 'dark' | 'system';
      isProcessingOCR: boolean;
      isCallingAI: boolean;
      isGeneratingQuiz: boolean;
    };
    analysis: {
      lastAiResultRaw?: string;
      lastAiResultParsed?: any;
      history: Array<{
        id: string;
        raw: string;
        parsed?: any;
        createdAt: number;
      }>;
    };
    quiz: {
      items: any[];
      lastScore?: { correct: number; total: number };
    };
  }>(() => {
    if (effectiveProject) {
      return {
        pages: effectiveProject.pages,
        mergedText: effectiveProject.mergedText,
        aiResults: effectiveProject.aiResults,
        ui: {
          leftPaneOpen: true,
          rightPaneOpen: true,
          theme: 'system',
          isProcessingOCR: false,
          isCallingAI: false,
          isGeneratingQuiz: false
        },
        analysis: {
          history: []
        },
        quiz: {
          items: []
        }
      };
    }
    
    return {
      pages: [],
      mergedText: '',
      aiResults: null,
      ui: {
        leftPaneOpen: true,
        rightPaneOpen: true,
        theme: 'system',
        isProcessingOCR: false,
        isCallingAI: false,
        isGeneratingQuiz: false
      },
      analysis: {
        lastAiResultRaw: '',
        lastAiResultParsed: null
      },
      quiz: {
        items: []
      }
    };
  });

  // Local state for selected methodology
  const [selectedMethodologyId, setSelectedMethodologyId] = useState<string>(
    sessionState.methodologies.find(m => m.isDefault)?.id || sessionState.methodologies[0]?.id || ''
  );

  // Update local state when effectiveProject changes
  useEffect(() => {
    if (effectiveProject) {
      setHasRedirected(false); // Reset redirect flag
      setState(prev => ({
        ...prev,
        pages: effectiveProject.pages,
        mergedText: effectiveProject.mergedText,
        aiResults: effectiveProject.aiResults
      }));
    }
  }, [effectiveProject]);

  // Sync state with project in session
  useEffect(() => {
    if (effectiveProject) {
      const timeoutId = setTimeout(() => {
        updateState(prev => ({
          ...prev,
          projects: prev.projects.map(p =>
            p.id === effectiveProject.id
              ? {
                  ...p,
                  pages: state.pages,
                  mergedText: state.mergedText,
                  aiResults: state.aiResults,
                  updatedAt: Date.now()
                }
              : p
          )
        }));
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [state.pages, state.mergedText, state.aiResults, effectiveProject, updateState]);

  // Generate unique ID for pages
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Handle file uploads
  const handleFilesSelected = useCallback(async (files: File[]) => {
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
      toast.error(`File non validi:\n${invalidFiles.join('\n')}`, {
        icon: <AlertTriangle className="w-4 h-4" />
      });
    }

    if (validFiles.length === 0) {
      return;
    }

    const newPages: Page[] = validFiles.map((file) => ({
      id: generateId(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      imageURL: URL.createObjectURL(file),
      file,
      ocrText: '',
      status: 'pending'
    }));

    setState(prev => ({
      ...prev,
      pages: [...prev.pages, ...newPages]
    }));

    toast.success(`${validFiles.length} pagine caricate`, {
      icon: <BookOpen className="w-4 h-4" />
    });

    // Start OCR processing
    processPages(newPages);
  }, []);

  // Process OCR for pages
  const processPages = async (pages: Page[]) => {
    setState(prev => ({ ...prev, ui: { ...prev.ui, isProcessingOCR: true } }));

    for (const page of pages) {
      try {
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

        toast.error(`OCR fallito per "${page.name}"`, {
          icon: <AlertTriangle className="w-4 h-4" />
        });
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

  const handleRetryOCR = (page: Page) => {
    processPages([page]);
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
  const handleAnalyze = async (methodologyId?: string) => {
    if (!state.mergedText.trim()) {
      toast.error('Nessun testo da analizzare', {
        icon: <AlertTriangle className="w-4 h-4" />
      });
      return;
    }

    // Use the provided methodology or the default one
    const methodologyIdToUse = methodologyId || sessionState.methodologies.find(m => m.isDefault)?.id || sessionState.methodologies[0]?.id;
    const selectedMethodology = sessionState.methodologies.find(m => m.id === methodologyIdToUse);

    if (!selectedMethodology) {
      toast.error('Nessuna metodologia disponibile', {
        icon: <AlertTriangle className="w-4 h-4" />
      });
      return;
    }

    setState(prev => ({ ...prev, ui: { ...prev.ui, isCallingAI: true } }));

    try {
      let markdownAnalysis: string;
      
      try {
        // Prova prima con la metodologia e API reale
        markdownAnalysis = await callAIWithMethodology(
          state.mergedText, 
          selectedMethodology
        );
        
        toast.success('Analisi completata con successo!', {
          icon: <CheckCircle className="w-4 h-4" />
        });
        
      } catch (apiError) {
        // Fallback ai dati demo se l'API fallisce
        console.warn('API fallita, usando dati demo:', apiError);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Demo markdown analysis con metodologia
        markdownAnalysis = `# Analisi con ${selectedMethodology.name}

## Metodologia Utilizzata
**${selectedMethodology.name}**: ${selectedMethodology.description}

## Analisi Letteraria

## Sintesi Narrativa
Il testo presenta una narrazione complessa che esplora temi universali attraverso una struttura simbolica ricca di significati nascosti. La storia si sviluppa attraverso una progressione di eventi che riflettono profondi archetipi umani.

## Analisi Simbolica

### Elementi Chiave

#### Il Castello
- **Descrizione**: Un edificio imponente che domina il paesaggio, con torri che si innalzano verso il cielo
- **Significato Simbolico**: Rappresenta la mente umana e la ricerca di conoscenza superiore
- **Riferimenti Culturali**: Simbolo archetipico presente in molte culture, dal Graal ai castelli delle fiabe

#### I Destini Incrociati
- **Descrizione**: Percorsi che si intersecano e si influenzano reciprocamente
- **Significato Simbolico**: La complessità delle scelte umane e l'interconnessione delle vite
- **Riferimenti Culturali**: Concetto presente nella filosofia orientale e nella letteratura moderna

#### La Soglia
- **Descrizione**: Un passaggio che separa due mondi o stati di coscienza
- **Significato Simbolico**: Il momento di trasformazione e crescita personale
- **Riferimenti Culturali**: Simbolo universale presente in miti e rituali di iniziazione

## 🧠 Significato Profondo

### Temi Filosofici
- La ricerca di identità e significato
- L'interconnessione tra destino e libero arbitrio
- La trasformazione attraverso l'esperienza
- La dualità tra ordine e caos

### Interpretazione Esistenziale
Il testo esplora la condizione umana attraverso la metafora del viaggio interiore, suggerendo che ogni individuo deve attraversare il proprio "castello" per raggiungere una comprensione più profonda di sé e del mondo.

### Verità Universali
La crescita personale richiede coraggio, la conoscenza si acquisisce attraverso l'esperienza diretta, e ogni scelta ha conseguenze che si estendono oltre l'individuo.

## Lezione Personale

### Insight Principale
Ogni ostacolo nella vita è un'opportunità di crescita, e il vero viaggio è quello interiore che ci porta a scoprire chi siamo realmente.

### Applicazioni Pratiche
1. Affronta le sfide come opportunità di apprendimento
2. Rifletti sulle tue scelte e le loro conseguenze
3. Cerca la saggezza nelle esperienze quotidiane

### Domanda Riflessiva
> Quale "castello" stai attualmente attraversando nella tua vita, e cosa ti sta insegnando questo viaggio?
`;
      
        toast.success(`Demo: Analisi completata con metodologia ${selectedMethodology.name}!`, {
          icon: <CheckCircle className="w-4 h-4" />
        });
      }
      
      const results: AiResults = {
        transcription: state.mergedText,
        markdownAnalysis: markdownAnalysis
      };
      
      setState(prev => ({
        ...prev,
        aiResults: results,
        analysis: {
          ...prev.analysis,
          lastAiResultRaw: markdownAnalysis,
          lastAiResultParsed: results
        },
        ui: { ...prev.ui, isCallingAI: false }
      }));

    } catch (error) {
      console.error('Errore durante l\'analisi AI:', error);
      
      setState(prev => ({ ...prev, ui: { ...prev.ui, isCallingAI: false } }));
      
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      toast.error(`Errore durante l'analisi: ${errorMessage}`, {
        icon: <AlertTriangle className="w-4 h-4" />
      });
    }
  };

  // Handle quiz generation
  const handleGenerateQuiz = async () => {
    if (!state.aiResults) {
      toast.error('Nessuna analisi disponibile per generare quiz', {
        icon: <AlertTriangle className="w-4 h-4" />
      });
      return;
    }

    // Get the methodology used for the analysis
    const selectedMethodology = sessionState.methodologies.find(m => m.id === selectedMethodologyId) || 
                               sessionState.methodologies.find(m => m.isDefault) || 
                               sessionState.methodologies[0];

    if (!selectedMethodology) {
      toast.error('Metodologia non trovata', {
        icon: <AlertTriangle className="w-4 h-4" />
      });
      return;
    }

    setState(prev => ({ ...prev, ui: { ...prev.ui, isGeneratingQuiz: true } }));

    try {
      let quizResults;
      
      try {
        // Prova prima con la metodologia e API reale
        quizResults = await generateQuizWithMethodology(
          state.aiResults,
          selectedMethodology
        );
        
        toast.success('Quiz generati con successo!', {
          icon: <Brain className="w-4 h-4" />
        });
        
      } catch (apiError) {
        // Fallback ai dati demo se l'API fallisce
        console.warn('API fallita per quiz, usando dati demo:', apiError);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoData = getDemoData();
        quizResults = demoData.interactiveLearning;
        
        toast.success(`Demo: Quiz generati con metodologia ${selectedMethodology.name}!`, {
          icon: <Brain className="w-4 h-4" />
        });
      }
      
      setState(prev => ({
        ...prev,
        aiResults: {
          ...prev.aiResults,
          interactiveLearning: quizResults
        },
        quiz: {
          ...prev.quiz,
          items: quizResults.quiz || []
        },
        ui: { ...prev.ui, isGeneratingQuiz: false }
      }));

    } catch (error) {
      console.error('Errore durante la generazione quiz:', error);
      
      setState(prev => ({ ...prev, ui: { ...prev.ui, isGeneratingQuiz: false } }));
      
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      toast.error(`Errore durante la generazione quiz: ${errorMessage}`, {
        icon: <AlertTriangle className="w-4 h-4" />
      });
    }
  };

  const handleResetQuiz = () => {
    setState(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        items: [],
        lastScore: undefined
      }
    }));
  };



  // Check if merge is possible
  const canMerge = state.pages.length > 0 &&
    state.pages.every(p => p.status === 'completed') &&
    !state.ui.isProcessingOCR;

  // Check if analysis is possible
  const canAnalyze = state.mergedText.trim().length > 0 && !state.ui.isCallingAI;

  // UI handlers
  const handleToggleLeftPane = () => {
    setState(prev => ({
      ...prev,
      ui: { ...prev.ui, leftPaneOpen: !prev.ui.leftPaneOpen }
    }));
  };

  const handleToggleRightPane = () => {
    setState(prev => ({
      ...prev,
      ui: { ...prev.ui, rightPaneOpen: !prev.ui.rightPaneOpen }
    }));
  };

  const handleToggleTheme = () => {
    setState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        theme: prev.ui.theme === 'light' ? 'dark' : prev.ui.theme === 'dark' ? 'system' : 'light'
      }
    }));
  };

  const handleOpenSettings = () => {
    toast.info('⚙️ Impostazioni - Funzionalità in sviluppo');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle left pane: [
      if (e.key === '[') {
        e.preventDefault();
        handleToggleLeftPane();
      }
      
      // Toggle right pane: ]
      if (e.key === ']') {
        e.preventDefault();
        handleToggleRightPane();
      }
      
      // Focus center: \
      if (e.key === '\\') {
        e.preventDefault();
        // Focus center pane logic
      }
      
      // Upload: Cmd/Ctrl+U
      if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
        e.preventDefault();
        // Trigger file upload
        document.getElementById('file-upload')?.click();
      }
      
      // Merge text: Cmd/Ctrl+J
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        if (canMerge) {
          handleMergeText();
        }
      }
      
      // Execute analysis: Cmd/Ctrl+Enter
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (canAnalyze) {
          handleAnalyze();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canMerge, canAnalyze]);

  // Render components for reuse
  const sourcesPane = (
    <SourcesPane
      pages={state.pages}
      isProcessingOCR={state.ui.isProcessingOCR}
      onFilesSelected={handleFilesSelected}
      onReorderPages={handleReorderPages}
      onRenamePage={handleRenamePage}
      onDeletePage={handleDeletePage}
      onRetryOCR={handleRetryOCR}
      onMergeText={handleMergeText}
      canMerge={canMerge}
    />
  );

  const analysisPane = (
    <AnalysisPane
      mergedText={state.mergedText}
      aiResults={state.aiResults}
      isCallingAI={state.ui.isCallingAI}
      onTextChange={(text) => setState(prev => ({ ...prev, mergedText: text }))}
      onAnalyze={handleAnalyze}
      onRetry={handleAnalyze}
      canAnalyze={canAnalyze}
      methodologies={sessionState.methodologies}
      selectedMethodologyId={selectedMethodologyId}
      onMethodologyChange={setSelectedMethodologyId}
    />
  );

  const studyPane = (
    <StudyPane
      aiResults={state.aiResults}
      isGeneratingQuiz={state.ui.isGeneratingQuiz}
      onGenerateQuiz={handleGenerateQuiz}
      onResetQuiz={handleResetQuiz}
      quizItems={state.quiz.items}
      flashcards={state.aiResults?.interactiveLearning?.flashcards || []}
      lastScore={state.quiz.lastScore}
    />
  );

  return (
    <AppShell
      leftPaneOpen={state.ui.leftPaneOpen}
      rightPaneOpen={state.ui.rightPaneOpen}
      onToggleLeftPane={handleToggleLeftPane}
      onToggleRightPane={handleToggleRightPane}
      onToggleTheme={handleToggleTheme}
      onOpenSettings={handleOpenSettings}
      selectedAiModel={sessionState.selectedAiModel}
      onAiModelChange={(modelId) => updateState(prev => ({ ...prev, selectedAiModel: modelId }))}
      isMobile={layout.isMobile}
    >
      {layout.isMobile ? (
        <MobileWorkspace
          sources={sourcesPane}
          analysis={analysisPane}
          study={studyPane}
        />
      ) : (
        <ThreePane
          leftPaneOpen={state.ui.leftPaneOpen}
          rightPaneOpen={state.ui.rightPaneOpen}
          onToggleLeftPane={handleToggleLeftPane}
          onToggleRightPane={handleToggleRightPane}
          left={sourcesPane}
          center={analysisPane}
          right={studyPane}
        />
      )}
    </AppShell>
  );
};

export default Workspace;
