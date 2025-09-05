export interface Page {
  id: string;
  name: string;
  imageURL: string;
  file: File;
  ocrText: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

export interface SymbolicElement {
  element: string;
  description: string;
  symbolicMeaning: string;
  culturalReferences: string;
}

export interface AiResults {
  plotSummary?: any;
  symbolicAnalysis?: any;
  deepMeaning?: any;
  personalLesson?: any;
  transcription: string;
  markdownAnalysis: string; // Analisi in formato markdown
  usedMethodologyId?: string; // ID della metodologia utilizzata per l'analisi
  interactiveLearning?: InteractiveLearning;
}

export type AppStep = 'upload' | 'edit' | 'analysis' | 'quiz';

export interface AppState {
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
    lastAiResultParsed?: AiResults;
  };
  quiz: {
    items: QuizQuestion[];
    lastScore?: { correct: number; total: number };
  };
}

export interface OcrProgress {
  pageId: string;
  progress: number;
  status: string;
}

// Quiz and Interactive Learning Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: 'concept' | 'symbol' | 'theme' | 'quote';
}

export interface ReflectiveQuestion {
  id: string;
  question: string;
  prompts: string[];
  category: 'personal' | 'analytical' | 'creative' | 'philosophical';
}

export interface InteractiveLearning {
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  reflectiveQuestions: ReflectiveQuestion[];
}

// Project and Methodology Types
export interface Methodology {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  outputFormat: string; // Sostituisce outputSchema - descrizione in linguaggio naturale dell'output
  postProcessing: {
    normalizeSpaces: boolean;
    mergeHyphenation: boolean;
  };
  isDefault?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  methodologyId: string;
  pages: Page[];
  mergedText: string;
  aiResults: AiResults | null;
  createdAt: number;
  updatedAt: number;
}

export type ProjectMin = Pick<Project, 'id' | 'title' | 'description' | 'methodologyId' | 'pages' | 'mergedText' | 'aiResults'>;

// AI Model Types
export interface AiModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'meta';
  description: string;
  isAvailable: boolean;
  maxTokens?: number;
  costPerToken?: number;
}

export interface SessionState {
  projects: Project[];
  methodologies: Methodology[];
  selectedAiModel: string; // ID of selected AI model
  ui: {
    home?: {
      newProject: { title: string; description?: string; methodologyId?: string };
      methodologyEditor?: { 
        mode: 'create' | 'edit' | 'duplicate'; 
        draft: Methodology; 
        isOpen: boolean 
      };
    };
  };
}