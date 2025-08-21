import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Upload, Edit, Brain, Target, ChevronRight } from 'lucide-react';
import type { AppStep } from '@/types';

interface StepIndicatorProps {
  currentStep: AppStep;
  onStepChange: (step: AppStep) => void;
  completedSteps: AppStep[];
  canNavigate: {
    edit: boolean;
    analysis: boolean;
    quiz: boolean;
  };
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepChange,
  completedSteps,
  canNavigate
}) => {
  const steps = [
    {
      id: 'upload' as AppStep,
      title: 'Upload',
      icon: Upload,
      shortDesc: 'Carica le tue pagine'
    },
    {
      id: 'edit' as AppStep,
      title: 'Modifica',
      icon: Edit,
      shortDesc: 'Controlla e modifica il testo'
    },
    {
      id: 'analysis' as AppStep,
      title: 'Analisi',
      icon: Brain,
      shortDesc: 'Usa l\'IA per analizzare il testo'
    },
    {
      id: 'quiz' as AppStep,
      title: 'Quiz',
      icon: Target,
      shortDesc: 'Testa la tua comprensione'
    }
  ];

  const getStepStatus = (stepId: AppStep) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const canClickStep = (stepId: AppStep) => {
    if (stepId === 'upload') return true;
    if (stepId === 'edit') return canNavigate.edit;
    if (stepId === 'analysis') return canNavigate.analysis;
    if (stepId === 'quiz') return canNavigate.quiz;
    return false;
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-2 sm:p-3 mb-4">
      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-2">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          const isClickable = canClickStep(step.id);
          const isActive = status === 'current';
          const isCompleted = status === 'completed';

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <Button
                  variant={isActive ? 'default' : isCompleted ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`h-8 w-8 rounded-full p-0 transition-all duration-200 ${!isClickable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    } ${isActive ? 'ring-2 ring-primary/20' : ''}`}
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </Button>

                <div className="hidden md:flex flex-col min-w-0">
                  <span className={`text-xs font-medium truncate ${isActive ? 'text-primary' :
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                    {step.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {step.shortDesc}
                  </span>
                </div>

                {/* Tablet: only title */}
                <div className="md:hidden flex items-center">
                  <span className={`text-xs font-medium ${isActive ? 'text-primary' :
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                    {step.title}
                  </span>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex items-center mx-1">
                  <ChevronRight className={`w-3 h-3 transition-colors ${isCompleted ? 'text-primary' : 'text-muted-foreground/40'
                    }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Desktop Progress indicator */}
        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {completedSteps.length}/{steps.length}
          </div>
          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const isActive = status === 'current';
              const isCompleted = status === 'completed';

              return (
                <React.Fragment key={step.id}>
                  <div className={`w-6 h-1 rounded-full transition-all duration-300 ${isCompleted ? 'bg-primary' :
                      isActive ? 'bg-primary/60' : 'bg-muted'
                    }`} />
                  {index < steps.length - 1 && <div className="w-1" />}
                </React.Fragment>
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {completedSteps.length}/{steps.length}
          </span>
        </div>

        {/* Current Step Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              const isClickable = canClickStep(step.id);
              const isActive = status === 'current';
              const isCompleted = status === 'completed';

              if (!isActive) return null;

              return (
                <div key={step.id} className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 w-7 rounded-full p-0 ring-2 ring-primary/20"
                    onClick={() => isClickable && onStepChange(step.id)}
                    disabled={!isClickable}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </Button>

                  <div>
                    <span className="text-sm font-medium text-primary">
                      {step.title}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      • {step.shortDesc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex items-center gap-1">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              const isClickable = canClickStep(step.id);
              const isActive = status === 'current';
              const isCompleted = status === 'completed';

              if (isActive) return null;

              return (
                <Button
                  key={step.id}
                  variant={isCompleted ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`h-6 w-6 rounded-full p-0 transition-all ${!isClickable ? 'opacity-30' : 'opacity-60 hover:opacity-100'
                    }`}
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                  title={step.title}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};