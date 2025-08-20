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
}

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
  };
}

export interface OcrProgress {
  pageId: string;
  progress: number;
  status: string;
}