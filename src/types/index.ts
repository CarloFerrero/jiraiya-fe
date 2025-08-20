export interface Page {
  id: string;
  name: string;
  imageURL: string;
  file: File;
  ocrText: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  userAnswer?: number;
}

export interface Flashcard {
  q: string;
  a: string;
}

export interface AiResults {
  transcription: string;
  summaries: {
    tweet: string;
    paragraph: string;
    bullets: string[];
  };
  quiz: QuizQuestion[];
  reflection: string;
  flashcards: Flashcard[];
}

export interface AppState {
  pages: Page[];
  mergedText: string;
  aiResults: AiResults | null;
  ui: {
    isProcessingOCR: boolean;
    isCallingAI: boolean;
    apiKey?: string;
    activeTab: 'summaries' | 'quiz' | 'reflection' | 'flashcards';
    draggedPage?: string;
  };
}

export interface OcrProgress {
  pageId: string;
  progress: number;
  status: string;
}