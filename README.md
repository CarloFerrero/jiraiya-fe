# Jiraiya Sensei - Critico Letterario e Simbolico

Un'applicazione web avanzata per l'analisi letteraria e simbolica di testi narrativi, utilizzando OCR avanzato e intelligenza artificiale.

## 🚀 Funzionalità

### 📖 OCR Avanzato
- **OCR.space API**: Riconoscimento ottico dei caratteri professionale
- **Supporto multilingua**: Ottimizzato per l'italiano
- **Validazione file**: Controllo automatico di formato e dimensione
- **Compressione automatica**: Ridimensionamento automatico di immagini grandi (>1MB)
- **Progress tracking**: Indicatori di progresso in tempo reale
- **Pulizia testo**: Rimozione automatica di errori OCR comuni

### 🤖 Analisi AI con OpenAI
- **GPT-3.5 Turbo**: Analisi letteraria avanzata
- **Prompt specializzato**: Critico letterario e simbolico esperto
- **Analisi strutturata**: 
  - Trascrizione fedele
  - Sintesi della trama
  - Analisi simbolica degli elementi chiave
  - Interpretazione filosofica ed esistenziale
  - Lezioni personali applicabili alla vita

### 🎯 Apprendimento Interattivo
- **Quiz di comprensione**: Domande a scelta multipla con difficoltà variabile
- **Flashcards**: Carte interattive per memorizzare concetti chiave
- **Domande riflessive**: Stimoli per la riflessione personale e l'applicazione pratica
- **Progress tracking**: Monitoraggio del progresso e punteggi
- **Feedback immediato**: Spiegazioni dettagliate per ogni risposta

### 📊 Interfaccia Utente
- **Design moderno**: UI/UX intuitiva con shadcn/ui
- **Layout responsive**: Ottimizzato per desktop e mobile
- **Gestione file**: Drag & drop, preview, ordinamento
- **Export**: Esportazione in formato Markdown
- **Tabs organizzate**: Navigazione chiara tra le sezioni
- **Apprendimento interattivo**: Quiz, flashcards e riflessioni guidate

## 🛠️ Tecnologie

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **OCR**: OCR.space API
- **AI**: OpenAI GPT-3.5 Turbo
- **State Management**: React Hooks
- **Build Tool**: Vite

## 📦 Installazione

```bash
# Clona il repository
git clone <repository-url>
cd sensei-pages-ai

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build
```

## ⚙️ Configurazione

### Gestione File
- **Formati supportati**: PNG, JPG, JPEG, PDF
- **Dimensione massima**: 10MB per file
- **Compressione automatica**: Le immagini >1MB vengono compresse automaticamente
- **Ridimensionamento**: Massimo 2048x2048 pixel con qualità 80%

### OCR.space API
L'applicazione utilizza OCR.space API per il riconoscimento ottico dei caratteri. La configurazione è presente in `src/config/ocr.ts`.

### OpenAI API
L'integrazione con OpenAI è configurata in `src/config/openai.ts` con le seguenti impostazioni:
- **Modello**: GPT-3.5 Turbo
- **Token massimi**: 1000
- **Temperatura**: 0.7
- **Retry logic**: 3 tentativi con backoff esponenziale

## 🎯 Utilizzo

1. **Carica le pagine**: Trascina le immagini del libro o seleziona i file
2. **OCR automatico**: Il testo viene estratto automaticamente
3. **Unisci testo**: Combina il testo di tutte le pagine
4. **Analizza con AI**: Clicca "Analizza con Sensei Critico"
5. **Esplora i risultati**: Naviga tra le diverse sezioni dell'analisi
6. **Testa la comprensione**: Utilizza quiz, flashcards e domande riflessive
7. **Export**: Scarica l'analisi completa in formato Markdown

## 📁 Struttura del Progetto

```
src/
├── components/          # Componenti React
│   ├── ui/             # Componenti UI base (shadcn/ui)
│   ├── JiraiyaSensei.tsx
│   ├── Dropzone.tsx
│   ├── PageList.tsx
│   └── ...
├── config/             # Configurazioni
│   ├── ocr.ts         # Configurazione OCR.space
│   └── openai.ts      # Configurazione OpenAI
├── utils/              # Utility functions
│   ├── ocr.ts         # Funzioni OCR
│   └── ai.ts          # Funzioni AI
├── types/              # TypeScript types
└── pages/              # Pagine dell'applicazione
```

## 🔧 Personalizzazione

### Modificare il Prompt AI
Il prompt per l'analisi letteraria può essere personalizzato in `src/config/openai.ts` nella costante `LITERARY_ANALYSIS_PROMPT`.

### Configurazione OCR
I parametri OCR possono essere modificati in `src/config/ocr.ts`:
- Lingua di riconoscimento
- Engine OCR
- Dimensioni file supportate
- Messaggi di errore

## 🚀 Deployment

L'applicazione può essere deployata su qualsiasi piattaforma che supporti applicazioni React statiche:

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Configurazione automatica tramite GitHub Actions

## 📝 Licenza

Questo progetto è rilasciato sotto licenza MIT.

## 🤝 Contributi

I contributi sono benvenuti! Per favore:
1. Fork il repository
2. Crea un branch per la tua feature
3. Commit le modifiche
4. Push al branch
5. Apri una Pull Request

## 📞 Supporto

Per supporto o domande, apri un issue su GitHub o contatta il team di sviluppo.
