# Jiraiya Sensei - Home Page & Project Management

## Panoramica

La nuova Home page di Jiraiya Sensei introduce un sistema completo di gestione progetti e metodologie di analisi, trasformando l'app da un semplice workspace a un ecosistema completo per l'analisi letteraria.

## Funzionalità Principali

### 🏠 **Home Page (`/`)**
- **Entrypoint principale** dell'applicazione
- Layout a due sezioni verticali responsive
- Gestione completa di progetti e metodologie

### 📁 **Gestione Progetti**
- **Creazione progetti** con titolo, descrizione e metodologia
- **Lista progetti** con ricerca, filtri e ordinamento
- **Azioni sui progetti**: Apri, Rinomina, Duplica, Elimina
- **Statistiche** in tempo reale (pagine, analisi completate)
- **Navigazione diretta** al workspace del progetto

### 🔧 **Gestione Metodologie**
- **CRUD completo** per metodologie personalizzate
- **Editor avanzato** con validazione JSON Schema
- **Import/Export** in formato JSON
- **Metodologia di sistema** predefinita (Critico letterario)
- **Anteprima prompt** con highlight delle variabili

## Architettura

### Routing
```
/                    → Home page (entrypoint)
/workspace/:id       → Workspace specifico progetto
/methodologies       → Alias per tab Metodologie
/landing             → Landing page legacy
```

### Stato dell'Applicazione
```typescript
interface SessionState {
  projects: Project[];
  methodologies: Methodology[];
  ui: {
    home?: {
      newProject: { title: string; description?: string; methodologyId?: string };
      methodologyEditor?: { mode: 'create'|'edit'|'duplicate'; draft: Methodology; isOpen: boolean };
    };
  };
}
```

### Persistenza
- **sessionStorage** con debounce 500ms
- **Chiave**: `jiraiya:state`
- **Reset sessione** disponibile dall'header
- **Export/Import** stato completo

## Componenti Principali

### `Home.tsx`
- **Pagina principale** che integra tutti i componenti
- **Gestione stato** globale della sessione
- **Routing** e navigazione tra progetti
- **Modali** per editor e import/export

### `NewProjectCard.tsx`
- **Form di creazione** progetto
- **Validazione** inline (titolo obbligatorio)
- **Selezione metodologia** con preview
- **Scorciatoie** da tastiera (Cmd+Enter)

### `ProjectList.tsx`
- **Lista progetti** con ricerca e filtri
- **Ordinamento** per titolo, data creazione/modifica
- **Filtro per metodologia**
- **Empty states** informativi

### `ProjectCard.tsx`
- **Card progetto** con statistiche
- **Azioni** dropdown (Apri, Rinomina, Duplica, Elimina)
- **Badge** metodologia e stato
- **Informazioni** dettagliate (date, pagine, analisi)

### `MethodologyList.tsx`
- **Lista metodologie** con ricerca
- **Distinzione** tra sistema e personalizzate
- **Azioni** per ogni metodologia
- **Statistiche** (totali, personalizzate, di sistema)

### `MethodologyEditor.tsx`
- **Editor completo** per metodologie
- **Validazione** JSON Schema in tempo reale
- **Anteprima prompt** con toggle
- **Post-processing** options
- **Modal** responsive

### `JsonImportExport.tsx`
- **Import** drag & drop o file picker
- **Export** con nome file automatico
- **Validazione** formato JSON
- **Gestione conflitti** (nomi duplicati)

## Hook e Utilità

### `useSessionState.ts`
- **Gestione stato** globale
- **Persistenza** automatica in sessionStorage
- **Metodologia default** sempre presente
- **Funzioni** reset, export, import

### `json-validation.ts`
- **Validazione** JSON Schema
- **Formattazione** JSON
- **Validazione** output contro schema

## Flusso Utente

