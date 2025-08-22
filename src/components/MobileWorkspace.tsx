import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Search, BookOpen } from 'lucide-react';

type WorkspaceTab = 'sources' | 'analysis' | 'study';

interface MobileWorkspaceProps {
  sources: React.ReactNode;
  analysis: React.ReactNode;
  study: React.ReactNode;
  className?: string;
}

export const MobileWorkspace: React.FC<MobileWorkspaceProps> = ({
  sources,
  analysis,
  study,
  className
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('sources');

  const tabs = [
    {
      id: 'sources' as const,
      label: 'Fonti',
      icon: FileText,
      content: sources
    },
    {
      id: 'analysis' as const,
      label: 'Analisi',
      icon: Search,
      content: analysis
    },
    {
      id: 'study' as const,
      label: 'Studio',
      icon: BookOpen,
      content: study
    }
  ];

  return (
    <div className={cn("flex flex-col h-[100dvh] max-h-[100dvh]", className)}>
      {/* Tab Navigation - Compact under header */}
      <div className="order-1 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-around px-1 py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 h-8 px-3 min-w-0 flex-1",
                  "text-xs font-medium transition-all duration-200",
                  "touch-manipulation select-none",
                  "active:scale-95 active:bg-primary/20",
                  isActive
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-all duration-200",
                  isActive && "scale-110 text-primary"
                )} />
                <span className={cn(
                  "truncate transition-all duration-200",
                  isActive && "font-semibold"
                )}>
                  {tab.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - Takes remaining space */}
      <div className="order-2 flex-1 overflow-hidden">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "h-full overflow-y-auto",
              "transition-opacity duration-200",
              activeTab === tab.id ? "block opacity-100" : "hidden opacity-0"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
