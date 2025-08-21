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
  transcription: string;
  plotSummary: string;
  symbolicAnalysis: {
    keyElements: SymbolicElement[];
  };
  deepMeaning: {
    philosophicalThemes: string[];
    existentialInterpretation: string;
    universalTruths: string;
  };
  personalLesson: {
    mainInsight: string;
    practicalApplications: string[];
    reflectiveQuestion: string;
  };
  interactiveLearning?: InteractiveLearning;
}

export type AppStep = 'upload' | 'edit' | 'analysis' | 'quiz';

export interface AppState {
  pages: Page[];
  mergedText: string;
  aiResults: AiResults | null;
  ui: {
    isProcessingOCR: boolean;
    isCallingAI: boolean;
    apiKey?: string;
    activeTab: 'plot' | 'symbolic' | 'meaning' | 'lesson';
    draggedPage?: string;
    currentStep: AppStep;
    isDemoMode: boolean;
    isStudyMode: boolean;
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