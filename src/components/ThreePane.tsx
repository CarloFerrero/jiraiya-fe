import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ThreePaneProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  leftPaneOpen: boolean;
  rightPaneOpen: boolean;
  onToggleLeftPane: () => void;
  onToggleRightPane: () => void;
  className?: string;
}

export const ThreePane: React.FC<ThreePaneProps> = ({
  left,
  center,
  right,
  leftPaneOpen,
  rightPaneOpen,
  onToggleLeftPane,
  onToggleRightPane,
  className
}) => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Handle double-click on center pane for focus mode
  const handleCenterDoubleClick = () => {
    setIsFocusMode(!isFocusMode);
  };

  // Reset focus mode when panes are toggled
  useEffect(() => {
    if (leftPaneOpen || rightPaneOpen) {
      setIsFocusMode(false);
    }
  }, [leftPaneOpen, rightPaneOpen]);

  return (
    <div className={cn("flex h-[calc(100vh-3.5rem)]", className)}>
      {/* Left Pane - Fonti */}
      <div
        className={cn(
          "border-r bg-muted/30 transition-all duration-300 ease-in-out",
          leftPaneOpen && !isFocusMode
            ? "w-96 min-w-96"
            : "w-0 min-w-0 overflow-hidden"
        )}
      >
        <div className="h-full overflow-y-auto">
          {left}
        </div>
      </div>

      {/* Center Pane - Analisi - Always Centered */}
      <div
        className={cn(
          "flex-1 flex justify-center transition-all duration-300 ease-in-out",
          isFocusMode && "w-full"
        )}
        onDoubleClick={handleCenterDoubleClick}
      >
        <div className={cn(
          "h-full overflow-y-auto max-w-4xl w-full",
          isFocusMode && "max-w-none"
        )}>
          {center}
        </div>
      </div>

      {/* Right Pane - Studio */}
      <div
        className={cn(
          "border-l bg-muted/30 transition-all duration-300 ease-in-out",
          rightPaneOpen && !isFocusMode
            ? "w-96 min-w-96"
            : "w-0 min-w-0 overflow-hidden"
        )}
      >
        <div className="h-full overflow-y-auto">
          {right}
        </div>
      </div>
    </div>
  );
};
