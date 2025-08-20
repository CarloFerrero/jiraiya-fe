import type { AiResults } from '@/types';

const AI_PROMPT_TEMPLATE = `Agisci come un critico letterario e simbolico esperto, specializzato nell'analisi di testi narrativi brevi o estratti di opere letterarie, con competenze in interpretazione tematica, simbolica e filosofica.

⸻ Task
• Ricevere una storia o un estratto (in testo o immagini da trascrivere).
• Fornire:
  1. Trascrizione fedele (se fornita in immagini).
  2. Sintesi concisa della trama.
  3. Analisi simbolica di eventuali elementi chiave (oggetti, personaggi, luoghi, simboli, ecc.).
  4. Interpretazione del significato profondo (livello filosofico/esistenziale).
  5. Possibili lezioni applicabili alla vita quotidiana.

⸻ Context
• Il testo può contenere riferimenti culturali, storici, religiosi o artistici.
• L'utente può voler collegare il significato della storia alla propria vita o a situazioni concrete.
• È importante mantenere la trascrizione invariata, senza modificare o interpretare nella fase di copia.

⸻ Reasoning
• Trascrivere prima in modo fedele per garantire una base solida di analisi.
• Identificare il filo narrativo principale e i concetti chiave.
• Collegare elementi simbolici a significati condivisi (miti, archetipi, tarocchi, ecc.) e al contesto della storia.
• Sviluppare l'analisi dal livello superficiale (trama) a quello profondo (significato universale), fino alla dimensione personale.
• Assicurarsi che ogni affermazione interpretativa sia chiaramente distinta da ciò che è direttamente nel testo.

⸻ Output format
Restituisci l'analisi in formato JSON valido:

{
  "transcription": "<trascrizione fedele del testo, senza modifiche o interpretazioni>",
  "plotSummary": "<sintesi concisa della trama in 100-150 parole>",
  "symbolicAnalysis": {
    "keyElements": [
      {
        "element": "<nome elemento simbolico>",
        "description": "<descrizione nel testo>",
        "symbolicMeaning": "<interpretazione simbolica>",
        "culturalReferences": "<riferimenti culturali, mitologici, archetipici>"
      }
    ]
  },
  "deepMeaning": {
    "philosophicalThemes": ["<tema 1>", "<tema 2>", "<tema 3>"],
    "existentialInterpretation": "<significato profondo e universale>",
    "universalTruths": "<verità universali emerse dal testo>"
  },
  "personalLesson": {
    "mainInsight": "<lezione principale applicabile alla vita>",
    "practicalApplications": [
      "<applicazione pratica 1>",
      "<applicazione pratica 2>",
      "<applicazione pratica 3>"
    ],
    "reflectiveQuestion": "<domanda per l'auto-riflessione>"
  }
}

⸻ Stop conditions
Il compito è completato quando:
• La storia è trascritta fedelmente (se era in immagine).
• Sono fornite tutte le 5 sezioni nel formato richiesto.
• L'analisi distingue chiaramente tra testo originale e interpretazioni.
• Le lezioni personali sono formulate in modo concreto e applicabile.

Testo da analizzare:
{{TESTO}}`;

// Mock AI function - replace with actual AI service
export const callAI = async (text: string, apiKey?: string): Promise<AiResults> => {
  const prompt = AI_PROMPT_TEMPLATE.replace('{{TESTO}}', text);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response for demo purposes (literary analysis)
  const mockResponse: AiResults = {
    transcription: text,
    plotSummary: "La storia narra di un protagonista che attraversa un viaggio di trasformazione, incontrando ostacoli e alleati che lo guidano verso una comprensione più profonda di sé stesso e del mondo circostante. Gli eventi si susseguono in un crescendo drammatico che culmina in una rivelazione che cambia la percezione della realtà.",
    symbolicAnalysis: {
      keyElements: [
        {
          element: "Il Viaggio",
          description: "Il percorso fisico o metaforico del protagonista",
          symbolicMeaning: "Rappresenta l'evoluzione interiore e la ricerca di significato",
          culturalReferences: "Archetipo del Hero's Journey di Campbell, miti omerici"
        },
        {
          element: "La Soglia",
          description: "Momento di passaggio o decisione cruciale",
          symbolicMeaning: "Trasformazione, morte simbolica del vecchio sé",
          culturalReferences: "Riti di passaggio, simbolismo degli archetipi junghiani"
        },
        {
          element: "Il Mentore",
          description: "Figura guida che appare nel momento del bisogno",
          symbolicMeaning: "La saggezza interiore, la voce della coscienza superiore",
          culturalReferences: "Archetipo del Saggio, tradizione dei maestri spirituali"
        }
      ]
    },
    deepMeaning: {
      philosophicalThemes: [
        "La ricerca dell'identità autentica",
        "Il confronto con l'ignoto e la paura",
        "La trasformazione attraverso l'esperienza"
      ],
      existentialInterpretation: "Il testo esplora la condizione umana universale di crescita attraverso l'adversità, suggerendo che ogni sfida è un'opportunità di evoluzione spirituale e che la vera conoscenza nasce dall'esperienza diretta piuttosto che dall'apprendimento teorico.",
      universalTruths: "La crescita richiede coraggio per lasciare la zona di comfort; la saggezza emerge dall'integrazione di esperienza e riflessione; ogni individuo possiede le risorse interiori necessarie per superare le proprie sfide."
    },
    personalLesson: {
      mainInsight: "Ogni ostacolo nella vita è un'opportunità mascherata per sviluppare qualità interiori che non sapevamo di possedere.",
      practicalApplications: [
        "Affrontare le sfide quotidiane come occasioni di crescita personale",
        "Cercare il significato profondo nelle esperienze difficili",
        "Sviluppare la fiducia nelle proprie risorse interiori"
      ],
      reflectiveQuestion: "Quale sfida attuale nella tua vita potrebbe essere in realtà un invito a sviluppare una parte di te ancora inesplorata?"
    }
  };
  
  return mockResponse;
};

export const validateAIResponse = (response: string): AiResults | null => {
  try {
    const parsed = JSON.parse(response);
    
    // Validate basic structure
    if (!parsed.transcription || !parsed.plotSummary || !parsed.symbolicAnalysis || !parsed.deepMeaning || !parsed.personalLesson) {
      return null;
    }
    
    // Validate symbolicAnalysis
    if (!parsed.symbolicAnalysis.keyElements || !Array.isArray(parsed.symbolicAnalysis.keyElements)) {
      return null;
    }
    
    // Validate deepMeaning
    if (!Array.isArray(parsed.deepMeaning.philosophicalThemes) || 
        !parsed.deepMeaning.existentialInterpretation || 
        !parsed.deepMeaning.universalTruths) {
      return null;
    }
    
    // Validate personalLesson
    if (!parsed.personalLesson.mainInsight || 
        !Array.isArray(parsed.personalLesson.practicalApplications) || 
        !parsed.personalLesson.reflectiveQuestion) {
      return null;
    }
    
    return parsed as AiResults;
  } catch {
    return null;
  }
};