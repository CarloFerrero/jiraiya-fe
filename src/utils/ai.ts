import type { AiResults, Methodology } from '@/types';
import { OPENAI_CONFIG, OPENAI_ERRORS } from '@/config/openai';
import { getDemoData, getDemoDataWithoutQuiz } from './demoData';

// Cache semplice per evitare di ri-analizzare lo stesso testo
const analysisCache = new Map<string, string>();

// Il prompt di base non è più necessario - ora usiamo direttamente i system prompt delle metodologie personalizzate

// Funzione principale per chiamare l'AI con retry automatico
export const callAI = async (text: string, apiKey?: string): Promise<string> => {
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
      console.log(`🔄 Tentativo ${attempt}/${OPENAI_CONFIG.MAX_RETRIES}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OPENAI_CONFIG.TIMEOUT);

      const requestBody = {
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'user',
            content: `Analizza questo testo in formato markdown:\n\n${text}`
          }
        ],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: OPENAI_CONFIG.TEMPERATURE,
        top_p: OPENAI_CONFIG.TOP_P,
        frequency_penalty: OPENAI_CONFIG.FREQUENCY_PENALTY,
        presence_penalty: OPENAI_CONFIG.PRESENCE_PENALTY,
      };

      console.log('📤 Request URL:', `${OPENAI_CONFIG.BASE_URL}/chat/completions`);
      console.log('📤 Request Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key.substring(0, 10)}...`
      });
      console.log('📤 Request Body (model):', requestBody.model);
      console.log('📤 Request Body (max_tokens):', requestBody.max_tokens);

      const response = await fetch(`${OPENAI_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Status Text:', response.statusText);
      console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Error Response Data:', errorData);
      
      if (response.status === 401) {
        console.log('❌ 401 Unauthorized - Chiave API non valida');
        throw new Error(OPENAI_ERRORS.INVALID_API_KEY);
      } else if (response.status === 429) {
        console.log('❌ 429 Rate Limit - Troppe richieste');
        throw new Error(OPENAI_ERRORS.RATE_LIMIT_EXCEEDED);
      } else if (response.status === 402) {
        console.log('❌ 402 Payment Required - Quota esaurita');
        throw new Error(OPENAI_ERRORS.QUOTA_EXCEEDED);
      } else {
        console.log(`❌ ${response.status} Error - ${errorData.error?.message || response.statusText}`);
        throw new Error(`${OPENAI_ERRORS.API_ERROR}: ${errorData.error?.message || response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('✅ Success Response Data:', data);
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.log('❌ No content in response');
      throw new Error(OPENAI_ERRORS.API_ERROR);
    }

      // Salva in cache
      analysisCache.set(textHash, content);
      console.log('💾 Risultato salvato in cache');

      return content;

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

// Funzione per creare prompt personalizzato per quiz basato sulla metodologia
const createQuizPrompt = (methodology: Methodology): string => {
  return `Sei un esperto educatore e creatore di quiz, specializzato nella creazione di test interattivi basati su analisi letterarie. 

⸻ CONTESTO METODOLOGICO
Stai creando quiz basati su un'analisi condotta con la metodologia "${methodology.name}":
${methodology.description}

Il formato di analisi utilizzato era:
${methodology.outputFormat}

⸻ MISSIONE
Crea un set completo di quiz interattivi che riflettano l'approccio specifico di questa metodologia, includendo:
1. Quiz a scelta multipla su comprensione e interpretazione
2. Flashcard per concetti chiave e simboli
3. Domande riflessive per stimolare l'introspezione

⸻ ADATTAMENTO ALLA METODOLOGIA
• **Allinea le domande** all'approccio specifico della metodologia utilizzata
• **Rifletti lo stile** di analisi della metodologia nelle domande
• **Usa la terminologia** appropriata alla metodologia
• **Mantieni coerenza** con il formato di output originale

⸻ STANDARD DI QUALITÀ
• **Varietà**: Mix di domande facili, medie e difficili
• **Rilevanza**: Ogni domanda deve essere direttamente collegata all'analisi
• **Chiarezza**: Domande chiare e opzioni ben definite
• **Educativo**: Ogni risposta deve insegnare qualcosa
• **Coinvolgente**: Stimolare la curiosità e la riflessione
• **Metodologia-specifico**: Riflettere l'approccio della metodologia utilizzata

⸻ OUTPUT FORMAT
Restituisci i quiz in formato JSON con questa struttura esatta. IMPORTANTE: Usa solo virgolette doppie standard per le stringhe, senza escape aggiuntivi.

{
  "quiz": [
    {
      "id": "q1",
      "question": "Domanda chiara e specifica che riflette l'approccio metodologico",
      "options": ["Opzione A", "Opzione B", "Opzione C", "Opzione D"],
      "correctAnswer": 0,
      "explanation": "Spiegazione dettagliata che mantiene il linguaggio della metodologia",
      "difficulty": "easy"
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "front": "Concetto o termine specifico alla metodologia",
      "back": "Definizione che riflette l'approccio metodologico",
      "category": "concept"
    }
  ],
  "reflectiveQuestions": [
    {
      "id": "rq1",
      "question": "Domanda riflessiva che stimola il pensiero nel contesto metodologico",
      "prompts": ["Spunto 1", "Spunto 2", "Spunto 3"],
      "category": "personal"
    }
  ]
}

⸻ ISTRUZIONI SPECIFICHE
• **Quiz**: Crea 6-10 domande a scelta multipla con difficoltà variabile
• **Flashcard**: Crea 8-12 flashcard per concetti chiave, simboli, temi
• **Domande riflessive**: Crea 4-6 domande per stimolare l'introspezione
• **Varietà**: Assicurati che le domande coprano tutti gli aspetti dell'analisi
• **Qualità**: Ogni elemento deve essere educativo e stimolante
• **FORMATO**: Restituisci SOLO il JSON puro, senza blocchi di codice markdown
• **VIRGOLETTE**: Usa solo virgolette doppie standard, evita caratteri di escape
• **COERENZA**: Mantieni il linguaggio e l'approccio della metodologia utilizzata

Genera quiz basati sulla seguente analisi letteraria:

`;
};

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
              role: 'user',
              content: `Genera quiz interattivi basati su questa analisi letteraria:\n\n${analysisContext}`
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

// Validazione della risposta quiz migliorata
export const validateQuizResponse = (response: string): AiResults['interactiveLearning'] | null => {
  try {
    console.log('🔍 Validazione risposta quiz ricevuta:', response.substring(0, 200) + '...');

    // Cerca JSON nella risposta con pattern più flessibili
    let jsonMatch = response.match(/\{[\s\S]*\}/);
    
    // Se non trova il JSON, prova a pulire la risposta
    if (!jsonMatch) {
      // Rimuovi blocchi di codice markdown se presenti
      const cleanedResponse = response
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .replace(/^[^{]*/, '') // Rimuovi tutto prima della prima {
        .replace(/[^}]*$/, ''); // Rimuovi tutto dopo l'ultima }
      
      jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    }

    if (!jsonMatch) {
      console.error('❌ Nessun JSON trovato nella risposta quiz:', response);
      return null;
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ Errore parsing JSON:', parseError);
      // Prova a fixare JSON comuni (virgolette singole, trailing commas, etc.)
      const fixedJson = jsonMatch[0]
        .replace(/'/g, '"') // Sostituisci virgolette singole con doppie
        .replace(/,(\s*[}\]])/g, '$1') // Rimuovi trailing commas
        .replace(/(\w+):/g, '"$1":'); // Aggiungi virgolette alle chiavi
      
      try {
        parsed = JSON.parse(fixedJson);
        console.log('✅ JSON riparato con successo');
      } catch (fixError) {
        console.error('❌ Impossibile riparare JSON:', fixError);
        return null;
      }
    }
    
    // Validazione struttura con fallback intelligenti
    const quiz = Array.isArray(parsed.quiz) ? parsed.quiz : [];
    const flashcards = Array.isArray(parsed.flashcards) ? parsed.flashcards : [];
    const reflectiveQuestions = Array.isArray(parsed.reflectiveQuestions) ? parsed.reflectiveQuestions : [];

    if (quiz.length === 0 && flashcards.length === 0 && reflectiveQuestions.length === 0) {
      console.error('❌ Nessun contenuto valido trovato nel quiz');
      return null;
    }

    console.log(`✅ Quiz validato: ${quiz.length} domande, ${flashcards.length} flashcard, ${reflectiveQuestions.length} domande riflessive`);

    return {
      quiz: quiz.map((q: Record<string, unknown>, index: number) => {
        const options = Array.isArray(q.options) ? q.options.map(opt => String(opt)) : ['Opzione A', 'Opzione B', 'Opzione C', 'Opzione D'];
        const correctAnswer = typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < options.length ? q.correctAnswer : 0;
        
        return {
          id: String(q.id || `q${index + 1}`),
          question: String(q.question || 'Domanda non disponibile'),
          options: options,
          correctAnswer: correctAnswer,
          explanation: String(q.explanation || 'Spiegazione non disponibile'),
          difficulty: ['easy', 'medium', 'hard'].includes(String(q.difficulty)) ? String(q.difficulty) as 'easy' | 'medium' | 'hard' : 'medium'
        };
      }),
      flashcards: flashcards.map((fc: Record<string, unknown>, index: number) => ({
        id: String(fc.id || `fc${index + 1}`),
        front: String(fc.front || 'Concetto'),
        back: String(fc.back || 'Definizione non disponibile'),
        category: ['concept', 'symbol', 'theme', 'quote'].includes(String(fc.category)) ? String(fc.category) as 'concept' | 'symbol' | 'theme' | 'quote' : 'concept'
      })),
      reflectiveQuestions: reflectiveQuestions.map((rq: Record<string, unknown>, index: number) => ({
        id: String(rq.id || `rq${index + 1}`),
        question: String(rq.question || 'Domanda riflessiva'),
        prompts: Array.isArray(rq.prompts) ? rq.prompts.map(prompt => String(prompt)) : ['Rifletti su questo argomento'],
        category: ['personal', 'analytical', 'creative', 'philosophical'].includes(String(rq.category)) ? String(rq.category) as 'personal' | 'analytical' | 'creative' | 'philosophical' : 'personal'
      }))
    };

  } catch (error) {
    console.error('❌ Errore generale nella validazione quiz:', error);
    return null;
  }
};

