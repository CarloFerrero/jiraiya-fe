import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  MoreHorizontal,
  ExternalLink,
  Edit3,
  Copy,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Project, Methodology } from '@/types';

interface ProjectCardProps {
  project: Project;
  methodology: Methodology | undefined;
  onOpen: (projectId: string) => void;
  onRename: (projectId: string) => void;
  onDuplicate: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  methodology,
  onOpen,
  onRename,
  onDuplicate,
  onDelete
}) => {
  const getProjectStats = () => {
    const hasAnalysis = !!project.aiResults;
    
    return { hasAnalysis };
  };

  const stats = getProjectStats();

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate" title={project.title}>
              {project.title}
            </CardTitle>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(project.id)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Apri
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(project.id)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Rinomina
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(project.id)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplica
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(project.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Methodology Badge */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {methodology?.name || 'Metodologia non trovata'}
            </Badge>
          </div>

          {/* Analysis Status */}
          {stats.hasAnalysis && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Brain className="w-4 h-4" />
              <span>Analisi completata</span>
            </div>
          )}

          {/* Open Button */}
          <Button 
            onClick={() => onOpen(project.id)}
            className="w-full"
            size="sm"
            variant="githubSecondary"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Apri Progetto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
