// OCR Configuration
export const OCR_CONFIG = {
  // OCR.space API settings
  API_KEY: import.meta.env.VITE_OCR_API_KEY || 'K89988945688957', // Fallback per sviluppo
  API_URL: 'https://api.ocr.space/parse/image',
  
  // OCR parameters
  LANGUAGE: 'ita', // Italian language
  ENGINE: '2', // Advanced OCR engine
  DETECT_ORIENTATION: true,
  SCALE: true,
  OVERLAY_REQUIRED: false,
  
  // File settings
  SUPPORTED_FORMATS: ['png', 'jpg', 'jpeg', 'pdf'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB (our limit)
  OCR_SPACE_MAX_SIZE: 1024 * 1024, // 1MB (OCR.space limit)
  
  // Image compression settings
  COMPRESSION: {
    MAX_WIDTH: 2048,
    MAX_HEIGHT: 2048,
    QUALITY: 0.8,
    FORMAT: 'jpeg'
  },
  
  // Progress intervals
  PROGRESS_INTERVALS: {
    INIT: 10,
    COMPRESSING: 20,
    UPLOAD: 40,
    PROCESSING: 60,
    FINALIZING: 90,
    COMPLETE: 100
  }
};

// Validate OCR configuration
export const validateOCRConfig = (): boolean => {
  if (!OCR_CONFIG.API_KEY) {
    console.error('OCR API key is not configured');
    return false;
  }
  return true;
};

// Error messages
export const OCR_ERRORS = {
  FILE_TOO_LARGE: 'Il file è troppo grande. Dimensione massima: 10MB (le immagini più grandi verranno compresse automaticamente)',
  UNSUPPORTED_FORMAT: 'Formato file non supportato. Usa PNG, JPG o PDF',
  API_ERROR: 'Errore durante l\'elaborazione OCR',
  NETWORK_ERROR: 'Errore di connessione. Verifica la tua connessione internet',
  PROCESSING_ERROR: 'Errore durante l\'elaborazione dell\'immagine',
  COMPRESSION_ERROR: 'Errore durante la compressione dell\'immagine'
};
