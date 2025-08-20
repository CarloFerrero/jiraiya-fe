import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuizQuestion } from '@/types';

interface QuizPlayerProps {
  questions: QuizQuestion[];
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];
  const isAnswered = userAnswer !== -1;
  const isCorrect = userAnswer === currentQuestion.answerIndex;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(userAnswers[currentQuestionIndex - 1] !== -1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(questions.length).fill(-1));
    setShowResults(false);
    setShowExplanation(false);
  };

  const correctAnswers = userAnswers.filter((answer, index) => 
    answer === questions[index].answerIndex
  ).length;

  const getScoreColor = () => {
    const percentage = (correctAnswers / questions.length) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-accent';
    return 'text-destructive';
  };

  if (showResults) {
    return (
      <Card className="animate-bounce-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-sensei rounded-full w-16 h-16 flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl">🎉 Quiz Completato!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={cn("text-3xl font-bold", getScoreColor())}>
            {correctAnswers}/{questions.length}
          </div>
          <p className="text-muted-foreground">
            Hai risposto correttamente a {correctAnswers} domande su {questions.length}
          </p>
          
          <div className="space-y-2">
            {questions.map((question, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">Domanda {index + 1}</span>
                {userAnswers[index] === question.answerIndex ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
            ))}
          </div>
          
          <Button onClick={handleReset} className="bg-gradient-sensei hover:shadow-warm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Ripeti Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            🧠 Quiz di Comprensione
          </CardTitle>
          <Badge variant="secondary">
            {currentQuestionIndex + 1}/{questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h3 className="font-medium text-lg leading-relaxed">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = userAnswer === index;
              const showCorrect = showExplanation && index === currentQuestion.answerIndex;
              const showIncorrect = showExplanation && isSelected && !isCorrect;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "w-full text-left justify-start p-4 h-auto whitespace-normal",
                    isSelected && !showExplanation && "bg-quiz-selected border-quiz-selected",
                    showCorrect && "bg-quiz-correct/20 border-quiz-correct text-quiz-correct",
                    showIncorrect && "bg-quiz-incorrect/20 border-quiz-incorrect text-quiz-incorrect"
                  )}
                  onClick={() => !isAnswered && handleAnswerSelect(index)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm bg-muted rounded px-2 py-1">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="w-4 h-4 ml-auto" />}
                    {showIncorrect && <XCircle className="w-4 h-4 ml-auto" />}
                  </div>
                </Button>
              );
            })}
          </div>
          
          {showExplanation && (
            <div className={cn(
              "p-4 rounded-lg border animate-bounce-in",
              isCorrect ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"
            )}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive" />
                )}
                <span className="font-medium">
                  {isCorrect ? '✅ Corretto!' : '❌ Non corretto'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            ← Precedente
          </Button>
          
          <Button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className="bg-gradient-sensei hover:shadow-warm"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Completa' : 'Successiva →'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};