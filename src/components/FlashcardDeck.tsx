import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Flashcard } from '@/types';

interface FlashcardDeckProps {
  flashcards: Flashcard[];
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(flashcards);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCards(flashcards);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          🗃️ Flashcard
        </h3>
        <Badge variant="secondary">
          {currentIndex + 1}/{cards.length}
        </Badge>
      </div>

      <div className="relative h-64">
        <Card 
          className={cn(
            "absolute inset-0 cursor-pointer transition-all duration-500 hover:shadow-warm",
            "animate-flip",
            isFlipped && "flipped"
          )}
          onClick={handleFlip}
        >
          <CardContent className="h-full flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              {/* Question Side */}
              <div className={cn(
                "transition-opacity duration-300",
                isFlipped ? "opacity-0" : "opacity-100"
              )}>
                <div className="text-sm text-muted-foreground mb-2">
                  {isFlipped ? 'RISPOSTA' : 'DOMANDA'}
                </div>
                <p className="text-lg font-medium leading-relaxed">
                  {isFlipped ? currentCard.a : currentCard.q}
                </p>
              </div>

              {/* Answer Side (hidden behind) */}
              <div className={cn(
                "absolute inset-6 flex flex-col items-center justify-center transition-opacity duration-300",
                isFlipped ? "opacity-100" : "opacity-0"
              )}>
                <div className="text-sm text-muted-foreground mb-2">
                  RISPOSTA
                </div>
                <p className="text-lg font-medium leading-relaxed text-center">
                  {currentCard.a}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flip Hint */}
        {!isFlipped && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            👆 Clicca per girare
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="hover:bg-accent"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Precedente
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffle}
            className="hover:bg-accent"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="hover:bg-accent"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="hover:bg-accent"
        >
          Successiva
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Progress */}
      <div className="w-full bg-progress-bg rounded-full h-2">
        <div 
          className="bg-progress-fill h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        💡 Studia le flashcard per memorizzare i concetti chiave
      </p>
    </div>
  );
};