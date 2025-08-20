import type { AiResults } from '@/types';

const AI_PROMPT_TEMPLATE = `Sei "Jiraiya Sensei", un assistente per lo studio attivo da pagine di libri cartacei.
Analizza il seguente testo e rispondi SOLO con JSON valido nel formato:

{
  "transcription": "<trascrizione fedele, eventualmente ripulita da OCR>",
  "summaries": {
    "tweet": "<max 280 caratteri>",
    "paragraph": "<~150 parole>",
    "bullets": ["punto 1", "punto 2", "punto 3", "..."]
  },
  "quiz": [
    {
      "question": "<domanda 1>",
      "options": ["A", "B", "C", "D"],
      "answerIndex": 0,
      "explanation": "<perché la risposta è corretta>"
    },
    {
      "question": "<domanda 2>",
      "options": ["A", "B", "C", "D"],
      "answerIndex": 2,
      "explanation": "<spiegazione>"
    },
    {
      "question": "<domanda 3>",
      "options": ["A", "B", "C", "D"],
      "answerIndex": 1,
      "explanation": "<spiegazione>"
    }
  ],
  "reflection": "Formula una domanda socratica personale (una sola frase, senza suggerire risposte).",
  "flashcards": [
    {"q": "<domanda breve 1>", "a": "<risposta breve 1>"},
    {"q": "<domanda breve 2>", "a": "<risposta breve 2>"},
    {"q": "<domanda breve 3>", "a": "<risposta breve 3>"},
    {"q": "<domanda breve 4>", "a": "<risposta breve 4>"},
    {"q": "<domanda breve 5>", "a": "<risposta breve 5>"}
  ]
}

Testo da analizzare:
{{TESTO}}`;

// Mock AI function - replace with actual AI service
export const callAI = async (text: string, apiKey?: string): Promise<AiResults> => {
  const prompt = AI_PROMPT_TEMPLATE.replace('{{TESTO}}', text);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response for demo purposes
  const mockResponse: AiResults = {
    transcription: text,
    summaries: {
      tweet: "📚 Apprendimento attivo: trasforma ogni pagina in conoscenza applicabile. #StudyTips #Learning",
      paragraph: "L'apprendimento attivo rappresenta un approccio pedagogico che enfatizza il coinvolgimento diretto dello studente nel processo di acquisizione della conoscenza. Attraverso tecniche come l'auto-interrogazione, la sintesi e l'applicazione pratica, gli studenti sviluppano una comprensione più profonda e duratura dei contenuti studiati. Questo metodo si contrappone all'apprendimento passivo tradizionale, promuovendo invece la partecipazione attiva e la riflessione critica.",
      bullets: [
        "L'apprendimento attivo coinvolge direttamente lo studente",
        "Utilizza tecniche di auto-interrogazione e sintesi",
        "Promuove comprensione profonda e duratura",
        "Si oppone ai metodi passivi tradizionali",
        "Enfatizza riflessione critica e applicazione pratica"
      ]
    },
    quiz: [
      {
        question: "Qual è la caratteristica principale dell'apprendimento attivo?",
        options: [
          "Il coinvolgimento passivo dello studente",
          "Il coinvolgimento diretto dello studente",
          "L'uso esclusivo di libri di testo",
          "La memorizzazione meccanica"
        ],
        answerIndex: 1,
        explanation: "L'apprendimento attivo si basa sul coinvolgimento diretto e partecipativo dello studente nel processo di apprendimento."
      },
      {
        question: "Quale tecnica NON è tipica dell'apprendimento attivo?",
        options: [
          "Auto-interrogazione",
          "Sintesi personale",
          "Memorizzazione passiva",
          "Riflessione critica"
        ],
        answerIndex: 2,
        explanation: "La memorizzazione passiva è caratteristica dell'apprendimento tradizionale, non di quello attivo."
      },
      {
        question: "Che tipo di comprensione promuove l'apprendimento attivo?",
        options: [
          "Superficiale e temporanea",
          "Profonda e duratura",
          "Meccanica e ripetitiva",
          "Teorica e astratta"
        ],
        answerIndex: 1,
        explanation: "L'apprendimento attivo mira a sviluppare una comprensione profonda e duratura dei contenuti."
      }
    ],
    reflection: "In che modo potresti applicare i principi dell'apprendimento attivo alla tua routine di studio quotidiana?",
    flashcards: [
      { q: "Cosa significa apprendimento attivo?", a: "Coinvolgimento diretto dello studente nel processo di apprendimento" },
      { q: "Qual è l'opposto dell'apprendimento attivo?", a: "Apprendimento passivo tradizionale" },
      { q: "Nome una tecnica di apprendimento attivo", a: "Auto-interrogazione" },
      { q: "Che tipo di comprensione sviluppa?", a: "Profonda e duratura" },
      { q: "Elemento chiave dell'approccio attivo", a: "Riflessione critica" }
    ]
  };
  
  return mockResponse;
};

export const validateAIResponse = (response: string): AiResults | null => {
  try {
    const parsed = JSON.parse(response);
    
    // Validate structure
    if (!parsed.transcription || !parsed.summaries || !parsed.quiz || !parsed.reflection || !parsed.flashcards) {
      return null;
    }
    
    // Validate summaries
    if (!parsed.summaries.tweet || !parsed.summaries.paragraph || !Array.isArray(parsed.summaries.bullets)) {
      return null;
    }
    
    // Validate quiz
    if (!Array.isArray(parsed.quiz) || parsed.quiz.length !== 3) {
      return null;
    }
    
    // Validate flashcards
    if (!Array.isArray(parsed.flashcards) || parsed.flashcards.length !== 5) {
      return null;
    }
    
    return parsed as AiResults;
  } catch {
    return null;
  }
};