import { useState, useEffect, useCallback } from 'react';
import type { SessionState, Project, Methodology } from '@/types';
import { getDefaultAiModel } from '@/data/aiModels';

const SESSION_STORAGE_KEY = 'jiraiya:state';

// Default methodology
const DEFAULT_METHODOLOGY: Methodology = {
  id: 'default-literary-criticism',
  name: 'Critico letterario (5 sezioni)',
  description: 'Analisi letteraria standard con 5 sezioni: Trascrizione, Trama, Analisi simbolica, Significato, Lezione',
  systemPrompt: `Analizza il seguente testo letterario con un approccio critico approfondito. Fornisci un'analisi strutturata in 5 sezioni:

{{TRANSCRIPTION}}

Analizza il testo fornito e restituisci un JSON con la seguente struttura:
{
  "transcription": "Trascrizione pulita del testo originale",
  "plotSummary": "Sintesi della trama o contenuto principale",
  "symbolicAnalysis": {
    "keyElements": [
      {
        "element": "Nome dell'elemento simbolico",
        "description": "Come appare nel testo",
        "symbolicMeaning": "Significato simbolico",
        "culturalReferences": "Riferimenti culturali e letterari"
      }
    ]
  },
  "deepMeaning": {
    "philosophicalThemes": ["Tema 1", "Tema 2"],
    "existentialInterpretation": "Interpretazione esistenziale del testo",
    "universalTruths": "Verdi universali espresse"
  },
  "personalLesson": {
    "mainInsight": "Insight principale",
    "practicalApplications": ["Applicazione 1", "Applicazione 2"],
    "reflectiveQuestion": "Domanda per la riflessione personale"
  }
}`,
  outputSchema: `{
  "type": "object",
  "properties": {
    "transcription": { "type": "string" },
    "plotSummary": { "type": "string" },
    "symbolicAnalysis": {
      "type": "object",
      "properties": {
        "keyElements": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "element": { "type": "string" },
              "description": { "type": "string" },
              "symbolicMeaning": { "type": "string" },
              "culturalReferences": { "type": "string" }
            },
            "required": ["element", "description", "symbolicMeaning", "culturalReferences"]
          }
        }
      },
      "required": ["keyElements"]
    },
    "deepMeaning": {
      "type": "object",
      "properties": {
        "philosophicalThemes": { "type": "array", "items": { "type": "string" } },
        "existentialInterpretation": { "type": "string" },
        "universalTruths": { "type": "string" }
      },
      "required": ["philosophicalThemes", "existentialInterpretation", "universalTruths"]
    },
    "personalLesson": {
      "type": "object",
      "properties": {
        "mainInsight": { "type": "string" },
        "practicalApplications": { "type": "array", "items": { "type": "string" } },
        "reflectiveQuestion": { "type": "string" }
      },
      "required": ["mainInsight", "practicalApplications", "reflectiveQuestion"]
    }
  },
  "required": ["transcription", "plotSummary", "symbolicAnalysis", "deepMeaning", "personalLesson"]
}`,
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
  systemPrompt: `Analizza il seguente testo con un approccio filosofico ed esistenziale. Concentrati sui temi universali e le domande fondamentali:

{{TRANSCRIPTION}}

Analizza il testo fornito e restituisci un JSON con la seguente struttura:
{
  "transcription": "Trascrizione pulita del testo originale",
  "philosophicalThemes": ["Tema filosofico 1", "Tema filosofico 2"],
  "existentialQuestions": ["Domanda esistenziale 1", "Domanda esistenziale 2"],
  "humanCondition": "Analisi della condizione umana nel testo",
  "wisdom": "Saggezza e insegnamenti universali",
  "personalReflection": "Spunti per riflessione personale"
}`,
  outputSchema: `{
  "type": "object",
  "properties": {
    "transcription": { "type": "string" },
    "philosophicalThemes": { "type": "array", "items": { "type": "string" } },
    "existentialQuestions": { "type": "array", "items": { "type": "string" } },
    "humanCondition": { "type": "string" },
    "wisdom": { "type": "string" },
    "personalReflection": { "type": "string" }
  },
  "required": ["transcription", "philosophicalThemes", "existentialQuestions", "humanCondition", "wisdom", "personalReflection"]
}`,
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
