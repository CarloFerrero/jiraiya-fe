import { useState, useEffect, useCallback } from 'react';
import type { SessionState, Project, Methodology } from '@/types';
import { getDefaultAiModel } from '@/data/aiModels';

const SESSION_STORAGE_KEY = 'jiraiya:state';

// Default methodology
const DEFAULT_METHODOLOGY: Methodology = {
  id: 'default-literary-criticism',
  name: 'Critico letterario (5 sezioni)',
  description: 'Analisi letteraria standard con 5 sezioni: Trascrizione, Trama, Analisi simbolica, Significato, Lezione',
  systemPrompt: `Sei un critico letterario esperto specializzato nell'analisi profonda di testi narrativi. 

Analizza il seguente testo con particolare attenzione a simboli, temi e significati profondi:

{{TRANSCRIPTION}}

Fornisci un'analisi completa e approfondita che esplori tutti gli aspetti significativi del testo.`,
  outputFormat: `Struttura l'analisi in formato markdown con le seguenti sezioni:

# 📖 Analisi Letteraria

## 📝 Sintesi Narrativa
Una sintesi coinvolgente della trama in 3-4 frasi

## 🔍 Analisi Simbolica
### Elementi Chiave
Per ogni elemento simbolico importante:
- **Nome elemento**
- **Descrizione**: Come appare nel testo
- **Significato simbolico**: Interpretazione approfondita
- **Riferimenti culturali**: Collegamenti a miti, culture, letteratura

## 🧠 Significato Profondo
### Temi Filosofici
Elenco puntato dei temi principali

### Interpretazione Esistenziale
Analisi del significato umano universale (2-3 frasi)

### Verità Universali
Principi fondamentali espressi dal testo

## 💡 Lezione Personale
### Insight Principale
La lezione di vita principale

### Applicazioni Pratiche
3 esempi concreti di come applicare gli insegnamenti

### Domanda Riflessiva
Una domanda che stimoli l'introspezione personale`,
  postProcessing: {
    normalizeSpaces: true,
    mergeHyphenation: true
  },
  isDefault: true,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Alternative methodology for different analysis approaches
const ALTERNATIVE_METHODOLOGY: Methodology = {
  id: 'philosophical-analysis',
  name: 'Analisi filosofica',
  description: 'Approccio filosofico ed esistenziale per testi complessi',
  systemPrompt: `Sei un filosofo e pensatore specializzato nell'analisi esistenziale di testi.

Analizza il seguente testo con un approccio filosofico ed esistenziale, concentrandoti sui temi universali e le domande fondamentali:

{{TRANSCRIPTION}}

Esplora le profondità filosofiche del testo e le sue implicazioni per la condizione umana.`,
  outputFormat: `Struttura l'analisi in formato markdown filosofico:

# 🤔 Analisi Filosofica

## 🌌 Temi Filosofici Centrali
Elenco dei principali temi filosofici emersi dal testo

## ❓ Domande Esistenziali
Le grandi domande sollevate dal testo sulla vita, morte, significato, libertà

## 👤 Condizione Umana
Come il testo riflette e illumina la condizione umana universale

## 💎 Saggezza Universale
Gli insegnamenti e la saggezza che emergono dal testo

## 🪞 Riflessione Personale
Spunti per la riflessione personale e l'auto-esame

## 🔗 Connessioni Filosofiche
Collegamenti con filosofi, correnti di pensiero o opere filosofiche classiche`,
  postProcessing: {
    normalizeSpaces: true,
    mergeHyphenation: true
  },
  isDefault: false,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

const getInitialState = (): SessionState => {
  const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure default methodology exists
      if (!parsed.methodologies?.find((m: Methodology) => m.isDefault)) {
        parsed.methodologies = [DEFAULT_METHODOLOGY, ...(parsed.methodologies || [])];
      }
      // Ensure alternative methodology exists
      if (!parsed.methodologies?.find((m: Methodology) => m.id === ALTERNATIVE_METHODOLOGY.id)) {
        parsed.methodologies = [...parsed.methodologies, ALTERNATIVE_METHODOLOGY];
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to parse saved state:', e);
    }
  }
  
  return {
    projects: [],
    methodologies: [DEFAULT_METHODOLOGY, ALTERNATIVE_METHODOLOGY],
    selectedAiModel: getDefaultAiModel(),
    ui: {
      home: {
        newProject: { title: '', description: '', methodologyId: DEFAULT_METHODOLOGY.id }
      }
    }
  };
};

export const useSessionState = () => {
  const [state, setState] = useState<SessionState>(getInitialState);

  // Save to sessionStorage with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    }, 200); // Reduced debounce to 200ms for faster sync

    return () => clearTimeout(timeoutId);
  }, [state]);

  const updateState = useCallback((updater: (prev: SessionState) => SessionState) => {
    setState(updater);
  }, []);

  const resetSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setState(getInitialState());
  }, []);

  const exportState = useCallback(() => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jiraiya-session-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importState = useCallback((jsonData: string) => {
    try {
      const imported = JSON.parse(jsonData);
      // Validate structure
      if (imported.projects && imported.methodologies) {
        // Ensure default methodology exists
        if (!imported.methodologies.find((m: Methodology) => m.isDefault)) {
          imported.methodologies = [DEFAULT_METHODOLOGY, ...imported.methodologies];
        }
        // Ensure alternative methodology exists
        if (!imported.methodologies.find((m: Methodology) => m.id === ALTERNATIVE_METHODOLOGY.id)) {
          imported.methodologies = [...imported.methodologies, ALTERNATIVE_METHODOLOGY];
        }
        setState(imported);
        return { success: true };
      }
      return { success: false, error: 'Invalid data structure' };
    } catch (e) {
      return { success: false, error: 'Invalid JSON' };
    }
  }, []);

  return {
    state,
    updateState,
    resetSession,
    exportState,
    importState
  };
};
