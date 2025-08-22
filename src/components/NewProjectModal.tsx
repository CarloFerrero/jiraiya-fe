import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, AlertCircle, X } from 'lucide-react';
import type { Methodology } from '@/types';

interface NewProjectModalProps {
  methodologies: Methodology[];
  newProject: { title: string; description?: string; methodologyId?: string };
  onNewProjectChange: (project: { title: string; description?: string; methodologyId?: string }) => void;
  onCreateProject: () => void;
  onClose: () => void;
  isOpen: boolean;
  isCreating?: boolean;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  methodologies,
  newProject,
  onNewProjectChange,
  onCreateProject,
  onClose,
  isOpen,
  isCreating = false
}) => {
  const [errors, setErrors] = useState<{ title?: string }>({});

  // Handle Escape key globally for the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const validateForm = () => {
    const newErrors: { title?: string } = {};
    
    if (!newProject.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (validateForm()) {
      onCreateProject();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const defaultMethodology = methodologies.find(m => m.isDefault);
  const selectedMethodology = methodologies.find(m => m.id === newProject.methodologyId) || defaultMethodology;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Nuovo Progetto
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="project-title">Titolo *</Label>
            <Input
              id="project-title"
              value={newProject.title}
              onChange={(e) => onNewProjectChange({ ...newProject, title: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="Es. Italo Calvino: Il castello dei destini incrociati"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </div>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="project-description">Descrizione (opzionale)</Label>
            <Textarea
              id="project-description"
              value={newProject.description || ''}
              onChange={(e) => onNewProjectChange({ ...newProject, description: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="Breve descrizione del progetto di analisi..."
              rows={3}
            />
          </div>

          {/* Methodology Select */}
          <div className="space-y-2">
            <Label htmlFor="project-methodology">Metodologia di Analisi</Label>
            <Select
              value={newProject.methodologyId || defaultMethodology?.id}
              onValueChange={(value) => onNewProjectChange({ ...newProject, methodologyId: value })}
            >
              <SelectTrigger id="project-methodology">
                <SelectValue placeholder="Seleziona una metodologia" />
              </SelectTrigger>
              <SelectContent>
                {methodologies.map((methodology) => (
                  <SelectItem key={methodology.id} value={methodology.id}>
                    <div className="flex items-center gap-2">
                      <span>{methodology.name}</span>
                      {methodology.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Selected Methodology Info */}
            {selectedMethodology && (
              <div className="p-3 bg-muted/30 rounded-md">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{selectedMethodology.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMethodology.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
            <p className="text-xs text-muted-foreground hidden sm:block">
              💡 Usa <kbd className="px-1 py-0.5 text-xs border rounded">Cmd+Enter</kbd> per creare rapidamente
            </p>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                Annulla
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating || !newProject.title.trim()}
                className="flex-1 sm:flex-none"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="hidden sm:inline">Creando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Crea Progetto</span>
                    <span className="sm:hidden">Crea</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
