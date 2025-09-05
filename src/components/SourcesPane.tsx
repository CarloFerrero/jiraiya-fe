import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  Trash2,
  RefreshCw,
  Eye,
  Edit3,
  Merge,
  Settings,
  BookOpen,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Dropzone } from './Dropzone';
import { PageList } from './PageList';
import { PageItem } from './PageItem';
import type { Page } from '@/types';

interface SourcesPaneProps {
  pages: Page[];
  isProcessingOCR: boolean;
  onFilesSelected: (files: File[]) => void;
  onReorderPages: (startIndex: number, endIndex: number) => void;
  onRenamePage: (id: string, newName: string) => void;
  onDeletePage: (id: string) => void;
  onRetryOCR: (page: Page) => void;
  onMergeText: () => void;
  canMerge: boolean;
}

export const SourcesPane: React.FC<SourcesPaneProps> = ({
  pages,
  isProcessingOCR,
  onFilesSelected,
  onReorderPages,
  onRenamePage,
  onDeletePage,
  onRetryOCR,
  onMergeText,
  canMerge
}) => {
  const completedPages = pages.filter(p => p.status === 'completed');
  const processingPages = pages.filter(p => p.status === 'processing');
  const errorPages = pages.filter(p => p.status === 'error');

  return (
    <div className="h-full flex flex-col p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Fonti</h2>
        </div>
        {pages.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {pages.length} pagine
          </Badge>
        )}
      </div>

      {/* Upload Section - Simplified */}
      <Dropzone
        onFilesSelected={onFilesSelected}
        isProcessing={isProcessingOCR}
        accept="image/*,.pdf"
        maxFiles={10}
      />

      {/* OCR Status - Simplified */}
      {isProcessingOCR && (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm">OCR in corso... {processingPages.length} pagine</span>
        </div>
      )}

      {/* Pages List - Simplified */}
      {pages.length > 0 && (
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Pagine caricate</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {/* Actions - Simplified */}
              {pages.length > 0 && (
                <div className="space-y-2 mr-2">
                  <Button
                    onClick={onMergeText}
                    disabled={!canMerge}
                    className={`w-full h-8 px-2 text-xs transition-all ${
                      canMerge 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' 
                        : 'bg-transparent hover:bg-transparent text-muted-foreground border-none'
                    }`}
                    size="sm"
                  >
                    <Merge className="w-3 h-3 mr-1" />
                    {canMerge ? 'Procedi →' : 'Unisci Testo'}
                  </Button>
                </div>
              )}

              {completedPages.length > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>{completedPages.length}</span>
                </div>
              )}
              {errorPages.length > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <XCircle className="w-3 h-3" />
                  <span>{errorPages.length}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            <PageList
              pages={pages}
              onReorder={onReorderPages}
              onRename={onRenamePage}
              onDelete={onDeletePage}
              onRetry={onRetryOCR}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {pages.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-medium mb-1">Nessuna fonte caricata</h3>
            <p className="text-xs text-muted-foreground">
              Carica immagini o PDF per iniziare l'analisi
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
