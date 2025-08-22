import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FolderOpen, 
  Plus
} from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import type { Project, Methodology } from '@/types';

interface ProjectListProps {
  projects: Project[];
  methodologies: Methodology[];
  onOpen: (projectId: string) => void;
  onRename: (projectId: string) => void;
  onDuplicate: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onCreateNew: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  methodologies,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
  onCreateNew
}) => {

  return (
    <div className="space-y-4">

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => {
            const methodology = methodologies.find(m => m.id === project.methodologyId);
            return (
              <ProjectCard
                key={project.id}
                project={project}
                methodology={methodology}
                onOpen={onOpen}
                onRename={onRename}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nessun progetto ancora
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Crea il tuo primo progetto per iniziare l'analisi letteraria
            </p>
            {(
              <Button onClick={onCreateNew} variant="github" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Crea Primo Progetto
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