### 1. Creazione Progetto
1. **Inserimento** titolo e descrizione
2. **Selezione** metodologia (default o personalizzata)
3. **Creazione** → redirect automatico a `/workspace/:id`
4. **Workspace** popolato con dati progetto

### 2. Gestione Metodologie
1. **Creazione** nuova metodologia
2. **Definizione** system prompt con `{{TRANSCRIPTION}}`
3. **Validazione** JSON Schema
4. **Salvataggio** → disponibile per nuovi progetti

### 3. Import/Export
1. **Export** metodologia → file JSON
2. **Import** → validazione e merge
3. **Gestione conflitti** → rinomina automatica
4. **Disponibilità** immediata per progetti

## Scorciatoie da Tastiera

### Home Page
- `Cmd+Enter` → Crea progetto (nel form)
- `Cmd+Enter` → Salva metodologia (nell'editor)

### Workspace (esistenti)
- `[` / `]` → Toggle colonne
- `\` → Focus centro
- `Cmd+U` → Upload
- `Cmd+J` → Unisci testo
- `Cmd+Enter` → Analisi AI

## Responsive Design

### Desktop (lg+)
- **Layout a due colonne** (Nuovo Progetto | Tabs)
- **Grid 3 colonne** per progetti/metodologie
- **Modal full-size** per editor

### Mobile/Tablet
- **Layout stack** (Nuovo Progetto sopra, Tabs sotto)
- **Grid 1-2 colonne** per cards
- **Modal responsive** con scroll

## Integrazione con Workspace

### Sincronizzazione
- **Stato progetto** sincronizzato automaticamente
- **Debounce** 1 secondo per performance
- **Aggiornamento** timestamp progetto

### Metodologie
- **Dropdown** nel workspace popolato da session
- **Cambio metodologia** → aggiornamento progetto
- **Validazione** output contro schema selezionato

## Accessibilità

### ARIA e Semantica
- **Label** per tutti gli input
- **Focus ring** evidenti
- **ARIA roles** appropriati
- **Keyboard navigation** completa

### Feedback Utente
- **Toast** per azioni importanti
- **Loading states** con spinner
- **Error states** con messaggi chiari
- **Empty states** con CTA

## Performance

### Ottimizzazioni
- **Debounce** per salvataggio stato
- **Lazy loading** per modali
- **Memoization** per componenti pesanti
- **Virtual scrolling** per liste lunghe (futuro)

### Bundle Size
- **Code splitting** per modali
- **Tree shaking** per icone
- **Compressione** JSON per sessionStorage

## Sicurezza

### Validazione Input
- **Sanitizzazione** titoli e descrizioni
- **Validazione** JSON Schema
- **Escape** output HTML
- **Rate limiting** per azioni critiche

### Gestione Errori
- **Try-catch** per operazioni JSON
- **Fallback** per dati corrotti
- **Recovery** automatico da errori
- **Logging** errori critici

## Roadmap

### Prossime Funzionalità
- **Template progetti** predefiniti
- **Collaborazione** multi-utente
- **Versioning** metodologie
- **Analytics** uso progetti
- **Backup** cloud (opzionale)

### Miglioramenti
- **Drag & drop** riordinamento progetti
- **Bulk actions** per progetti
- **Advanced search** con filtri multipli
- **Keyboard shortcuts** globali
- **Themes** personalizzabili

## Conclusione

La nuova Home page trasforma Jiraiya Sensei da un semplice workspace a un ecosistema completo per l'analisi letteraria, offrendo:

✅ **Gestione progetti** completa e intuitiva
✅ **Metodologie personalizzabili** con editor avanzato
✅ **Persistenza** robusta con sessionStorage
✅ **UX moderna** con feedback immediato
✅ **Integrazione seamless** con workspace esistente
✅ **Accessibilità** e performance ottimizzate

L'app mantiene tutta la funzionalità esistente del workspace a tre colonne, aggiungendo un layer di gestione progetti che rende il flusso di lavoro molto più produttivo e organizzato.
