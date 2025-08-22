import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { GripVertical, Edit2, Trash2, CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Page } from '@/types';

interface PageItemProps {
  page: Page;
  index: number;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onRetry: (page: Page) => void;
}

export const PageItem: React.FC<PageItemProps> = ({ page, index, onRename, onDelete, onRetry }) => {
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



  return (
    <Draggable draggableId={page.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group bg-card border border-border rounded-md p-2 transition-all duration-200 hover:bg-muted/50",
            snapshot.isDragging && "shadow-lg rotate-1 scale-105",
            page.status === 'error' && "border-destructive/30 bg-destructive/5"
          )}
        >
          <div className="flex items-center gap-2">
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-3 h-3" />
            </div>

            {/* Status Icon */}
            <div className="flex-shrink-0">
              {getStatusIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyPress}
                  className="h-6 text-xs"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-xs truncate">{page.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {page.status === 'completed' && `${page.ocrText.length} char`}
                    {page.status === 'processing' && page.progress !== undefined && `${page.progress}%`}
                    {page.status === 'error' && 'Errore'}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {page.status === 'error' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRetry(page)}
                  className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                  title="Riprova OCR"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 hover:bg-accent"
                disabled={page.status === 'processing'}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(page.id)}
                className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                disabled={page.status === 'processing'}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar - Only for processing */}
          {page.status === 'processing' && page.progress !== undefined && (
            <div className="mt-2">
              <div className="w-full bg-progress-bg rounded-full h-1">
                <div 
                  className="bg-progress-fill h-1 rounded-full transition-all duration-300"
                  style={{ width: `${page.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};