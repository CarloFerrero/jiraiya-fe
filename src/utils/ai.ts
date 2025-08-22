import type { AiResults, Methodology } from '@/types';
import { OPENAI_CONFIG, OPENAI_ERRORS } from '@/config/openai';
import { getDemoData, getDemoDataWithoutQuiz } from './demoData';

// Cache semplice per evitare di ri-analizzare lo stesso testo
const analysisCache = new Map<string, string>();

// Prompt per l'analisi letteraria in Markdown
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
Restituisci l'analisi in formato **Markdown** ben strutturato con le seguenti sezioni:

# 📖 Analisi Letteraria

## 📝 Sintesi Narrativa
[Sintesi narrativa dettagliata (3-4 frasi) che catturi l'essenza della storia, i personaggi principali e la progressione degli eventi]

## 🔍 Analisi Simbolica

### Elementi Chiave

#### [Nome Elemento 1]
- **Descrizione**: [Descrizione dettagliata di come appare nel testo]
- **Significato Simbolico**: [Interpretazione simbolica approfondita con riferimenti archetipici]
- **Riferimenti Culturali**: [Riferimenti specifici a miti, religioni, culture, opere d'arte o letteratura]

#### [Nome Elemento 2]
- **Descrizione**: [Descrizione dettagliata di come appare nel testo]
- **Significato Simbolico**: [Interpretazione simbolica approfondita con riferimenti archetipici]
- **Riferimenti Culturali**: [Riferimenti specifici a miti, religioni, culture, opere d'arte o letteratura]

[Continua per 3-5 elementi chiave]

## 🧠 Significato Profondo

### Temi Filosofici
- [Tema filosofico 1]
- [Tema filosofico 2]
- [Tema filosofico 3]
- [Tema filosofico 4]

### Interpretazione Esistenziale
[Interpretazione esistenziale approfondita che esplora il significato umano universale del testo]

### Verità Universali
[Verdà universali e principi fondamentali espressi dal testo]

## 💡 Lezione Personale

### Insight Principale
[Principale lezione di vita, formulata in modo chiaro e memorabile]

### Applicazioni Pratiche
1. [Applicazione pratica specifica 1]
2. [Applicazione pratica specifica 2]
3. [Applicazione pratica specifica 3]

### Domanda Riflessiva
> [Domanda riflessiva profonda che stimoli l'introspezione personale]

⸻ ISTRUZIONI SPECIFICHE
• **Sintesi**: Sii preciso ma coinvolgente, cattura l'atmosfera del testo
• **Elementi simbolici**: Identifica almeno 3-5 elementi chiave, analizzali in profondità
• **Temi filosofici**: Identifica 4-5 temi principali, sii specifico
• **Interpretazione esistenziale**: Sviluppa un'analisi di 2-3 frasi ben strutturate
• **Applicazioni pratiche**: Fornisci 3 esempi concreti e specifici
• **Domanda riflessiva**: Formula una domanda che stimoli l'introspezione
• **Formato**: Usa solo Markdown standard, senza HTML o formattazione speciale

⸻ QUALITÀ RICHIESTA
• **Accuratezza**: Ogni interpretazione deve essere supportata dal testo
• **Originalità**: Offri insights unici e non banali
• **Profondità**: Vai oltre l'ovvio, esplora i significati nascosti
• **Utilità**: Rendi l'analisi utile per la crescita personale del lettore

Analizza il seguente testo con la massima attenzione e profondità:

`;

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

// Funzione per analisi con metodologia personalizzata
export const callAIWithMethodology = async (
  text: string, 
  methodology: Methodology, 
  apiKey?: string
): Promise<string> => {
  // TODO: DOMANI - Sostituire con chiamata API reale
  // Per ora usa sempre i dati demo per testare l'output
  console.log('🎭 Usando dati demo per analisi');
  console.log('📝 Metodologia:', methodology.name);
  console.log('📄 Lunghezza testo:', text.length);
  
  // Simula delay API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Restituisce dati demo formattati come JSON (come farebbe l'API reale)
  const demoResponse = {
    transcription: text.substring(0, 100) + "...",
    plotSummary: "Il testo presenta una narrazione complessa che esplora temi universali attraverso una struttura simbolica ricca di significati nascosti. La storia si sviluppa attraverso una progressione di eventi che riflettono profondi archetipi umani.",
    symbolicAnalysis: {
      keyElements: [
        {
          element: "Il Castello",
          description: "Un edificio imponente che domina il paesaggio, con torri che si innalzano verso il cielo",
          symbolicMeaning: "Rappresenta la mente umana e la ricerca di conoscenza superiore",
          culturalReferences: "Simbolo archetipico presente in molte culture, dal Graal ai castelli delle fiabe"
        },
        {
          element: "I Destini Incrociati",
          description: "Percorsi che si intersecano e si influenzano reciprocamente",
          symbolicMeaning: "La complessità delle scelte umane e l'interconnessione delle vite",
          culturalReferences: "Concetto presente nella filosofia orientale e nella letteratura moderna"
        },
        {
          element: "La Soglia",
          description: "Un passaggio che separa due mondi o stati di coscienza",
          symbolicMeaning: "Il momento di trasformazione e crescita personale",
          culturalReferences: "Simbolo universale presente in miti e rituali di iniziazione"
        }
      ]
    },
    deepMeaning: {
      philosophicalThemes: [
        "La ricerca di identità e significato",
        "L'interconnessione tra destino e libero arbitrio",
        "La trasformazione attraverso l'esperienza",
        "La dualità tra ordine e caos"
      ],
      existentialInterpretation: "Il testo esplora la condizione umana attraverso la metafora del viaggio interiore, suggerendo che ogni individuo deve attraversare il proprio 'castello' per raggiungere una comprensione più profonda di sé e del mondo.",
      universalTruths: "La crescita personale richiede coraggio, la conoscenza si acquisisce attraverso l'esperienza diretta, e ogni scelta ha conseguenze che si estendono oltre l'individuo."
    },
    personalLesson: {
      mainInsight: "Ogni ostacolo nella vita è un'opportunità di crescita, e il vero viaggio è quello interiore che ci porta a scoprire chi siamo realmente.",
      practicalApplications: [
        "Affronta le sfide come opportunità di apprendimento",
        "Rifletti sulle tue scelte e le loro conseguenze",
        "Cerca la saggezza nelle esperienze quotidiane"
      ],
      reflectiveQuestion: "Quale 'castello' stai attualmente attraversando nella tua vita, e cosa ti sta insegnando questo viaggio?"
    }
  };
  
  // Restituisce JSON stringificato (come farebbe l'API reale)
  return JSON.stringify(demoResponse, null, 2);
};

// Funzione per generare quiz con metodologia personalizzata
export const generateQuizWithMethodology = async (
  aiResults: AiResults, 
  methodology: Methodology,
  apiKey?: string
): Promise<AiResults['interactiveLearning']> => {
  // TODO: DOMANI - Sostituire con chiamata API reale
  // Per ora usa sempre i dati demo per testare l'output
  console.log('🎭 Usando dati demo per quiz');
  console.log('📝 Metodologia:', methodology.name);
  
  // Simula delay API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Restituisce dati demo per quiz
  const demoQuizData = {
    quiz: [
      {
        id: "1",
        question: "Quale elemento simbolico rappresenta la mente umana nel testo?",
        options: [
          "Il castello",
          "La foresta", 
          "Il fiume",
          "La montagna"
        ],
        correctAnswer: 0,
        explanation: "Il castello simboleggia la mente umana e la ricerca di conoscenza superiore.",
        difficulty: "medium"
      },
      {
        id: "2", 
        question: "Cosa rappresentano i 'destini incrociati'?",
        options: [
          "Le strade della città",
          "La complessità delle scelte umane",
          "I sentieri del bosco",
          "Le linee della mano"
        ],
        correctAnswer: 1,
        explanation: "I destini incrociati rappresentano la complessità delle scelte umane e l'interconnessione delle vite.",
        difficulty: "easy"
      },
      {
        id: "3",
        question: "Quale tema filosofico è centrale nel testo?",
        options: [
          "La bellezza della natura",
          "La ricerca di identità e significato",
          "L'importanza del denaro",
          "La velocità della vita moderna"
        ],
        correctAnswer: 1,
        explanation: "Il tema centrale è la ricerca di identità e significato attraverso il viaggio interiore.",
        difficulty: "hard"
      }
    ],
    flashcards: [
      {
        id: "1",
        front: "Il Castello",
        back: "Simboleggia la mente umana e la ricerca di conoscenza superiore"
      },
      {
        id: "2", 
        front: "I Destini Incrociati",
        back: "Rappresentano la complessità delle scelte umane e l'interconnessione delle vite"
      },
      {
        id: "3",
        front: "La Soglia", 
        back: "Simbolo del momento di trasformazione e crescita personale"
      }
    ],
    reflectiveQuestions: [
      "Quale 'castello' stai attualmente attraversando nella tua vita?",
      "Come puoi applicare le lezioni del testo alle tue scelte quotidiane?",
      "Quale elemento simbolico risuona di più con la tua esperienza personale?"
    ]
  };
  
  return demoQuizData;
};

