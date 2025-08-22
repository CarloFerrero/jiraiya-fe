import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const EnvDebug: React.FC = () => {
  const viteEnv = import.meta.env;
  const viteKeys = Object.keys(viteEnv).filter(key => key.startsWith('VITE_'));
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Debug Variabili d'Ambiente Vite</CardTitle>
        <CardDescription>
          Tutte le variabili VITE_* caricate da Vite
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Variabili VITE_* Trovate ({viteKeys.length})</h4>
          <div className="space-y-1">
            {viteKeys.map(key => (
              <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="font-mono text-sm">{key}</span>
                <Badge variant="outline">
                  {viteEnv[key] ? `${String(viteEnv[key]).substring(0, 20)}...` : 'undefined'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">VITE_OPENAI_API_KEY Specifico</h4>
          <div className="p-3 bg-muted rounded">
            <div className="text-sm">
              <strong>Valore:</strong> {viteEnv.VITE_OPENAI_API_KEY || 'undefined'}
            </div>
            <div className="text-sm">
              <strong>Lunghezza:</strong> {viteEnv.VITE_OPENAI_API_KEY ? viteEnv.VITE_OPENAI_API_KEY.length : 0}
            </div>
            <div className="text-sm">
              <strong>Inizia con sk-:</strong> {viteEnv.VITE_OPENAI_API_KEY ? viteEnv.VITE_OPENAI_API_KEY.startsWith('sk-') : false}
            </div>
            <div className="text-sm">
              <strong>Inizia con sk-proj-:</strong> {viteEnv.VITE_OPENAI_API_KEY ? viteEnv.VITE_OPENAI_API_KEY.startsWith('sk-proj-') : false}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Tutte le Variabili d'Ambiente</h4>
          <div className="p-3 bg-muted rounded max-h-40 overflow-auto">
            <pre className="text-xs">
              {JSON.stringify(viteEnv, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
