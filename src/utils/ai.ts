import type { AiResults } from '@/types';
import { OPENAI_CONFIG, OPENAI_ERRORS } from '@/config/openai';

// Cache semplice per evitare di ri-analizzare lo stesso testo
const analysisCache = new Map<string, AiResults>();

// Prompt per l'analisi letteraria
const LITERARY_ANALYSIS_PROMPT = `Sei un critico letterario e simbolico di livello mondiale, specializzato nell'analisi profonda di testi narrativi. La tua competenza include interpretazione tematica, simbolica, filosofica e psicologica.

⸻ MISSIONE
Analizza il testo fornito fornendo un'interpretazione completa e approfondita che includa:
1. Sintesi narrativa accurata e coinvolgente
2. Analisi simbolica dettagliata degli elementi chiave
3. Interpretazione filosofica ed esistenziale profonda
4. Lezioni di vita concrete e applicabili

⸻ METODOLOGIA
• **Approccio sistematico**: Analizza ogni elemento con precisione accademica
• **Collegamenti culturali**: Identifica riferimenti a miti, archetipi, simboli universali
• **Livelli di significato**: Dal letterale al simbolico, dal filosofico al personale
• **Evidenza testuale**: Ogni interpretazione deve essere supportata dal testo

⸻ STANDARD DI QUALITÀ
• **Completezza**: Analizza tutti gli elementi significativi
• **Profondità**: Vai oltre la superficie, esplora i significati nascosti
• **Chiarezza**: Usa un linguaggio accessibile ma sofisticato
• **Applicabilità**: Rendi le lezioni concrete e utilizzabili

⸻ OUTPUT FORMAT
Restituisci l'analisi in formato JSON con questa struttura esatta:

{
  "plotSummary": "Sintesi narrativa dettagliata (3-4 frasi) che catturi l'essenza della storia, i personaggi principali e la progressione degli eventi",
  "symbolicAnalysis": {
    "keyElements": [
      {
        "element": "Nome specifico dell'elemento simbolico",
        "description": "Descrizione dettagliata di come appare nel testo",
        "symbolicMeaning": "Interpretazione simbolica approfondita con riferimenti archetipici",
        "culturalReferences": "Riferimenti specifici a miti, religioni, culture, opere d'arte o letteratura"
      }
    ]
  },
  "deepMeaning": {
    "philosophicalThemes": ["Tema filosofico 1", "Tema filosofico 2", "Tema filosofico 3", "Tema filosofico 4"],
    "existentialInterpretation": "Interpretazione esistenziale approfondita che esplora il significato umano universale del testo",
    "universalTruths": "Verdà universali e principi fondamentali espressi dal testo"
  },
  "personalLesson": {
    "mainInsight": "Principale lezione di vita, formulata in modo chiaro e memorabile",
    "practicalApplications": ["Applicazione pratica specifica 1", "Applicazione pratica specifica 2", "Applicazione pratica specifica 3"],
    "reflectiveQuestion": "Domanda riflessiva profonda che stimoli l'introspezione personale"
  }
}

⸻ ISTRUZIONI SPECIFICHE
• **Sintesi**: Sii preciso ma coinvolgente, cattura l'atmosfera del testo
• **Elementi simbolici**: Identifica almeno 3-5 elementi chiave, analizzali in profondità
• **Temi filosofici**: Identifica 4-5 temi principali, sii specifico
• **Interpretazione esistenziale**: Sviluppa un'analisi di 2-3 frasi ben strutturate
• **Applicazioni pratiche**: Fornisci 3 esempi concreti e specifici
• **Domanda riflessiva**: Formula una domanda che stimoli l'introspezione

⸻ QUALITÀ RICHIESTA
• **Accuratezza**: Ogni interpretazione deve essere supportata dal testo
• **Originalità**: Offri insights unici e non banali
• **Profondità**: Vai oltre l'ovvio, esplora i significati nascosti
• **Utilità**: Rendi l'analisi utile per la crescita personale del lettore

Analizza il seguente testo con la massima attenzione e profondità:

`;

