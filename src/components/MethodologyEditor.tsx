import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle,
  Code,
  Eye,
  FileText,
  Settings,
  Trash2
} from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import type { Methodology } from '@/types';

interface MethodologyEditorProps {
  methodology?: Methodology;
  mode: 'create' | 'edit' | 'duplicate';
  isOpen: boolean;
  onSave: (methodology: Methodology) => void;
  onCancel: () => void;
  onDelete?: (methodology: Methodology) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const MethodologyEditor: React.FC<MethodologyEditorProps> = ({
  methodology,
  mode,
  isOpen,
  onSave,
  onCancel,
  onDelete
}) => {
  const [draft, setDraft] = useState<Methodology>({
    id: '',
    name: '',
    description: '',
    systemPrompt: '',
    outputFormat: '',
    postProcessing: {
      normalizeSpaces: true,
      mergeHyphenation: true
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const [errors, setErrors] = useState<{
    name?: string;
    systemPrompt?: string;
    outputFormat?: string;
  }>({});

  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Escape key globally for the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  // Initialize draft when modal opens or methodology/mode changes
  useEffect(() => {
    if (!isOpen) return;
    
    if (mode === 'create') {
      setDraft({
        id: generateId(),
        name: '',
        description: '',
        systemPrompt: '',
        outputFormat: '',
        postProcessing: {
          normalizeSpaces: true,
          mergeHyphenation: true
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } else if (methodology) {
      const baseDraft = { ...methodology };
      
      if (mode === 'duplicate') {
        baseDraft.id = generateId();
        baseDraft.name = `${methodology.name} (copia)`;
        baseDraft.createdAt = Date.now();
        baseDraft.updatedAt = Date.now();
        delete baseDraft.isDefault; // Remove default flag for duplicates
      }
      
      setDraft(baseDraft);
    }
  }, [methodology, mode, isOpen]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!draft.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }

    if (!draft.systemPrompt.trim()) {
      newErrors.systemPrompt = 'Il system prompt è obbligatorio';
    } else if (!draft.systemPrompt.includes('{{TRANSCRIPTION}}')) {
      newErrors.systemPrompt = 'Il prompt deve contenere {{TRANSCRIPTION}}';
    }

    if (!draft.outputFormat.trim()) {
      newErrors.outputFormat = 'Il formato output è obbligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const methodologyToSave = {
        ...draft,
        updatedAt: Date.now()
      };
      onSave(methodologyToSave);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleDelete = () => {
    if (onDelete && methodology) {
      setShowDeleteConfirmation(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (onDelete && methodology) {
      setIsDeleting(true);
      try {
        await onDelete(methodology);
        setShowDeleteConfirmation(false);
        onCancel();
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getPreviewPrompt = () => {
    return draft.systemPrompt.replace('{{TRANSCRIPTION}}', 'Il testo del documento apparirà qui...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {mode === 'create' && 'Nuova Metodologia'}
              {mode === 'edit' && 'Modifica Metodologia'}
              {mode === 'duplicate' && 'Duplica Metodologia'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {mode === 'edit' && onDelete && !methodology?.isDefault && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                  title="Elimina metodologia"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="methodology-name">Nome *</Label>
                <Input
                  id="methodology-name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Es. Analisi Psicologica"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="methodology-description">Descrizione</Label>
                <Textarea
                  id="methodology-description"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Breve descrizione della metodologia..."
                  rows={3}
                />
              </div>

              {/* Post Processing */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Post-processing</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="normalize-spaces"
                      checked={draft.postProcessing.normalizeSpaces}
                      onCheckedChange={(checked) => 
                        setDraft({
                          ...draft,
                          postProcessing: {
                            ...draft.postProcessing,
                            normalizeSpaces: checked as boolean
                          }
                        })
                      }
                    />
                    <Label htmlFor="normalize-spaces" className="text-sm">
                      Normalizza spazi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="merge-hyphenation"
                      checked={draft.postProcessing.mergeHyphenation}
                      onCheckedChange={(checked) => 
                        setDraft({
                          ...draft,
                          postProcessing: {
                            ...draft.postProcessing,
                            mergeHyphenation: checked as boolean
                          }
                        })
                      }
                    />
                    <Label htmlFor="merge-hyphenation" className="text-sm">
                      Unisci sillabazioni
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Prompt and Schema */}
            <div className="space-y-4">
              {/* System Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-prompt">System Prompt *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="h-6 px-2"
                  >
                    {showPreview ? <Code className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showPreview ? 'Codice' : 'Anteprima'}
                  </Button>
                </div>
                
                {showPreview ? (
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {getPreviewPrompt()}
                    </pre>
                  </div>
                ) : (
                  <Textarea
                    id="system-prompt"
                    value={draft.systemPrompt}
                    onChange={(e) => setDraft({ ...draft, systemPrompt: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Inserisci il prompt per l'analisi AI. Usa {{TRANSCRIPTION}} per il testo..."
                    rows={8}
                    className={errors.systemPrompt ? 'border-destructive' : ''}
                  />
                )}
                
                {errors.systemPrompt && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {errors.systemPrompt}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <span>Usa {'{{TRANSCRIPTION}}'} per inserire il testo nel prompt</span>
                </div>
              </div>

              {/* Output Format */}
              <div className="space-y-2">
                <Label htmlFor="output-format">Formato Output Desiderato *</Label>
                <Textarea
                  id="output-format"
                  value={draft.outputFormat}
                  onChange={(e) => setDraft({ ...draft, outputFormat: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Descrivi come vuoi che sia strutturato l'output, ad esempio:
- Inizia con un titolo principale
- Suddividi l'analisi in sezioni chiare  
- Usa elenchi puntati per i concetti chiave
- Termina con una riflessione personale
- Scrivi in formato markdown con intestazioni"
                  rows={6}
                  className={errors.outputFormat ? 'border-destructive' : ''}
                />
                
                {errors.outputFormat && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {errors.outputFormat}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <span>Descrivi in linguaggio naturale come strutturare l'output</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground hidden sm:flex">
              <CheckCircle className="w-4 h-4" />
              <span>💡 Usa <kbd className="px-1 py-0.5 text-xs border rounded">Cmd+Enter</kbd> per salvare rapidamente</span>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
                Annulla
              </Button>
              <Button onClick={handleSave} className="flex-1 sm:flex-none">
                <Save className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Salva Metodologia</span>
                <span className="sm:hidden">Salva</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        methodology={methodology}
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
