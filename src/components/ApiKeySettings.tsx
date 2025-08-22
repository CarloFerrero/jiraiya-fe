import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OPENAI_CONFIG, validateOpenAIConfig } from '@/config/openai';
import { callAI } from '@/utils/ai';

export const ApiKeySettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      (window as any).__OPENAI_API_KEY = apiKey;
      setApiKey('');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('openai_api_key');
    delete (window as any).__OPENAI_API_KEY;
    setApiKey('');
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      // Test con un testo semplice
      const testText = "Il sole splende nel cielo azzurro.";
      const result = await callAI(testText);
      
      if (result && result.length > 0) {
        setTestResult({
          success: true,
          message: '✅ Chiave API funzionante! Test completato con successo.'
        });
      } else {
        setTestResult({
          success: false,
          message: '❌ Risposta vuota dall\'API'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const storedKey = localStorage.getItem('openai_api_key');
  const currentKey = OPENAI_CONFIG.API_KEY;
  const isConfigured = validateOpenAIConfig();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Configurazione API OpenAI</CardTitle>
        <CardDescription>
          Gestisci la tua chiave API per l'analisi AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Chiave API OpenAI</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            Salva
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Cancella
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleTest} 
            disabled={!isConfigured || isLoading}
          >
            {isLoading ? 'Testando...' : 'Test API'}
          </Button>
        </div>

        {testResult && (
          <Alert className={testResult.success ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Stato attuale:</strong> {isConfigured ? '✅ Configurato' : '❌ Non configurato'}</p>
          {storedKey && <p>Chiave salvata: {storedKey.substring(0, 10)}...</p>}
          {currentKey && <p>Chiave attuale: {currentKey.substring(0, 10)}...</p>}
        </div>
      </CardContent>
    </Card>
  );
};