// Funzione principale per chiamare l'AI con retry automatico
export const callAI = async (text: string, apiKey?: string): Promise<AiResults> => {
  const key = apiKey || OPENAI_CONFIG.API_KEY;
  
  if (!key) {
    throw new Error(OPENAI_ERRORS.API_KEY_MISSING);
  }

  // Controlla la cache
  const textHash = text.trim().toLowerCase();
  if (analysisCache.has(textHash)) {
    console.log('Risultato trovato in cache');
    return analysisCache.get(textHash)!;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= OPENAI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OPENAI_CONFIG.TIMEOUT);

      const response = await fetch(`${OPENAI_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.MODEL,
          messages: [
            {
              role: 'system',
              content: LITERARY_ANALYSIS_PROMPT
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: OPENAI_CONFIG.MAX_TOKENS,
          temperature: OPENAI_CONFIG.TEMPERATURE,
          top_p: OPENAI_CONFIG.TOP_P,
          frequency_penalty: OPENAI_CONFIG.FREQUENCY_PENALTY,
          presence_penalty: OPENAI_CONFIG.PRESENCE_PENALTY,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error(OPENAI_ERRORS.INVALID_API_KEY);
      } else if (response.status === 429) {
        throw new Error(OPENAI_ERRORS.RATE_LIMIT_EXCEEDED);
      } else if (response.status === 402) {
        throw new Error(OPENAI_ERRORS.QUOTA_EXCEEDED);
      } else {
        throw new Error(`${OPENAI_ERRORS.API_ERROR}: ${errorData.error?.message || response.statusText}`);
      }
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error(OPENAI_ERRORS.API_ERROR);
    }

      const aiResults = validateAIResponse(content);
      if (!aiResults) {
        throw new Error('Risposta AI non valida o malformata');
      }

      // Salva in cache
      analysisCache.set(textHash, aiResults);
      console.log('Risultato salvato in cache');

      return aiResults;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(OPENAI_ERRORS.UNKNOWN_ERROR);
      
      // Se è l'ultimo tentativo, lancia l'errore
      if (attempt === OPENAI_CONFIG.MAX_RETRIES) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(OPENAI_ERRORS.TIMEOUT_ERROR);
          }
          if (error.message.includes('fetch') || error.message.includes('network')) {
            throw new Error(OPENAI_ERRORS.NETWORK_ERROR);
          }
          if (error.message.includes('timeout')) {
            throw new Error(OPENAI_ERRORS.TIMEOUT_ERROR);
          }
          throw error;
        }
        throw new Error(OPENAI_ERRORS.UNKNOWN_ERROR);
      }

      // Aspetta prima del prossimo tentativo
      await new Promise(resolve => setTimeout(resolve, OPENAI_CONFIG.RETRY_DELAY * attempt));
    }
  }

  // Se arriviamo qui, tutti i tentativi sono falliti
  throw lastError || new Error(OPENAI_ERRORS.UNKNOWN_ERROR);
};

// Funzione per pulire la cache
export const clearAnalysisCache = () => {
  analysisCache.clear();
  console.log('Cache analisi pulita');
};

// Funzione per ottenere la dimensione della cache
export const getCacheSize = () => {
  return analysisCache.size;
};

// Prompt per la generazione di quiz interattivi
const QUIZ_GENERATION_PROMPT = `Sei un esperto educatore e creatore di quiz, specializzato nella creazione di test interattivi basati su analisi letterarie. La tua missione è creare quiz coinvolgenti e educativi che aiutino gli utenti a comprendere meglio i testi analizzati.

⸻ MISSIONE
Crea un set completo di quiz interattivi basato sull'analisi letteraria fornita, includendo:
1. Quiz a scelta multipla su comprensione e interpretazione
2. Flashcard per concetti chiave e simboli
3. Domande riflessive per stimolare l'introspezione

⸻ STANDARD DI QUALITÀ
• **Varietà**: Mix di domande facili, medie e difficili
• **Rilevanza**: Ogni domanda deve essere direttamente collegata all'analisi
• **Chiarezza**: Domande chiare e opzioni ben definite
• **Educativo**: Ogni risposta deve insegnare qualcosa
• **Coinvolgente**: Stimolare la curiosità e la riflessione

⸻ OUTPUT FORMAT
Restituisci i quiz in formato JSON con questa struttura esatta. IMPORTANTE: Usa solo virgolette doppie standard per le stringhe, senza escape aggiuntivi.

{
  "quiz": [
    {
      "id": "q1",
      "question": "Domanda chiara e specifica",
      "options": ["Opzione A", "Opzione B", "Opzione C", "Opzione D"],
      "correctAnswer": 0,
      "explanation": "Spiegazione dettagliata della risposta corretta",
      "difficulty": "easy"
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "front": "Concetto o termine da ricordare",
      "back": "Definizione o spiegazione dettagliata",
      "category": "concept"
    }
  ],
  "reflectiveQuestions": [
    {
      "id": "rq1",
      "question": "Domanda riflessiva profonda",
      "prompts": ["Spunto 1", "Spunto 2", "Spunto 3"],
      "category": "personal"
    }
  ]
}

⸻ ISTRUZIONI SPECIFICHE
• **Quiz**: Crea 5-8 domande a scelta multipla con difficoltà variabile
• **Flashcard**: Crea 6-10 flashcard per concetti chiave, simboli, temi
• **Domande riflessive**: Crea 3-5 domande per stimolare l'introspezione
• **Varietà**: Assicurati che le domande coprano tutti gli aspetti dell'analisi
• **Qualità**: Ogni elemento deve essere educativo e stimolante
• **FORMATO**: Restituisci SOLO il JSON puro, senza blocchi di codice markdown
• **VIRGOLETTE**: Usa solo virgolette doppie standard, evita caratteri di escape

Genera quiz basati sulla seguente analisi letteraria:

`;

// Funzione per generare quiz AI
export const generateQuiz = async (aiResults: AiResults, apiKey?: string): Promise<AiResults['interactiveLearning']> => {
  const key = apiKey || OPENAI_CONFIG.API_KEY;
  
  if (!key) {
    throw new Error(OPENAI_ERRORS.API_KEY_MISSING);
  }

  // Prepara il contesto per il quiz
  const analysisContext = `
ANALISI LETTERARIA:
- Trama: ${aiResults.plotSummary}
- Elementi simbolici: ${aiResults.symbolicAnalysis.keyElements.map(el => `${el.element}: ${el.symbolicMeaning}`).join(', ')}
- Temi filosofici: ${aiResults.deepMeaning.philosophicalThemes.join(', ')}
- Interpretazione esistenziale: ${aiResults.deepMeaning.existentialInterpretation}
- Lezione principale: ${aiResults.personalLesson.mainInsight}
- Applicazioni pratiche: ${aiResults.personalLesson.practicalApplications.join(', ')}
  `.trim();

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= OPENAI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OPENAI_CONFIG.TIMEOUT);

      const response = await fetch(`${OPENAI_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.MODEL,
          messages: [
            {
              role: 'system',
              content: QUIZ_GENERATION_PROMPT
            },
            {
              role: 'user',
              content: analysisContext
            }
          ],
          max_tokens: OPENAI_CONFIG.MAX_TOKENS,
          temperature: 0.4, // Leggermente più creativo per i quiz
          top_p: OPENAI_CONFIG.TOP_P,
          frequency_penalty: OPENAI_CONFIG.FREQUENCY_PENALTY,
          presence_penalty: OPENAI_CONFIG.PRESENCE_PENALTY,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error(OPENAI_ERRORS.INVALID_API_KEY);
        } else if (response.status === 429) {
          throw new Error(OPENAI_ERRORS.RATE_LIMIT_EXCEEDED);
        } else if (response.status === 402) {
          throw new Error(OPENAI_ERRORS.QUOTA_EXCEEDED);
        } else {
          throw new Error(`${OPENAI_ERRORS.API_ERROR}: ${errorData.error?.message || response.statusText}`);
        }
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error(OPENAI_ERRORS.API_ERROR);
      }

      const quizResults = validateQuizResponse(content);
      if (!quizResults) {
        throw new Error('Risposta quiz non valida o malformata');
      }

      return quizResults;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(OPENAI_ERRORS.UNKNOWN_ERROR);
      
      if (attempt === OPENAI_CONFIG.MAX_RETRIES) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(OPENAI_ERRORS.TIMEOUT_ERROR);
          }
          if (error.message.includes('fetch') || error.message.includes('network')) {
            throw new Error(OPENAI_ERRORS.NETWORK_ERROR);
          }
          if (error.message.includes('timeout')) {
            throw new Error(OPENAI_ERRORS.TIMEOUT_ERROR);
          }
          throw error;
        }
        throw new Error(OPENAI_ERRORS.UNKNOWN_ERROR);
      }

      await new Promise(resolve => setTimeout(resolve, OPENAI_CONFIG.RETRY_DELAY * attempt));
    }
  }

  throw lastError || new Error(OPENAI_ERRORS.UNKNOWN_ERROR);
};

