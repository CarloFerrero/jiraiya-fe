import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { OPENAI_CONFIG } from '@/config/openai';
import { EnvDebug } from './EnvDebug';

export const ApiKeyDebug: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEnvDebug, setShowEnvDebug] = useState(false);

  const currentKey = OPENAI_CONFIG.API_KEY;
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  const localStorageKey = localStorage.getItem('openai_api_key');
  const runtimeKey = (window as any).__OPENAI_API_KEY;

  const testApiKey = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test diretto con l'API di OpenAI
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${currentKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
      });
    } catch (error) {
      setTestResult({
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        type: 'network_error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testChatCompletion = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Testing Chat Completion API...');
      console.log('🧪 Using API Key:', currentKey ? `${currentKey.substring(0, 10)}...` : 'NOT FOUND');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: 'Ciao, questo è un test.' }
          ],
          max_tokens: 50,
        }),
      });

      const data = await response.json();
      
      console.log('🧪 Response Status:', response.status);
      console.log('🧪 Response Data:', data);
      
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
      });
    } catch (error) {
      console.log('🧪 Error:', error);
      setTestResult({
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        type: 'network_error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSimpleCompletion = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Testing Simple Completion API...');
      
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: 'Hello',
          max_tokens: 10,
        }),
      });

      const data = await response.json();
      
      console.log('🧪 Simple Completion Response Status:', response.status);
      console.log('🧪 Simple Completion Response Data:', data);
      
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
      });
    } catch (error) {
      console.log('🧪 Simple Completion Error:', error);
      setTestResult({
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        type: 'network_error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Debug Chiave API OpenAI</CardTitle>
        <CardDescription>
          Informazioni dettagliate sulla configurazione della chiave API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informazioni sulla chiave */}
        <div className="space-y-2">
          <h4 className="font-medium">Stato della Chiave API</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <Badge variant={currentKey ? "default" : "destructive"}>
                {currentKey ? "✅ Configurata" : "❌ Non configurata"}
              </Badge>
            </div>
            <div>
              <Badge variant={currentKey?.startsWith('sk-') ? "default" : "destructive"}>
                {currentKey?.startsWith('sk-') ? "✅ Formato corretto" : "❌ Formato errato"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Fonti della chiave */}
        <div className="space-y-2">
          <h4 className="font-medium">Fonti della Chiave API</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Environment (.env):</span>
              <Badge variant={envKey ? "outline" : "secondary"}>
                {envKey ? `${envKey.substring(0, 10)}...` : "Non trovata"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>localStorage:</span>
              <Badge variant={localStorageKey ? "outline" : "secondary"}>
                {localStorageKey ? `${localStorageKey.substring(0, 10)}...` : "Non trovata"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Runtime override:</span>
              <Badge variant={runtimeKey ? "outline" : "secondary"}>
                {runtimeKey ? `${runtimeKey.substring(0, 10)}...` : "Non trovata"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Chiave attuale:</span>
              <Badge variant={currentKey ? "default" : "destructive"}>
                {currentKey ? `${currentKey.substring(0, 10)}...` : "Non trovata"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pulsanti di test */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={testApiKey} 
            disabled={!currentKey || isLoading}
            variant="outline"
          >
            {isLoading ? 'Testando...' : 'Test Models API'}
          </Button>
          <Button 
            onClick={testChatCompletion} 
            disabled={!currentKey || isLoading}
            variant="outline"
          >
            {isLoading ? 'Testando...' : 'Test Chat API'}
          </Button>
          <Button 
            onClick={testSimpleCompletion} 
            disabled={!currentKey || isLoading}
            variant="outline"
          >
            {isLoading ? 'Testando...' : 'Test Simple Completion'}
          </Button>
          <Button 
            onClick={() => setShowEnvDebug(!showEnvDebug)}
            variant="outline"
          >
            {showEnvDebug ? 'Nascondi' : 'Mostra'} Env Debug
          </Button>
        </div>

        {/* Risultati del test */}
        {testResult && (
          <Alert className={testResult.ok ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  <strong>Status:</strong> {testResult.status} {testResult.statusText}
                </div>
                {testResult.error && (
                  <div>
                    <strong>Errore:</strong> {testResult.error}
                  </div>
                )}
                {testResult.data && (
                  <div>
                    <strong>Risposta:</strong>
                    <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Env Debug */}
        {showEnvDebug && (
          <div className="mt-6">
            <EnvDebug />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
