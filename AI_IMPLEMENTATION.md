# Implementazione Analisi AI - Jiraiya Sensei

## Panoramica

L'implementazione dell'analisi AI è stata completata con successo. Il sistema ora utilizza OpenAI GPT-4 per analizzare testi letterari e fornire un'analisi completa in 4 sezioni principali.

## Funzionalità Implementate

### 1. Analisi AI Completa (`src/utils/ai.ts`)
- **Prompt Specializzato**: Utilizza un prompt dettagliato per l'analisi letteraria e simbolica
- **Struttura JSON**: Richiede una risposta strutturata in formato JSON
- **Gestione Errori**: Gestione completa degli errori di rete, timeout, quota, ecc.
- **Validazione**: Validazione robusta delle risposte AI

### 2. Componenti UI Aggiornati

#### `JiraiyaSensei.tsx`
- Integrazione completa con la funzione `callAI`
- Gestione dello stato di caricamento
- Passaggio automatico al step di analisi dopo il completamento
- Gestione degli errori con toast notifications

#### `AnalysisStep.tsx`
- Visualizzazione condizionale: placeholder vs analisi completa
- Integrazione con `LiteraryAnalysisTabs`
- Pulsante di analisi funzionante

#### `LiteraryAnalysisTabs.tsx`
- **4 Tab Principali**:
  1. **Trama**: Sintesi concisa della storia
  2. **Simboli**: Analisi degli elementi simbolici chiave
  3. **Significato**: Interpretazione filosofica ed esistenziale
  4. **Lezione**: Applicazioni pratiche e riflessioni personali

### 3. Struttura Dati (`src/types/index.ts`)
- `AiResults` interface completa
- Supporto per elementi simbolici dettagliati
- Struttura per temi filosofici e lezioni personali

## Flusso di Utilizzo

1. **Upload**: L'utente carica immagini di testo
2. **OCR**: Il sistema estrae il testo dalle immagini
3. **Edit**: L'utente può modificare il testo estratto
4. **Analisi**: Cliccando "Analizza" viene chiamata l'API OpenAI
5. **Visualizzazione**: I risultati vengono mostrati in 4 tab organizzate

## Prompt AI

Il prompt è strutturato per:
- Analizzare testi narrativi brevi
- Fornire interpretazione simbolica
- Identificare temi filosofici
- Suggerire applicazioni pratiche
- Distinguere tra testo originale e interpretazioni

## Gestione Errori

- **API Key**: Validazione della chiave API
- **Rete**: Gestione errori di connessione
- **Timeout**: Timeout configurabile (60s)
- **Quota**: Gestione quota esaurita
- **Rate Limit**: Gestione limiti di richieste
- **Parsing**: Validazione risposte JSON

## Configurazione

Le impostazioni sono in `src/config/openai.ts`:
- API Key
- URL base
- Timeout
- Parametri del modello (temperature, max_tokens, ecc.)

## Esempio di Risposta AI

```json
{
  "plotSummary": "Sintesi della trama...",
  "symbolicAnalysis": {
    "keyElements": [
      {
        "element": "Elemento simbolico",
        "description": "Descrizione nel testo",
        "symbolicMeaning": "Significato simbolico",
        "culturalReferences": "Riferimenti culturali"
      }
    ]
  },
  "deepMeaning": {
    "philosophicalThemes": ["Tema 1", "Tema 2"],
    "existentialInterpretation": "Interpretazione esistenziale",
    "universalTruths": "Verdà universali"
  },
  "personalLesson": {
    "mainInsight": "Principale lezione",
    "practicalApplications": ["Applicazione 1", "Applicazione 2"],
    "reflectiveQuestion": "Domanda riflessiva"
  }
}
```

## Miglioramenti Implementati

### 1. **Configurazione Ottimizzata**
- **Modello**: `gpt-4-turbo-preview` per performance migliori
- **Temperature**: Ridotta a 0.3 per maggiore coerenza
- **Max Tokens**: Aumentato a 4000 per analisi più dettagliate
- **Penalties**: Aggiunte per ridurre ripetizioni

### 2. **Prompt Migliorato**
- **Approccio sistematico**: Metodologia accademica
- **Standard di qualità**: Completezza, profondità, chiarezza
- **Istruzioni specifiche**: Richieste dettagliate per ogni sezione
- **Collegamenti culturali**: Riferimenti a miti e archetipi

### 3. **Sistema di Retry**
- **Retry automatico**: Fino a 3 tentativi
- **Backoff esponenziale**: Ritardi crescenti tra tentativi
- **Gestione errori**: Distinzione tra diversi tipi di errore

### 4. **Cache Intelligente**
- **Cache locale**: Evita ri-analisi dello stesso testo
- **Gestione cache**: Funzioni per pulire e monitorare
- **Performance**: Risposta istantanea per testi già analizzati

## Funzionalità Quiz Implementate

### 1. **Generazione Quiz AI** (`src/utils/ai.ts`)
- **Prompt specializzato**: Per la creazione di quiz interattivi
- **3 tipi di contenuto**: Quiz a scelta multipla, flashcard, domande riflessive
- **Validazione robusta**: Controllo della struttura JSON
- **Retry automatico**: Gestione errori con retry

### 2. **Componente QuizStep** (`src/components/steps/QuizStep.tsx`)
- **3 Tab principali**:
  - **🎯 Quiz**: Domande a scelta multipla con punteggio
  - **📚 Flashcard**: Concetti chiave con fronte/retro
  - **🧠 Riflessione**: Domande per l'introspezione
- **Funzionalità interattive**:
  - Sistema di punteggio
  - Spiegazioni dettagliate
  - Navigazione tra elementi
  - Completamento con statistiche

### 3. **Integrazione Completa**
- **Generazione automatica**: Dopo l'analisi AI
- **Navigazione fluida**: Tra analisi e quiz
- **Stato persistente**: Quiz salvati nell'analisi
- **UI responsive**: Design mobile-friendly

## Prossimi Passi

1. **Esportazione**: Miglioramento dell'esportazione Markdown
2. **Storia**: Salvataggio delle analisi precedenti
3. **Personalizzazione**: Opzioni per personalizzare il prompt
4. **Analisi Comparativa**: Confronto tra diverse interpretazioni
5. **Condivisione**: Condivisione di quiz e risultati
