import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Upload, FileText, Check, Loader2, Info } from 'lucide-react';
import { Dropzone } from '../Dropzone';
import { PageList } from '../PageList';
import type { Page } from '@/types';

interface UploadStepProps {
  pages: Page[];
  isProcessingOCR: boolean;
  onFilesSelected: (files: File[]) => void;
  onReorderPages: (startIndex: number, endIndex: number) => void;
  onRenamePage: (id: string, newName: string) => void;
  onDeletePage: (id: string) => void;
  onMergeText: () => void;
  canMerge: boolean;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  pages,
  isProcessingOCR,
  onFilesSelected,
  onReorderPages,
  onRenamePage,
  onDeletePage,
  onMergeText,
  canMerge
}) => {
  const completedPages = pages.filter(p => p.status === 'completed').length;
  const totalPages = pages.length;
  const hasPages = pages.length > 0;
  const allCompleted = hasPages && pages.every(p => p.status === 'completed');
  const progressPercent = hasPages ? (completedPages / totalPages) * 100 : 0;

  // Status del processo
  const getStatusInfo = () => {
    if (!hasPages) return { icon: Upload, text: 'Carica le pagine del tuo libro', color: 'text-muted-foreground' };
    if (isProcessingOCR) return { icon: Loader2, text: `Elaborando ${completedPages}/${totalPages} pagine...`, color: 'text-primary' };
    if (allCompleted && canMerge) return { icon: Check, text: 'Pronto! Clicca "Procedi" per continuare', color: 'text-green-600' };
    if (allCompleted) return { icon: Check, text: 'Tutte le pagine sono pronte!', color: 'text-green-600' };
    return { icon: FileText, text: `${completedPages}/${totalPages} completate`, color: 'text-orange-600' };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header con Status */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <StatusIcon className={`w-5 h-5 ${status.color} ${isProcessingOCR ? 'animate-spin' : ''}`} />
          <span className={`font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>

      </div>

      {/* Next Step Guidance */}
      {hasPages && canMerge && (
        <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-sm text-green-800 dark:text-green-300">
            <strong>Perfetto!</strong> Le tue pagine sono state trascritte. 
            Ora clicca <strong>"Procedi"</strong> per unire il testo e passare alla fase di modifica.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card className="order-1">
          <CardContent className="p-6">
            <Dropzone
              onFilesSelected={onFilesSelected}
              isProcessing={isProcessingOCR}
            />
          </CardContent>
        </Card>

        {/* Pages List */}
        <Card className="order-2">
          <CardContent className="p-6">
            {hasPages ? (
              <PageList
                pages={pages}
                onReorderPages={onReorderPages}
                onRenamePage={onRenamePage}
                onDeletePage={onDeletePage}
                onMergeText={onMergeText}
                canMerge={canMerge}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Le tue pagine appariranno qui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile: Pages List Stack */}
      <div className="lg:hidden">
        {hasPages && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Pagine ({totalPages})
                  </h3>
                  {canMerge && (
                    <Button 
                      size="sm" 
                      onClick={onMergeText}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Procedi
                    </Button>
                  )}
                </div>
                
                {/* Compact page list for mobile */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pages.map((page, index) => (
                    <div key={page.id} className="flex items-center gap-3 p-2 rounded-lg border bg-muted/20">
                      <div className="text-xs text-muted-foreground font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{page.name}</div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            page.status === 'completed' ? 'bg-green-500' :
                            page.status === 'processing' ? 'bg-orange-500 animate-pulse' :
                            page.status === 'error' ? 'bg-red-500' : 'bg-muted-foreground'
                          }`} />
                          <span className="text-xs text-muted-foreground">
                            {page.status === 'completed' ? 'Pronto' :
                             page.status === 'processing' ? `${page.progress || 0}%` :
                             page.status === 'error' ? 'Errore' : 'In attesa'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile: Prominent Next Step Button */}
                {canMerge && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-primary">Pronto per il prossimo passo!</p>
                      <Button 
                        onClick={onMergeText}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Unisci Testo e Procedi
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Status Info */}
      <div className="text-center py-4">
        <div className="text-sm text-muted-foreground">
          {!hasPages && '📚 Inizia caricando alcune pagine'}
          {hasPages && !allCompleted && `⏳ ${totalPages - completedPages} pagine in elaborazione`}
          {allCompleted && '🎉 Pronto per la modifica del testo'}
        </div>
      </div>
    </div>
  );
};