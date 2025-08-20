import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { GripVertical, Edit2, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Page } from '@/types';

interface PageItemProps {
  page: Page;
  index: number;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export const PageItem: React.FC<PageItemProps> = ({ page, index, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(page.name);

  const handleSaveName = () => {
    if (editName.trim() && editName !== page.name) {
      onRename(page.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditName(page.name);
      setIsEditing(false);
    }
  };

  const getStatusIcon = () => {
    switch (page.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'processing':
        return <Loader className="w-4 h-4 text-primary animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getProgressBar = () => {
    if (page.status === 'processing' && page.progress !== undefined) {
      return (
        <div className="w-full bg-progress-bg rounded-full h-1.5 mt-2">
          <div 
            className="bg-progress-fill h-1.5 rounded-full transition-all duration-300 animate-progress"
            style={{ width: `${page.progress}%` }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Draggable draggableId={page.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "bg-card border border-border rounded-lg p-3 shadow-card transition-all duration-300",
            snapshot.isDragging && "shadow-warm rotate-2 scale-105",
            page.status === 'error' && "border-destructive/50"
          )}
        >
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="mt-1 text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Thumbnail */}
            <div className="w-12 h-16 bg-muted rounded border overflow-hidden flex-shrink-0">
              <img
                src={page.imageURL}
                alt={`Preview ${page.name}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyPress}
                  className="h-8 text-sm"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm truncate">{page.name}</h4>
                  {getStatusIcon()}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                {page.status === 'processing' && page.progress !== undefined
                  ? `OCR in corso... ${page.progress}%`
                  : page.status === 'completed'
                  ? `${page.ocrText.length} caratteri estratti`
                  : page.status === 'error'
                  ? 'Errore durante l\'OCR'
                  : 'In attesa di elaborazione'
                }
              </p>
              
              {getProgressBar()}
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 hover:bg-accent"
                disabled={page.status === 'processing'}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(page.id)}
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                disabled={page.status === 'processing'}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};