import React, { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { toast } from 'sonner';
import { Dropzone } from './Dropzone';
import { PageList } from './PageList';
import { TranscriptEditor } from './TranscriptEditor';
import { AiResultsTabs } from './AiResultsTabs';
import { MarkdownExporter } from './MarkdownExporter';
import { processImageOCR } from '@/utils/ocr';
import { callAI, validateAIResponse } from '@/utils/ai';
import type { Page, AiResults, OcrProgress, AppState } from '@/types';

export const JiraiyaSensei: React.FC = () => {
  const [state, setState] = useState<AppState>({
    pages: [],
    mergedText: '',
    aiResults: null,
    ui: {
      isProcessingOCR: false,
      isCallingAI: false,
      activeTab: 'summaries'
    }
  });

  // Generate unique ID for pages
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Handle file uploads
  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newPages: Page[] = files.map((file) => ({
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

    toast.success(`📚 ${files.length} pagine caricate`);

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
    if (!state.mergedText.trim()) return;

    setState(prev => ({ ...prev, ui: { ...prev.ui, isCallingAI: true } }));

    try {
      const results = await callAI(state.mergedText, state.ui.apiKey);
      const validatedResults = validateAIResponse(JSON.stringify(results));

      if (validatedResults) {
        setState(prev => ({ ...prev, aiResults: validatedResults }));
        toast.success('🧙‍♂️ Analisi completata da Jiraiya Sensei!');
      } else {
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error('❌ Errore durante l\'analisi AI');
    } finally {
      setState(prev => ({ ...prev, ui: { ...prev.ui, isCallingAI: false } }));
    }
  };

  // Check if merge is possible
  const canMerge = state.pages.length > 0 && 
    state.pages.every(p => p.status === 'completed') && 
    !state.ui.isProcessingOCR;

  // Check if analysis is possible
  const canAnalyze = state.mergedText.trim().length > 0 && !state.ui.isCallingAI;

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="min-h-screen bg-gradient-warm">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-sensei rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🧙‍♂️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-sensei bg-clip-text text-transparent">
                    Jiraiya Sensei
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Web MVP - OCR e Analisi AI per Studio Attivo
                  </p>
                </div>
              </div>
              
              <MarkdownExporter 
                results={state.aiResults} 
                transcription={state.mergedText} 
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Sidebar - Pages */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border shadow-card p-6">
                <Dropzone 
                  onFilesSelected={handleFilesSelected}
                  isProcessing={state.ui.isProcessingOCR}
                />
              </div>
              
              <div className="bg-card rounded-lg border shadow-card p-6">
                <PageList
                  pages={state.pages}
                  onReorderPages={handleReorderPages}
                  onRenamePage={handleRenamePage}
                  onDeletePage={handleDeletePage}
                  onMergeText={handleMergeText}
                  canMerge={canMerge}
                />
              </div>
            </div>

            {/* Center - Transcript Editor */}
            <div className="bg-card rounded-lg border shadow-card p-6">
              <TranscriptEditor
                text={state.mergedText}
                onTextChange={(text) => setState(prev => ({ ...prev, mergedText: text }))}
                onAnalyze={handleAnalyze}
                isAnalyzing={state.ui.isCallingAI}
                canAnalyze={canAnalyze}
              />
            </div>

            {/* Right - AI Results */}
            <div className="bg-card rounded-lg border shadow-card p-6">
              {state.aiResults ? (
                <AiResultsTabs
                  results={state.aiResults}
                  activeTab={state.ui.activeTab}
                  onTabChange={(tab) => setState(prev => ({
                    ...prev,
                    ui: { ...prev.ui, activeTab: tab as any }
                  }))}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-2xl">🧙‍♂️</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">In attesa di analisi</h3>
                  <p className="text-sm">
                    Carica le pagine, unisci il testo e clicca "Analizza con Sensei" per vedere i risultati qui.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </DragDropContext>
  );
};