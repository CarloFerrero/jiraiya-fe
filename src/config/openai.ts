// Function to get API key from multiple sources
const getApiKey = (): string => {
  // 1. Runtime override (set by user in settings)
  if ((window as any).__OPENAI_API_KEY) {
    return (window as any).__OPENAI_API_KEY;
  }
  
  // 2. localStorage (user preference)
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      return storedKey;
    }
  }
  
  // 3. Environment variable (fallback)
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  return envKey || '';
};

// Cache the API key to avoid repeated calls
let cachedApiKey: string | null = null;
let cacheInitialized = false;

const getCachedApiKey = (): string => {
  if (!cacheInitialized) {
    cachedApiKey = getApiKey();
    cacheInitialized = true;
  }
  return cachedApiKey || '';
};

// Function to refresh the cache (for when user changes settings)
export const refreshApiKeyCache = (): void => {
  cacheInitialized = false;
  cachedApiKey = null;
};

// OpenAI API Configuration
export const OPENAI_CONFIG = {
  get API_KEY() {
    return getCachedApiKey();
  },
  BASE_URL: 'https://api.openai.com/v1',
  TIMEOUT: 60000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  MODEL: 'gpt-4-turbo-preview',
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.3,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.1,
  PRESENCE_PENALTY: 0.1,
  RATE_LIMIT_REQUESTS: 60,
  RATE_LIMIT_TOKENS: 90000
};

// Validate API key configuration
export const validateOpenAIConfig = (): boolean => {
  if (!OPENAI_CONFIG.API_KEY) {
    console.error('OpenAI API key is not configured');
    return false;
  }
  if (!OPENAI_CONFIG.API_KEY.startsWith('sk-')) {
    console.error('Invalid OpenAI API key format');
    return false;
  }
  return true;
};

export const OPENAI_ERRORS = {
  API_KEY_MISSING: 'Chiave API OpenAI mancante',
  INVALID_API_KEY: 'Chiave API OpenAI non valida',
  RATE_LIMIT_EXCEEDED: 'Limite di richieste superato. Riprova tra qualche minuto',
  QUOTA_EXCEEDED: 'Quota API esaurita',
  API_ERROR: 'Errore durante l\'elaborazione AI',
  NETWORK_ERROR: 'Errore di connessione. Verifica la tua connessione internet',
  TIMEOUT_ERROR: 'Timeout della richiesta. Riprova',
  UNKNOWN_ERROR: 'Errore sconosciuto durante l\'analisi AI'
};