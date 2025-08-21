// Text formatting utilities for Jiraiya Sensei

/**
 * Formatta il testo rimuovendo caratteri strani e normalizzando la formattazione
 */
export const formatText = (text: string): string => {
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

/**
 * Converte il testo in minuscolo
 */
export const toLowerCase = (text: string): string => {
  return text.toLowerCase();
};

/**
 * Converte il testo in maiuscolo
 */
export const toUpperCase = (text: string): string => {
  return text.toUpperCase();
};

/**
 * Capitalizza la prima lettera di ogni frase
 */
export const capitalizeSentences = (text: string): string => {
  return text.replace(/(^|\.\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
};

/**
 * Capitalizza la prima lettera di ogni parola
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, (match) => match.toUpperCase());
};

/**
 * Rimuove tutti gli spazi extra e normalizza la formattazione
 */
export const removeExtraSpaces = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

/**
 * Rimuove tutti i caratteri di punteggiatura
 */
export const removePunctuation = (text: string): string => {
  return text.replace(/[.,;:!?()[\]{}"'`~]/g, '');
};

/**
 * Rimuove tutti i numeri dal testo
 */
export const removeNumbers = (text: string): string => {
  return text.replace(/\d+/g, '');
};

/**
 * Rimuove le righe vuote multiple, lasciando solo una riga vuota
 */
export const removeMultipleEmptyLines = (text: string): string => {
  return text.replace(/\n\s*\n\s*\n/g, '\n\n');
};

/**
 * Aggiunge spazi dopo la punteggiatura se mancanti
 */
export const fixPunctuationSpacing = (text: string): string => {
  return text
    .replace(/([.,;:!?])([A-Za-z])/g, '$1 $2')
    .replace(/\s+/g, ' ');
};

/**
 * Converte il testo in formato titolo (prima lettera maiuscola di ogni parola)
 */
export const toTitleCase = (text: string): string => {
  return text.replace(/\b\w+/g, (word) => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};

/**
 * Rimuove le righe che contengono solo spazi o caratteri speciali
 */
export const removeEmptyLines = (text: string): string => {
  return text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n');
};

/**
 * Normalizza gli apostrofi e le virgolette
 */
export const normalizeQuotes = (text: string): string => {
  return text
    .replace(/[''""]/g, '"')
    .replace(/['']/g, "'");
};

/**
 * Rimuove i caratteri di controllo e non stampabili
 */
export const removeControlCharacters = (text: string): string => {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
};

/**
 * Formatta il testo per una migliore leggibilità
 */
export const formatForReadability = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
    .trim();
};

/**
 * Rimuove le parole duplicate consecutive
 */
export const removeDuplicateWords = (text: string): string => {
  return text.replace(/\b(\w+)(\s+\1\b)+/g, '$1');
};

/**
 * Conta le parole nel testo
 */
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Conta i caratteri nel testo (esclusi spazi)
 */
export const countCharacters = (text: string): number => {
  return text.replace(/\s/g, '').length;
};

/**
 * Conta le frasi nel testo
 */
export const countSentences = (text: string): number => {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
};

/**
 * Stima i token per l'AI
 */
export const estimateTokens = (text: string): number => {
  const words = countWords(text);
  return Math.ceil(words * 1.3);
};