// Validazione della risposta quiz
export const validateQuizResponse = (response: string): AiResults['interactiveLearning'] | null => {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Nessun JSON trovato nella risposta quiz:', response);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.quiz || !parsed.flashcards || !parsed.reflectiveQuestions) {
      console.error('Struttura JSON quiz incompleta:', parsed);
      return null;
    }

    return {
      quiz: parsed.quiz.map((q: Record<string, unknown>) => ({
        id: String(q.id || `q${Math.random().toString(36).substring(2, 15)}`),
        question: String(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(opt => String(opt)) : [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: String(q.explanation || ''),
        difficulty: ['easy', 'medium', 'hard'].includes(String(q.difficulty)) ? String(q.difficulty) : 'medium'
      })),
      flashcards: parsed.flashcards.map((fc: Record<string, unknown>) => ({
        id: String(fc.id || `fc${Math.random().toString(36).substring(2, 15)}`),
        front: String(fc.front || ''),
        back: String(fc.back || ''),
        category: ['concept', 'symbol', 'theme', 'quote'].includes(String(fc.category)) ? String(fc.category) : 'concept'
      })),
      reflectiveQuestions: parsed.reflectiveQuestions.map((rq: Record<string, unknown>) => ({
        id: String(rq.id || `rq${Math.random().toString(36).substring(2, 15)}`),
        question: String(rq.question || ''),
        prompts: Array.isArray(rq.prompts) ? rq.prompts.map(prompt => String(prompt)) : [],
        category: ['personal', 'analytical', 'creative', 'philosophical'].includes(String(rq.category)) ? String(rq.category) : 'personal'
      }))
    };

  } catch (error) {
    console.error('Errore nel parsing della risposta quiz:', error);
    return null;
  }
};

