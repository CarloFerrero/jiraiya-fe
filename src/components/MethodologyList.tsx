import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus,
  Edit3,
  Copy,
  Download,
  Trash2,
  MoreHorizontal,
  Code
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Methodology } from '@/types';

interface MethodologyListProps {
  methodologies: Methodology[];
  onEdit: (methodology: Methodology) => void;
  onDuplicate: (methodology: Methodology) => void;
  onDelete: (methodology: Methodology) => void;
  onExport: (methodology: Methodology) => void;
  onCreateNew: () => void;
}

export const MethodologyList: React.FC<MethodologyListProps> = ({
  methodologies,
  onEdit,
  onDuplicate,
  onDelete,
  onExport,
  onCreateNew
}) => {

  return (
    <div className="space-y-4">

      {/* Methodologies Grid */}
      {methodologies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methodologies.map(methodology => (
            <Card key={methodology.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate" title={methodology.name}>
                      {methodology.name}
                    </CardTitle>
                    {methodology.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {methodology.description}
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
                      <DropdownMenuItem onClick={() => onEdit(methodology)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Modifica
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(methodology)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplica
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onExport(methodology)}>
                        <Download className="w-4 h-4 mr-2" />
                        Esporta JSON
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!methodology.isDefault && (
                        <DropdownMenuItem 
                          onClick={() => onDelete(methodology)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Elimina
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    {methodology.isDefault && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-primary/20 border-primary text-primary"
                      >
                        Sistema
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Code className="w-3 h-3 mr-1" />
                      JSON Schema
                    </Badge>
                  </div>



                  {/* Edit Button */}
                  <Button 
                    onClick={() => onEdit(methodology)}
                    className="w-full"
                    size="sm"
                    variant="githubSecondary"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifica
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nessuna metodologia personalizzata
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Crea la tua prima metodologia personalizzata per analisi specifiche
            </p>
            {(
              <Button onClick={onCreateNew} variant="github" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Crea Prima Metodologia
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
