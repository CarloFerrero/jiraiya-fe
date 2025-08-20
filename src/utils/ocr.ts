import Tesseract from 'tesseract.js';
import type { Page, OcrProgress } from '@/types';

export const processImageOCR = async (
  page: Page,
  onProgress: (progress: OcrProgress) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(page.file, 'ita+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          onProgress({
            pageId: page.id,
            progress: Math.round(m.progress * 100),
            status: `OCR in corso... ${Math.round(m.progress * 100)}%`
          });
        }
      }
    })
    .then(({ data: { text } }) => {
      resolve(text);
    })
    .catch((error) => {
      reject(error);
    });
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
    .replace(/\s+([.,;:!?])/g, '$1');
};

export const estimateTokens = (text: string): number => {
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 1.3);
};