export const validateAIResponse = (response: string): AiResults | null => {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Nessun JSON trovato nella risposta:', response);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.plotSummary || 
        !parsed.symbolicAnalysis?.keyElements || 
        !parsed.deepMeaning?.philosophicalThemes ||
        !parsed.deepMeaning?.existentialInterpretation ||
        !parsed.deepMeaning?.universalTruths ||
        !parsed.personalLesson?.mainInsight ||
        !parsed.personalLesson?.practicalApplications ||
        !parsed.personalLesson?.reflectiveQuestion) {
      console.error('Struttura JSON incompleta:', parsed);
      return null;
    }

    return {
      transcription: '',
      plotSummary: parsed.plotSummary,
      symbolicAnalysis: {
        keyElements: parsed.symbolicAnalysis.keyElements.map((el: Record<string, string>) => ({
          element: el.element || '',
          description: el.description || '',
          symbolicMeaning: el.symbolicMeaning || '',
          culturalReferences: el.culturalReferences || ''
        }))
      },
      deepMeaning: {
        philosophicalThemes: Array.isArray(parsed.deepMeaning.philosophicalThemes) 
          ? parsed.deepMeaning.philosophicalThemes 
          : [parsed.deepMeaning.philosophicalThemes],
        existentialInterpretation: parsed.deepMeaning.existentialInterpretation,
        universalTruths: parsed.deepMeaning.universalTruths
      },
      personalLesson: {
        mainInsight: parsed.personalLesson.mainInsight,
        practicalApplications: Array.isArray(parsed.personalLesson.practicalApplications)
          ? parsed.personalLesson.practicalApplications
          : [parsed.personalLesson.practicalApplications],
        reflectiveQuestion: parsed.personalLesson.reflectiveQuestion
      }
    };

  } catch (error) {
    console.error('Errore nel parsing della risposta AI:', error);
	return null;
  }
};