// Interfaccia per configurazione quiz personalizzata
export interface QuizConfiguration {
  numQuestions: number;
  numFlashcards: number;
  numReflectiveQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  focusAreas: string[]; // Aree specifiche su cui concentrarsi
  questionTypes: ('multiple-choice' | 'true-false' | 'fill-blank')[];
}

// Funzione per generare quiz con configurazione personalizzata
export const generateCustomQuizWithMethodology = async (
  aiResults: AiResults, 
  methodology: Methodology,
  config: QuizConfiguration,
  apiKey?: string
): Promise<AiResults['interactiveLearning']> => {
  const key = apiKey || OPENAI_CONFIG.API_KEY;
  
  if (!key) {
    throw new Error(OPENAI_ERRORS.API_KEY_MISSING);
  }

  console.log('🎯 Generazione quiz personalizzato con configurazione:', config);

  // Crea prompt personalizzato con configurazione specifica
  const customPrompt = `${createQuizPrompt(methodology)}

⸻ CONFIGURAZIONE PERSONALIZZATA RICHIESTA:
• **Numero domande quiz**: ${config.numQuestions}
• **Numero flashcard**: ${config.numFlashcards}  
• **Numero domande riflessive**: ${config.numReflectiveQuestions}
• **Livello difficoltà**: ${config.difficulty === 'mixed' ? 'Mix di facili, medie e difficili' : config.difficulty}
• **Aree di focus**: ${config.focusAreas.length > 0 ? config.focusAreas.join(', ') : 'Tutti gli aspetti dell\'analisi'}
• **Tipi di domande**: ${config.questionTypes.join(', ')}

⸻ ISTRUZIONI SPECIFICHE PER QUESTA CONFIGURAZIONE:
• Rispetta esattamente il numero di elementi richiesti
• Se specificato "mixed" per difficoltà, distribuisci le domande equamente tra i livelli
• Concentrati sulle aree di focus indicate se specificate
• Adatta il tipo di domande ai formati richiesti

`;

  // Prepara il contesto con focus areas se specificate
  let analysisContext = `
ANALISI LETTERARIA PRECEDENTE:
${aiResults.markdownAnalysis}

METODOLOGIA UTILIZZATA: ${methodology.name}
DESCRIZIONE METODOLOGIA: ${methodology.description}

FORMATO OUTPUT ORIGINALE RICHIESTO:
${methodology.outputFormat}`;

  if (config.focusAreas.length > 0) {
    analysisContext += `

AREE DI FOCUS SPECIFICHE PER I QUIZ:
${config.focusAreas.map(area => `- ${area}`).join('\n')}

Concentra i quiz principalmente su queste aree, mantenendo comunque varietà e qualità.`;
  }

  analysisContext = analysisContext.trim();

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= OPENAI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Tentativo ${attempt}/${OPENAI_CONFIG.MAX_RETRIES} per quiz personalizzato`);
      
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
              content: customPrompt
            },
            {
              role: 'user',
              content: analysisContext
            }
          ],
          max_tokens: OPENAI_CONFIG.MAX_TOKENS,
          temperature: 0.5, // Più creativo per quiz personalizzati
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

      console.log('✅ Quiz personalizzato generato con successo');

      const quizResults = validateQuizResponse(content);
      if (!quizResults) {
        throw new Error('Risposta quiz personalizzato non valida o malformata');
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

// Funzione per analisi con metodologia personalizzata
export const callAIWithMethodology = async (
  text: string, 
  methodology: Methodology, 
  apiKey?: string
): Promise<string> => {
  const key = apiKey || OPENAI_CONFIG.API_KEY;
  
  if (!key) {
    throw new Error(OPENAI_ERRORS.API_KEY_MISSING);
  }

  console.log('🔄 Chiamata API reale con metodologia:', methodology.name);
  console.log('📄 Lunghezza testo:', text.length);
  
  // Pulisci la cache se contiene risultati JSON (per compatibilità con versione precedente)
  const textHash = `${methodology.id}_${text.trim().toLowerCase()}`;
  const cachedResult = analysisCache.get(textHash);
  if (cachedResult && (cachedResult.includes('"transcription"') || cachedResult.includes('"plotSummary"'))) {
    console.log('🧹 Pulizia cache: rimuovo risultato JSON obsoleto');
    analysisCache.delete(textHash);
  }
  
  // Crea un prompt personalizzato basato sulla metodologia
  const customPrompt = `${methodology.systemPrompt.replace('{{TRANSCRIPTION}}', text)}

⸻ FORMATO OUTPUT RICHIESTO:
${methodology.outputFormat}

⸻ ISTRUZIONI FINALI:
- Segui esattamente il formato output specificato sopra
- Restituisci SOLO il contenuto richiesto, senza wrapper JSON o altri formati
- Se richiesto markdown, inizia direttamente con il markdown
- Mantieni alta qualità nell'analisi e rispetta la metodologia "${methodology.name}"`;

  // Controlla la cache (già pulita sopra se conteneva JSON obsoleto)
  if (analysisCache.has(textHash)) {
    console.log('Risultato markdown trovato in cache per metodologia:', methodology.name);
    return analysisCache.get(textHash)!;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= OPENAI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Tentativo ${attempt}/${OPENAI_CONFIG.MAX_RETRIES} per metodologia ${methodology.name}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OPENAI_CONFIG.TIMEOUT);

      const requestBody = {
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: customPrompt
          }
        ],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: OPENAI_CONFIG.TEMPERATURE,
        top_p: OPENAI_CONFIG.TOP_P,
        frequency_penalty: OPENAI_CONFIG.FREQUENCY_PENALTY,
        presence_penalty: OPENAI_CONFIG.PRESENCE_PENALTY,
      };

      console.log('📤 Request URL:', `${OPENAI_CONFIG.BASE_URL}/chat/completions`);
      console.log('📤 Request Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key.substring(0, 10)}...`
      });
      console.log('📤 Request Body (model):', requestBody.model);
      console.log('📤 Request Body (max_tokens):', requestBody.max_tokens);

      const response = await fetch(`${OPENAI_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Status Text:', response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Error Response Data:', errorData);
        
        if (response.status === 401) {
          console.log('❌ 401 Unauthorized - Chiave API non valida');
          throw new Error(OPENAI_ERRORS.INVALID_API_KEY);
        } else if (response.status === 429) {
          console.log('❌ 429 Rate Limit - Troppe richieste');
          throw new Error(OPENAI_ERRORS.RATE_LIMIT_EXCEEDED);
        } else if (response.status === 402) {
          console.log('❌ 402 Payment Required - Quota esaurita');
          throw new Error(OPENAI_ERRORS.QUOTA_EXCEEDED);
        } else {
          console.log(`❌ ${response.status} Error - ${errorData.error?.message || response.statusText}`);
          throw new Error(`${OPENAI_ERRORS.API_ERROR}: ${errorData.error?.message || response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('✅ Success Response Data per metodologia:', methodology.name);
      
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        console.log('❌ No content in response');
        throw new Error(OPENAI_ERRORS.API_ERROR);
      }

      // Salva in cache con hash specifico per metodologia
      analysisCache.set(textHash, content);
      console.log('💾 Risultato salvato in cache per metodologia:', methodology.name);

      return content;

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

// Funzione per generare quiz con metodologia personalizzata
export const generateQuizWithMethodology = async (
  aiResults: AiResults, 
  methodology: Methodology,
  apiKey?: string
): Promise<AiResults['interactiveLearning']> => {
  const key = apiKey || OPENAI_CONFIG.API_KEY;
  
  if (!key) {
    throw new Error(OPENAI_ERRORS.API_KEY_MISSING);
  }

  console.log('🔄 Generazione quiz API reale con metodologia:', methodology.name);

  // Prepara il contesto per il quiz basato sulla metodologia e sull'analisi markdown
  const analysisContext = `
ANALISI LETTERARIA PRECEDENTE:
${aiResults.markdownAnalysis}

METODOLOGIA UTILIZZATA: ${methodology.name}
DESCRIZIONE METODOLOGIA: ${methodology.description}

FORMATO OUTPUT ORIGINALE RICHIESTO:
${methodology.outputFormat}
  `.trim();

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= OPENAI_CONFIG.MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Tentativo ${attempt}/${OPENAI_CONFIG.MAX_RETRIES} per quiz con metodologia ${methodology.name}`);
      
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
              content: createQuizPrompt(methodology)
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

      console.log('✅ Quiz generato con successo per metodologia:', methodology.name);

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

