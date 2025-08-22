# Jiraiya Sensei - Workspace a Tre Colonne

## Panoramica

Il nuovo workspace di Jiraiya Sensei è stato convertito da un flow a step a un layout a tre colonne in stile NotebookLM, mantenendo tutta la logica esistente ma migliorando l'esperienza utente.

## Layout

### Header
- **Brand**: Logo e titolo "Jiraiya Sensei (MVP)"
- **Scorciatoie**: Indicatori delle scorciatoie da tastiera disponibili
- **Controlli**: Toggle colonne, tema, impostazioni

### Tre Colonne Collassabili

#### 1. Fonti (SX) - Ex Step 1 (OCR)
- **Uploader**: Drag & drop + bottone per immagini/PDF
- **Lista pagine**: Ordinabile con miniatura e stato
- **Azioni per pagina**: Rinomina, elimina, riesegui OCR
- **Pulizia OCR**: Merge sillabazioni, normalizza spazi
- **Unisci testo**: Scrive mergedText per la colonna centrale

#### 2. Analisi (Centro) - Ex Step 2 + Step 3
- **Editor trascrizione**: Readonly/editabile con toggle
- **Pulsanti**: Esegui analisi AI, Riesegui, Copia/Esporta Markdown
- **Risultati AI**: Render a schede (Trascrizione, Trama, Analisi simbolica, Significato, Lezione)
- **Cronologia**: Ultime 3 analisi con ripristino

#### 3. Studio (DX) - Ex Step 4
- **Configuratore quiz**: N domande, difficoltà, tipo (MCQ/boolean/cloze)
- **Quiz player**: Feedback immediato e spiegazione
- **Flashcard**: Flip Q/A opzionali
- **Export**: Quiz/flashcard in Markdown

## Scorciatoie da Tastiera

- `[` - Toggle colonna Fonti (SX)
- `]` - Toggle colonna Studio (DX)
- `\` - Focus colonna centrale
- `Cmd/Ctrl+U` - Upload file
- `Cmd/Ctrl+J` - Unisci testo
- `Cmd/Ctrl+Enter` - Esegui analisi AI

## Focus Mode

Doppio click sulla colonna centrale nasconde automaticamente le colonne laterali per un'esperienza di focus.

## Stato dell'Applicazione

### UI State
```typescript
ui: {
  leftPaneOpen: boolean;
  rightPaneOpen: boolean;
  theme: 'light'|'dark'|'system';
  isProcessingOCR: boolean;
  isCallingAI: boolean;
  isGeneratingQuiz: boolean;
}
```

### Analysis State
```typescript
analysis: {
  lastAiResultRaw?: string;
  lastAiResultParsed?: any;
  history: Array<{
    id: string;
    raw: string;
    parsed?: any;
    createdAt: number;
  }>;
}
```

### Quiz State
```typescript
quiz: {
  items: QuizItem[];
  lastScore?: { correct: number; total: number };
}
```

### Settings State
```typescript
settings: {
  ocrApiKey?: string;
  openaiApiKey?: string;
}
```

## Persistenza

- **SessionStorage**: Stato persistito con debounce (1 secondo)
- **Reset**: Pulsante "Reset sessione" per pulire tutto
- **Refresh**: Mantiene lo stato attivo

## Componenti Principali

### Layout
- `AppShell`: Header con controlli e scorciatoie
- `ThreePane`: Layout a tre colonne collassabili
- `Workspace`: Pagina principale che integra tutto

### Colonne
- `SourcesPane`: Gestione fonti e OCR
- `AnalysisPane`: Editor e analisi AI
- `StudyPane`: Quiz e flashcard

### Componenti di Supporto
- `TranscriptEditor`: Editor di testo semplificato
- `LiteraryAnalysisTabs`: Visualizzazione risultati AI
- `PageList` & `PageItem`: Gestione pagine OCR
- `Dropzone`: Upload file con drag & drop

## Routing

- `/` - Landing page
- `/workspace` - Nuovo workspace a tre colonne
- `/app` - Reindirizza a `/workspace` (legacy)
- `/how-it-works` - Pagina informativa

## Compatibilità

- **Logica esistente**: Tutta preservata e riutilizzata
- **API**: Nessuna modifica alle integrazioni OCR/OpenAI
- **Dati**: Strutture esistenti mantenute dove possibile
- **Demo**: Modalità demo ancora disponibile

## Performance

- **Lazy loading**: Componenti caricati on-demand
- **Debounce**: Salvataggio stato ottimizzato
- **AbortController**: Operazioni lunghe cancellabili
- **Memoization**: Componenti ottimizzati per re-render

## Accessibilità

- **Focus ring**: Evidenti per navigazione tastiera
- **ARIA roles**: Appropriati per screen reader
- **Drag & drop**: Accessibile via tastiera
- **Indicatori**: Testo + icona, non solo colore

## Stile

- **Tailwind**: Design system consistente
- **Cards**: Morbide e moderne
- **Tipografia**: Leggibile e gerarchica
- **Temi**: Light/Dark/System supportati
