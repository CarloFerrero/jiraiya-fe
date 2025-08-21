/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Page, OcrProgress } from '@/types';
import { OCR_CONFIG, OCR_ERRORS } from '@/config/ocr';

export const processImageOCR = async (
  page: Page,
  onProgress: (progress: OcrProgress) => void
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Update progress to indicate start
      onProgress({
        pageId: page.id,
        progress: OCR_CONFIG.PROGRESS_INTERVALS.INIT,
        status: 'Inizializzazione OCR...'
      });

      // Check if file needs compression
      let fileToProcess = page.file;
      
      if (page.file.size > OCR_CONFIG.OCR_SPACE_MAX_SIZE) {
        onProgress({
          pageId: page.id,
          progress: OCR_CONFIG.PROGRESS_INTERVALS.COMPRESSING,
          status: 'Compressione immagine...'
        });
        
        try {
          fileToProcess = await compressImage(page.file);
        } catch (error) {
          console.error('Image compression failed:', error);
          throw new Error(OCR_ERRORS.COMPRESSION_ERROR);
        }
      }
      
      onProgress({
        pageId: page.id,
        progress: OCR_CONFIG.PROGRESS_INTERVALS.UPLOAD,
        status: 'Invio immagine al server...'
      });

      // Prepare form data for OCR.space API
      const formData = new FormData();
      formData.append('apikey', OCR_CONFIG.API_KEY);
      formData.append('language', OCR_CONFIG.LANGUAGE);
      formData.append('isOverlayRequired', OCR_CONFIG.OVERLAY_REQUIRED.toString());
      formData.append('filetype', 'png');
      formData.append('detectOrientation', OCR_CONFIG.DETECT_ORIENTATION.toString());
      formData.append('scale', OCR_CONFIG.SCALE.toString());
      formData.append('OCREngine', OCR_CONFIG.ENGINE);
      formData.append('file', fileToProcess);

      onProgress({
        pageId: page.id,
        progress: OCR_CONFIG.PROGRESS_INTERVALS.PROCESSING,
        status: 'Elaborazione OCR in corso...'
      });

      // Make API request
      const response = await fetch(OCR_CONFIG.API_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(OCR_ERRORS.API_ERROR);
      }

      const result = await response.json();

      onProgress({
        pageId: page.id,
        progress: OCR_CONFIG.PROGRESS_INTERVALS.FINALIZING,
        status: 'Finalizzazione...'
      });

      if (result.IsErroredOnProcessing) {
        throw new Error(`OCR processing error: ${result.ErrorMessage}`);
      }

      // Extract text from all parsed regions
      const extractedText = result.ParsedResults
        ?.map((parsedResult: any) => parsedResult.ParsedText || '')
        .join('\n') || '';

      onProgress({
        pageId: page.id,
        progress: OCR_CONFIG.PROGRESS_INTERVALS.COMPLETE,
        status: 'OCR completato'
      });

      resolve(extractedText);

    } catch (error) {
      console.error('OCR processing failed:', error);
      reject(error);
    }
  });
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

// Helper function to compress image
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      const maxWidth = OCR_CONFIG.COMPRESSION.MAX_WIDTH;
      const maxHeight = OCR_CONFIG.COMPRESSION.MAX_HEIGHT;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${OCR_CONFIG.COMPRESSION.FORMAT}`,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${OCR_CONFIG.COMPRESSION.FORMAT}`,
        OCR_CONFIG.COMPRESSION.QUALITY
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const cleanOCRText = (text: string): string => {
  return text
    // Unisce sillabazioni a capo
    .replace(/(\w)-\s*\n\s*(\w)/g, '$1$2')
    // Normalizza spazi multipli
    .replace(/\s+/g, ' ')
    // Rimuove spazi all'inizio e fine
    .trim()
    // Unisce righe spezzate inappropriatamente
    .replace(/\n{3,}/g, '\n\n')
    // Fix per punteggiatura
    .replace(/\s+([.,;:!?])/g, '$1')
    // Rimuove caratteri strani comuni nell'OCR
    .replace(/[|@#$%^&*()_+\-=[\]{};':"\\|<>/]/g, '')
    // Normalizza apostrofi e virgolette
    .replace(/[''""]/g, '"')
    .replace(/['']/g, "'");
};

export const estimateTokens = (text: string): number => {
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 1.3);
};

// Validate file before OCR processing
export const validateFileForOCR = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (our limit is 10MB, but we'll compress if needed)
  if (file.size > OCR_CONFIG.MAX_FILE_SIZE) {
    return { isValid: false, error: OCR_ERRORS.FILE_TOO_LARGE };
  }

  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !OCR_CONFIG.SUPPORTED_FORMATS.includes(fileExtension)) {
    return { isValid: false, error: OCR_ERRORS.UNSUPPORTED_FORMAT };
  }

  // Security: Check for potentially dangerous file names
  const dangerousPatterns = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9]|\.\.|\.\/|\/\.\.)/i;
  if (dangerousPatterns.test(file.name)) {
    return { isValid: false, error: 'Nome file non valido per motivi di sicurezza' };
  }

  // Security: Check for double extensions (e.g., file.jpg.exe)
  const extensionCount = (file.name.match(/\./g) || []).length;
  if (extensionCount > 1) {
    return { isValid: false, error: 'File con estensioni multiple non supportati' };
  }

  // Security: Validate MIME type matches extension
  const validMimeTypes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'pdf': 'application/pdf'
  };

  const expectedMimeType = validMimeTypes[fileExtension as keyof typeof validMimeTypes];
  if (expectedMimeType && file.type !== expectedMimeType) {
    return { isValid: false, error: 'Tipo MIME non corrisponde all\'estensione del file' };
  }

  return { isValid: true };
};