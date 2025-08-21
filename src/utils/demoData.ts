import type { AiResults, InteractiveLearning } from '@/types';

// Demo data for testing without API calls
export const DEMO_AI_RESULTS: AiResults = {
  transcription: "Demo transcription text",
  plotSummary: "Questa è una demo della sintesi narrativa che mostra come apparirebbe l'analisi di un testo letterario. La storia racconta di un viaggio interiore attraverso simboli e metafore, dove il protagonista affronta sfide esistenziali e scopre verità profonde sulla natura umana.",
  symbolicAnalysis: {
    keyElements: [
      {
        element: "Il Viaggio",
        description: "Il protagonista intraprende un percorso fisico e spirituale attraverso diversi paesaggi simbolici",
        symbolicMeaning: "Rappresenta il percorso di crescita personale e la ricerca di identità. Il viaggio è un archetipo universale che simboleggia la trasformazione interiore e l'evoluzione della coscienza.",
        culturalReferences: "Presente in miti greci (Odissea), letteratura medievale (Divina Commedia), e narrativa moderna (Il Signore degli Anelli)"
      },
      {
        element: "Il Labirinto",
        description: "Una struttura complessa che il protagonista deve attraversare per raggiungere la sua destinazione",
        symbolicMeaning: "Simbolizza le sfide della vita, la confusione esistenziale e la ricerca di una via d'uscita. Rappresenta anche la complessità della mente umana e i percorsi tortuosi della comprensione.",
        culturalReferences: "Mitologia greca (Labirinto di Creta), letteratura borgesiana, psicologia junghiana"
      },
      {
        element: "La Luce",
        description: "Un bagliore che guida il protagonista nei momenti di buio e confusione",
        symbolicMeaning: "Rappresenta la saggezza, la verità e la consapevolezza. La luce è un simbolo universale di speranza, conoscenza e illuminazione spirituale.",
        culturalReferences: "Platonismo (mito della caverna), religioni monoteistiche, filosofia illuminista"
      },
      {
        element: "L'Ombra",
        description: "Una presenza oscura che segue il protagonista e rappresenta i suoi lati nascosti",
        symbolicMeaning: "Simbolizza gli aspetti repressi della personalità, le paure e le debolezze che devono essere integrate per raggiungere la completezza.",
        culturalReferences: "Psicologia analitica di Jung, letteratura gotica, mitologia nordica"
      },
      {
        element: "Il Ponte",
        description: "Una struttura che collega due sponde opposte di un fiume o abisso",
        symbolicMeaning: "Rappresenta la transizione, il passaggio da uno stato all'altro, la connessione tra opposti e la possibilità di superare le divisioni.",
        culturalReferences: "Mitologia norrena (Bifröst), tradizioni esoteriche, psicologia transpersonale"
      }
    ]
  },
  deepMeaning: {
    philosophicalThemes: [
      "La ricerca dell'identità e del significato esistenziale",
      "Il dualismo tra luce e ombra nella natura umana",
      "La trasformazione attraverso l'esperienza e la sofferenza",
      "L'interconnessione tra il microcosmo personale e il macrocosmo universale",
      "La trascendenza degli opposti attraverso la saggezza"
    ],
    existentialInterpretation: "Il testo esplora la condizione umana attraverso la metafora del viaggio interiore, suggerendo che la vera saggezza emerge dall'integrazione degli aspetti opposti della personalità e dalla capacità di navigare attraverso le complessità dell'esistenza.",
    universalTruths: "La crescita personale richiede il coraggio di affrontare le proprie ombre, la pazienza di attraversare i labirinti della vita, e la saggezza di riconoscere che ogni sfida è un'opportunità di trasformazione."
  },
  personalLesson: {
    mainInsight: "La vera saggezza non consiste nell'evitare le difficoltà, ma nell'imparare a navigarle con consapevolezza e coraggio, integrando ogni esperienza come parte del proprio percorso di crescita.",
    practicalApplications: [
      "Pratica la riflessione quotidiana per riconoscere i pattern ricorrenti nella tua vita",
      "Accogli le difficoltà come opportunità di crescita invece di evitarle",
      "Cerca di integrare gli aspetti opposti della tua personalità per raggiungere l'equilibrio"
    ],
    reflectiveQuestion: "Quali sono i 'labirinti' che stai attraversando nella tua vita attuale, e come potresti vederli come opportunità di crescita invece che come ostacoli?"
  }
};

