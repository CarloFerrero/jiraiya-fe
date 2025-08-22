# 🔄 Passaggio alle API OpenAI - TODO per Domani

## 📍 File da Modificare

### 1. `src/utils/ai.ts`

#### Funzione `callAIWithMethodology`
**Posizione**: Linea ~461
**Cosa fare**:
1. Rimuovere il commento `// TODO: DOMANI - Sostituire con chiamata API reale`
2. Sostituire tutto il blocco demo con la logica API originale:

```typescript
// Sostituire questo:
const key = apiKey || OPENAI_CONFIG.API_KEY;

if (!key) {
  // Fallback ai dati demo se non c'è API key
  console.warn('API key mancante, usando dati demo');
  await new Promise(resolve => setTimeout(resolve, 1500));
  const demoData = getDemoDataWithoutQuiz();
  return demoData.markdownAnalysis || 'Analisi demo non disponibile';
}

// Controlla la cache usando metodologia + testo
const cacheKey = `${methodology.id}_${text.trim().toLowerCase()}`;
if (analysisCache.has(cacheKey)) {
  return analysisCache.get(cacheKey)!;
}

// Sostituisce il placeholder con il testo
const systemPrompt = methodology.systemPrompt.replace('{{TRANSCRIPTION}}', text);

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Analizza il seguente testo: ${text}`
          }
        ],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: OPENAI_CONFIG.TEMPERATURE,
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

    // Salva in cache
    analysisCache.set(cacheKey, content);
    
    return content;

  } catch (error: any) {
    lastError = error;
    
    if (error.name === 'AbortError') {
      lastError = new Error(OPENAI_ERRORS.TIMEOUT_ERROR);
      break;
    }
    
    if (attempt === OPENAI_CONFIG.MAX_RETRIES) break;
    
    await new Promise(resolve => setTimeout(resolve, OPENAI_CONFIG.RETRY_DELAY * attempt));
  }
}

throw lastError || new Error(OPENAI_ERRORS.UNKNOWN_ERROR);
```

#### Funzione `generateQuizWithMethodology`
**Posizione**: Linea ~580
**Cosa fare**:
1. Rimuovere il commento `// TODO: DOMANI - Sostituire con chiamata API reale`
2. Sostituire tutto il blocco demo con la logica API originale (simile a sopra)

## 🔧 Configurazione

### Verificare `.env`
Assicurarsi che il file `.env` contenga la chiave API corretta:
```
VITE_OPENAI_API_KEY=sk-proj-...
```

### Testare l'API
1. Aprire la console del browser
2. Provare un'analisi
3. Verificare che non ci siano errori 401
4. Controllare che la risposta sia in formato JSON

## 🎯 Risultato Atteso

Dopo le modifiche:
- ✅ Le analisi usano l'API OpenAI reale
- ✅ I quiz usano l'API OpenAI reale
- ✅ Le risposte sono in formato JSON (come i dati demo)
- ✅ Il rendering funziona correttamente con `convertJsonToMarkdown`

## 📝 Note

- I dati demo sono già formattati come JSON, quindi il rendering dovrebbe funzionare immediatamente
- La funzione `convertJsonToMarkdown` in `AnalysisPane.tsx` gestisce automaticamente la conversione
- Se ci sono problemi, controllare la console per errori di rete o API
