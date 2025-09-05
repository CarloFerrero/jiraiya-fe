import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Sun, Moon, Monitor, PanelLeft, PanelRight, Info } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { AiModelSelector } from '@/components/AiModelSelector';
import { ApiKeySettings } from '@/components/ApiKeySettings';

interface AppShellProps {
  children: React.ReactNode;
  leftPaneOpen: boolean;
  rightPaneOpen: boolean;
  onToggleLeftPane: () => void;
  onToggleRightPane: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  selectedAiModel?: string;
  onAiModelChange?: (modelId: string) => void;
  isMobile?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  leftPaneOpen,
  rightPaneOpen,
  onToggleLeftPane,
  onToggleRightPane,
  onToggleTheme,
  onOpenSettings,
  selectedAiModel,
  onAiModelChange,
  isMobile = false
}) => {
  const { theme } = useTheme();
  const [showApiSettings, setShowApiSettings] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Beta Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
        <div className="container px-4 py-2">
          <Alert className="border-0 bg-transparent p-0">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-sm text-blue-800 dark:text-blue-300 ml-6">
              <strong>Versione Beta per Test:</strong> Questa è una versione di prova per insegnanti. 
              I risultati dell'AI possono contenere errori, l'OCR può sbagliare nella trascrizione, 
              e i dati non vengono salvati permanentemente (servirà un database nella versione finale).
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" flex h-14 items-center justify-between px-4">
          {/* Left - Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-lg p-1.5">
                <img src="/logo.png" alt="Jiraiya Sensei" className="w-6 h-6 object-cover" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold">Jiraiya Sensei</h1>
                <p className="text-xs text-muted-foreground">(MVP)</p>
              </div>
            </Link>
          </div>



          {/* Right - Controls */}
          <div className="flex items-center gap-2">
            {/* AI Model Selector */}
            {selectedAiModel && onAiModelChange && (
              <AiModelSelector
                selectedModelId={selectedAiModel}
                onModelChange={onAiModelChange}
              />
            )}
            
            {/* Pane Toggles - Hidden on mobile */}
            {!isMobile && (
              <>
                <Button
                  variant="githubSecondary"
                  size="sm"
                  onClick={onToggleLeftPane}
                  className="h-8 w-8 p-0"
                  title="Toggle Fonti (SX)"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="githubSecondary"
                  size="sm"
                  onClick={onToggleRightPane}
                  className="h-8 w-8 p-0"
                  title="Toggle Studio (DX)"
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Theme Toggle */}
            <Button
              variant="githubSecondary"
              size="sm"
              onClick={onToggleTheme}
              className="h-8 w-8 p-0"
              title="Cambia tema"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </Button>

            {/* Settings */}
            <Button
              variant="githubSecondary"
              size="sm"
              onClick={() => setShowApiSettings(true)}
              className="h-8 w-8 p-0"
              title="Impostazioni API"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
