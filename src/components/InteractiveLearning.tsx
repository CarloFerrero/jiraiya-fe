import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  X, 
  Brain, 
  Lightbulb, 
  BookOpen,
  Target,
  HelpCircle,
  Star
} from 'lucide-react';
import type { QuizQuestion, Flashcard, ReflectiveQuestion } from '@/types';

interface InteractiveLearningProps {
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  reflectiveQuestions: ReflectiveQuestion[];
  onSectionComplete?: (section: 'quiz' | 'flashcards' | 'reflection') => void;
  focusMode?: boolean;
  hideNavigation?: boolean;
  activeSection?: 'quiz' | 'flashcards' | 'reflection';
}

export const InteractiveLearning: React.FC<InteractiveLearningProps> = ({
  quiz,
  flashcards,
  reflectiveQuestions,
  onSectionComplete,
  focusMode = false,
  hideNavigation = false,
  activeSection: externalActiveSection
}) => {
  const [internalActiveSection, setInternalActiveSection] = useState<'quiz' | 'flashcards' | 'reflection'>('quiz');
  
  // Use external activeSection if provided, otherwise use internal state
  const activeSection = externalActiveSection || internalActiveSection;
  const setActiveSection = externalActiveSection ? (() => {}) : setInternalActiveSection;
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [currentReflectionIndex, setCurrentReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [quizAnsweredAll, setQuizAnsweredAll] = useState(false);
  const [flashcardsViewedAll, setFlashcardsViewedAll] = useState(false);
  const [reflectionAnsweredAll, setReflectionAnsweredAll] = useState(false);

  // Quiz Functions
  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions.has(currentQuizIndex)) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === quiz[currentQuizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
    
    const newAnsweredQuestions = new Set([...answeredQuestions, currentQuizIndex]);
    setAnsweredQuestions(newAnsweredQuestions);
    
    // Check if all quiz questions are answered
    if (newAnsweredQuestions.size === quiz.length && !quizAnsweredAll) {
      setQuizAnsweredAll(true);
      onSectionComplete?.('quiz');
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quiz.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const prevQuizQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
    setAnsweredQuestions(new Set());
  };

  // Flashcard Functions
  const nextFlashcard = () => {
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else if (currentFlashcardIndex === flashcards.length - 1 && !flashcardsViewedAll) {
      // Mark as completed when reaching the last flashcard
      setFlashcardsViewedAll(true);
      onSectionComplete?.('flashcards');
    }
  };

  const prevFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Reflection Functions
  const nextReflection = () => {
    if (currentReflectionIndex < reflectiveQuestions.length - 1) {
      setCurrentReflectionIndex(prev => prev + 1);
    }
  };

  const prevReflection = () => {
    if (currentReflectionIndex > 0) {
      setCurrentReflectionIndex(prev => prev - 1);
    }
  };

  const handleReflectionChange = (value: string) => {
    const newAnswers = {
      ...reflectionAnswers,
      [reflectiveQuestions[currentReflectionIndex].id]: value
    };
    setReflectionAnswers(newAnswers);
    
    // Check if all reflection questions have answers
    const allAnswered = reflectiveQuestions.every(q => newAnswers[q.id] && newAnswers[q.id].trim().length > 0);
    if (allAnswered && !reflectionAnsweredAll) {
      setReflectionAnsweredAll(true);
      onSectionComplete?.('reflection');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'concept': return <Brain className="w-4 h-4" />;
      case 'symbol': return <Target className="w-4 h-4" />;
      case 'theme': return <Lightbulb className="w-4 h-4" />;
      case 'quote': return <BookOpen className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation - Hidden in focus mode */}
      {!hideNavigation && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={activeSection === 'quiz' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('quiz')}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Quiz</span>
            <span className="sm:hidden">🎯</span>
            <span className="hidden sm:inline">({quiz.length})</span>
          </Button>
          <Button
            variant={activeSection === 'flashcards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('flashcards')}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Flashcards</span>
            <span className="sm:hidden">📚</span>
            <span className="hidden sm:inline">({flashcards.length})</span>
          </Button>
          <Button
            variant={activeSection === 'reflection' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('reflection')}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Riflessioni</span>
            <span className="sm:hidden">🧠</span>
            <span className="hidden sm:inline">({reflectiveQuestions.length})</span>
          </Button>
        </div>
      )}

      {/* Quiz Section */}
      {activeSection === 'quiz' && quiz.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quiz di Comprensione
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {currentQuizIndex + 1} / {quiz.length}
              </Badge>
              <Badge className={`${getDifficultyColor(quiz[currentQuizIndex].difficulty)} text-xs`}>
                {quiz[currentQuizIndex].difficulty}
              </Badge>
            </div>
          </div>

          <Progress value={(answeredQuestions.size / quiz.length) * 100} className="w-full" />

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">
                  {quiz[currentQuizIndex].question}
                </h4>

                <div className="space-y-2">
                  {quiz[currentQuizIndex].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedAnswer === index
                          ? (index === quiz[currentQuizIndex].correctAnswer ? 'default' : 'destructive')
                          : 'outline'
                      }
                      className="w-full justify-start h-auto p-3 sm:p-4 text-left text-sm sm:text-base"
                      onClick={() => handleAnswerSelect(index)}
                      disabled={answeredQuestions.has(currentQuizIndex)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        {selectedAnswer === index && (
                          index === quiz[currentQuizIndex].correctAnswer ? (
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )
                        )}
                        <span className="font-medium mr-2 flex-shrink-0">{String.fromCharCode(65 + index)}.</span>
                        <span className="break-words">{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                {showExplanation && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <h5 className="font-medium mb-2">Spiegazione:</h5>
                    <p className="text-sm">{quiz[currentQuizIndex].explanation}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={prevQuizQuestion}
                    disabled={currentQuizIndex === 0}
                    className="text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Precedente
                  </Button>

                  <div className="flex items-center gap-2 order-first sm:order-none">
                    <span className="text-sm text-muted-foreground">
                      Punteggio: {quizScore}/{answeredQuestions.size}
                    </span>
                    <Button variant="outline" size="sm" onClick={resetQuiz}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={nextQuizQuestion}
                    disabled={currentQuizIndex === quiz.length - 1}
                    className="text-sm"
                  >
                    Successiva
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Flashcards Section */}
      {activeSection === 'flashcards' && flashcards.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Flashcards
            </h3>
            <Badge variant="secondary" className="text-xs">
              {currentFlashcardIndex + 1} / {flashcards.length}
            </Badge>
          </div>

          <Card className="min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
            <CardContent className="w-full p-4 sm:p-6">
              <div
                className={`relative w-full h-48 sm:h-64 cursor-pointer transition-transform duration-500 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={flipCard}
              >
                <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                                  <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    {getCategoryIcon(flashcards[currentFlashcardIndex].category)}
                    <Badge variant="outline" className="text-xs">
                      {flashcards[currentFlashcardIndex].category}
                    </Badge>
                  </div>
                  <h4 className="text-lg sm:text-xl font-medium text-center px-2">
                    {flashcards[currentFlashcardIndex].front}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                    Clicca per vedere la risposta
                  </p>
                </div>
                </div>

                <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
                    <h4 className="text-lg font-medium text-center mb-4 px-2">
                      {flashcards[currentFlashcardIndex].back}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center">
                      Clicca per tornare alla domanda
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              variant="outline"
              onClick={prevFlashcard}
              disabled={currentFlashcardIndex === 0}
              className="text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Precedente
            </Button>

            <Button variant="outline" onClick={flipCard} className="text-sm">
              {isFlipped ? 'Mostra Domanda' : 'Mostra Risposta'}
            </Button>

            <Button
              variant="outline"
              onClick={nextFlashcard}
              disabled={currentFlashcardIndex === flashcards.length - 1}
              className="text-sm"
            >
              Successiva
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Reflection Section */}
      {activeSection === 'reflection' && reflectiveQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Domande Riflessive
            </h3>
            <Badge variant="secondary" className="text-xs">
              {currentReflectionIndex + 1} / {reflectiveQuestions.length}
            </Badge>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">
                    {reflectiveQuestions[currentReflectionIndex].category}
                  </Badge>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>

                <h4 className="text-lg font-medium">
                  {reflectiveQuestions[currentReflectionIndex].question}
                </h4>

                {reflectiveQuestions[currentReflectionIndex].prompts.length > 0 && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Spunti per la riflessione:</h5>
                    <ul className="space-y-1 text-sm">
                      {reflectiveQuestions[currentReflectionIndex].prompts.map((prompt, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    La tua riflessione:
                  </label>
                  <Textarea
                    placeholder="Prenditi il tempo per riflettere profondamente..."
                    value={reflectionAnswers[reflectiveQuestions[currentReflectionIndex].id] || ''}
                    onChange={(e) => handleReflectionChange(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={prevReflection}
                    disabled={currentReflectionIndex === 0}
                    className="text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Precedente
                  </Button>

                  <Button
                    variant="outline"
                    onClick={nextReflection}
                    disabled={currentReflectionIndex === reflectiveQuestions.length - 1}
                    className="text-sm"
                  >
                    Successiva
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {((activeSection === 'quiz' && quiz.length === 0) ||
        (activeSection === 'flashcards' && flashcards.length === 0) ||
        (activeSection === 'reflection' && reflectiveQuestions.length === 0)) && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Nessun contenuto disponibile</h4>
              <p className="text-sm text-muted-foreground">
                I contenuti interattivi per questa sezione non sono ancora stati generati.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
