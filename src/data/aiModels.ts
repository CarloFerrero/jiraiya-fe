import type { AiModel } from '@/types';

export const AI_MODELS: AiModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Modello più avanzato, ottimo per analisi complesse',
    isAvailable: true,
    maxTokens: 128000,
    costPerToken: 0.000005
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Ottimizzato per velocità e costo',
    isAvailable: true,
    maxTokens: 128000,
    costPerToken: 0.00001
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Veloce ed economico per analisi base',
    isAvailable: true,
    maxTokens: 16000,
    costPerToken: 0.000001
  }
];

export const getDefaultAiModel = (): string => {
  return AI_MODELS.find(model => model.isAvailable)?.id || 'gpt-4o';
};

export const getAiModelById = (id: string): AiModel | undefined => {
  return AI_MODELS.find(model => model.id === id);
};
