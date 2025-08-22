import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AI_MODELS, getAiModelById } from '@/data/aiModels';

interface AiModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export const AiModelSelector: React.FC<AiModelSelectorProps> = ({
  selectedModelId,
  onModelChange
}) => {
  const selectedModel = getAiModelById(selectedModelId);

  return (
    <Select value={selectedModelId} onValueChange={onModelChange}>
      <SelectTrigger className="w-auto min-w-[120px] h-7 text-xs border-none bg-transparent hover:bg-muted/50 focus:ring-1 focus:ring-offset-0">
        <SelectValue>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium text-xs">
              {selectedModel?.name || 'AI Model'}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[200px]">
        {AI_MODELS.map((model) => (
          <SelectItem 
            key={model.id} 
            value={model.id}
            className="py-2"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="font-medium text-sm">{model.name}</span>
                <span className="text-xs text-muted-foreground">
                  {model.description}
                </span>
              </div>
              <div className="ml-2 text-xs text-muted-foreground">
                {model.maxTokens / 1000}k
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