export const DEMO_INTERACTIVE_LEARNING: InteractiveLearning = {
  quiz: [
    {
      id: "demo-q1",
      question: "Cosa rappresenta simbolicamente il viaggio nel testo?",
      options: [
        "Solo un movimento fisico da un luogo all'altro",
        "Il percorso di crescita personale e ricerca di identità",
        "Una fuga dalla realtà",
        "Un semplice spostamento geografico"
      ],
      correctAnswer: 1,
      explanation: "Il viaggio è un archetipo universale che simboleggia la trasformazione interiore e l'evoluzione della coscienza, non solo un movimento fisico.",
      difficulty: "easy"
    },
    {
      id: "demo-q2",
      question: "Quale significato filosofico ha l'elemento della luce?",
      options: [
        "Solo illuminazione fisica",
        "Saggezza, verità e consapevolezza",
        "Calore e comfort",
        "Decorazione estetica"
      ],
      correctAnswer: 1,
      explanation: "La luce è un simbolo universale di speranza, conoscenza e illuminazione spirituale, che va oltre il semplice aspetto fisico.",
      difficulty: "medium"
    },
    {
      id: "demo-q3",
      question: "Come dovremmo interpretare la presenza dell'ombra nel testo?",
      options: [
        "Come un elemento puramente negativo da evitare",
        "Come gli aspetti repressi della personalità da integrare",
        "Come una semplice assenza di luce",
        "Come un errore dell'autore"
      ],
      correctAnswer: 1,
      explanation: "L'ombra rappresenta gli aspetti repressi della personalità che devono essere integrati per raggiungere la completezza, non eliminati.",
      difficulty: "hard"
    }
  ],
  flashcards: [
    {
      id: "demo-fc1",
      front: "Archetipo",
      back: "Un modello o simbolo universale presente nell'inconscio collettivo che appare in miti, sogni e opere d'arte di diverse culture.",
      category: "concept"
    },
    {
      id: "demo-fc2",
      front: "Dualismo",
      back: "La concezione filosofica che vede la realtà divisa in due principi opposti e complementari (es. luce/ombra, bene/male).",
      category: "concept"
    },
    {
      id: "demo-fc3",
      front: "Trasformazione",
      back: "Il processo di cambiamento profondo che porta a una nuova comprensione o stato di consapevolezza.",
      category: "theme"
    },
    {
      id: "demo-fc4",
      front: "Labirinto",
      back: "Simbolo delle sfide della vita e della complessità della mente umana, rappresenta il percorso tortuoso verso la comprensione.",
      category: "symbol"
    }
  ],
  reflectiveQuestions: [
    {
      id: "demo-rq1",
      question: "Come potresti applicare la metafora del viaggio alla tua vita personale?",
      prompts: [
        "Quali 'tappe' hai attraversato nella tua crescita personale?",
        "Quali sfide ti hanno trasformato di più?",
        "Come vedi il tuo percorso futuro?"
      ],
      category: "personal"
    },
    {
      id: "demo-rq2",
      question: "Quali aspetti della tua personalità consideri come 'luce' e quali come 'ombra'?",
      prompts: [
        "Come ti relazioni con questi aspetti opposti?",
        "Come potresti integrarli meglio?",
        "Quali benefici vedi nell'accettare entrambi?"
      ],
      category: "analytical"
    },
    {
      id: "demo-rq3",
      question: "Come potresti creare la tua 'mappa' per navigare i labirinti della vita?",
      prompts: [
        "Quali strumenti ti aiutano a orientarti nelle difficoltà?",
        "Come sviluppi la tua saggezza interiore?",
        "Quali risorse ti sostengono nei momenti di confusione?"
      ],
      category: "creative"
    }
  ]
};

// Function to get demo data with interactive learning
export const getDemoData = (): AiResults => {
  return {
    ...DEMO_AI_RESULTS,
    interactiveLearning: DEMO_INTERACTIVE_LEARNING
  };
};

// Function to get demo data without interactive learning
export const getDemoDataWithoutQuiz = (): AiResults => {
  return DEMO_AI_RESULTS;
};
