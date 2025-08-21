import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  ArrowLeft, 
  Wand2, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Lightbulb, 
  Brain,
  Play,
  Pause,
  SkipForward,
  HelpCircle,
  Eye,
  Minimize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import type { AiResults } from '@/types';

interface QuizStepProps {
  aiResults: AiResults | null;
  onGenerateQuiz?: () => Promise<void>;
  isGenerating?: boolean;
  isStudyMode: boolean;
  onToggleStudyMode: () => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ 
  aiResults, 
  onGenerateQuiz, 
  isGenerating = false,
  isStudyMode,
  onToggleStudyMode
}) => {
  const [currentTab, setCurrentTab] = useState('quiz');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showFlashcardBack, setShowFlashcardBack] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const hasQuiz = aiResults?.interactiveLearning?.quiz && aiResults.interactiveLearning.quiz.length > 0;
  const hasFlashcards = aiResults?.interactiveLearning?.flashcards && aiResults.interactiveLearning.flashcards.length > 0;
  const hasReflectiveQuestions = aiResults?.interactiveLearning?.reflectiveQuestions && aiResults.interactiveLearning.reflectiveQuestions.length > 0;

  const currentQuiz = hasQuiz ? aiResults!.interactiveLearning!.quiz[currentQuizIndex] : null;
  const currentFlashcard = hasFlashcards ? aiResults!.interactiveLearning!.flashcards[currentFlashcardIndex] : null;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQuiz?.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < (aiResults?.interactiveLearning?.quiz.length || 0) - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleNextFlashcard = () => {
    if (currentFlashcardIndex < (aiResults?.interactiveLearning?.flashcards.length || 0) - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      setShowFlashcardBack(false);
    } else {
      setCurrentFlashcardIndex(0);
      setShowFlashcardBack(false);
    }
  };

  const handlePrevFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
      setShowFlashcardBack(false);
    } else {
      setCurrentFlashcardIndex((aiResults?.interactiveLearning?.flashcards.length || 1) - 1);
      setShowFlashcardBack(false);
    }
  };

  // Zen Mode Toggle
  const toggleZenMode = () => {
    onToggleStudyMode();
    if (!isStudyMode) {
      // Entering zen mode
      document.body.classList.add('zen-mode');
    } else {
      // Exiting zen mode
      document.body.classList.remove('zen-mode');
    }
  };

  // Ambient sound toggle (placeholder for future implementation)
  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    // TODO: Implement ambient sounds for focus
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

  // Zen Mode - Modalità Studio per Quiz
  if (isStudyMode) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
        {/* Zen Header - Solo Logo */}
        <div className="absolute top-4 left-4 z-50">
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50 shadow-lg">
            <img src="/logo.png" alt="Jiraiya Sensei" className="w-6 h-6" />
            <span className="text-sm font-medium text-primary">Jiraiya Sensei</span>
          </div>
        </div>

        {/* Zen Content - Quiz a tutto schermo */}
        <div className="h-full flex items-start justify-center p-8 pt-20">
          <div className="w-full max-w-6xl">
            <div className="bg-background/95 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl">
              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                {hasQuiz ? (
                  <div className="p-8">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-center mb-4">Quiz Interattivi</h1>
                      <p className="text-lg text-muted-foreground text-center">Modalità Studio - Focus Completo</p>
                    </div>
                    
                    {/* Tabs per la navigazione */}
                    <div className="flex justify-center mb-8">
                      <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
                        {['quiz', 'flashcards', 'reflection'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setCurrentTab(tab)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              currentTab === tab
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {tab === 'quiz' && '🎯 Quiz'}
                            {tab === 'flashcards' && '📚 Flashcard'}
                            {tab === 'reflection' && '🧠 Riflessione'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contenuto delle tab */}
                    <div className="space-y-6">
                      {currentTab === 'quiz' && (
                        <div className="space-y-6">
                          {quizCompleted ? (
                            <div className="text-center space-y-4">
                              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-primary" />
                              </div>
                              <h2 className="text-2xl font-bold">Quiz Completato!</h2>
                              <p className="text-lg text-muted-foreground">
                                Hai risposto correttamente a {score} domande su {aiResults?.interactiveLearning?.quiz.length}
                              </p>
                              <div className="text-3xl font-bold text-primary">
                                {Math.round((score / (aiResults?.interactiveLearning?.quiz.length || 1)) * 100)}%
                              </div>
                              <Button onClick={handleRestartQuiz} className="mt-4">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Ricomincia Quiz
                              </Button>
                            </div>
                          ) : currentQuiz ? (
                            <div className="bg-muted/20 rounded-lg p-8">
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h2 className="text-xl font-bold">Domanda {currentQuizIndex + 1}</h2>
                                  <Badge className={getDifficultyColor(currentQuiz.difficulty)}>
                                    {currentQuiz.difficulty === 'easy' ? 'Facile' : 
                                     currentQuiz.difficulty === 'medium' ? 'Medio' : 'Difficile'}
                                  </Badge>
                                </div>
                                <p className="text-lg leading-relaxed">{currentQuiz.question}</p>
                              </div>

                              <div className="space-y-3 mb-6">
                                {currentQuiz.options.map((option, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                                      selectedAnswer === index
                                        ? index === currentQuiz.correctAnswer
                                          ? 'bg-green-100 border-green-300 text-green-800'
                                          : 'bg-red-100 border-red-300 text-red-800'
                                        : 'bg-background hover:bg-muted/50 border-border'
                                    } ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                        {String.fromCharCode(65 + index)}
                                      </span>
                                      <span>{option}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              {showExplanation && (
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                  <h3 className="font-semibold text-primary mb-2">Spiegazione</h3>
                                  <p className="text-sm">{currentQuiz.explanation}</p>
                                </div>
                              )}

                              {selectedAnswer !== null && (
                                <div className="flex justify-center mt-6">
                                  <Button onClick={handleNextQuiz}>
                                    {currentQuizIndex < (aiResults?.interactiveLearning?.quiz.length || 0) - 1 ? (
                                      <>
                                        <SkipForward className="w-4 h-4 mr-2" />
                                        Prossima Domanda
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Completa Quiz
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      )}

                      {currentTab === 'flashcards' && (
                        <div className="space-y-6">
                          {currentFlashcard ? (
                            <div className="bg-muted/20 rounded-lg p-8">
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h2 className="text-xl font-bold">Flashcard {currentFlashcardIndex + 1}</h2>
                                  <Badge variant="outline">
                                    {currentFlashcard.category === 'concept' ? 'Concetto' :
                                     currentFlashcard.category === 'symbol' ? 'Simbolo' :
                                     currentFlashcard.category === 'theme' ? 'Tema' : 'Citazione'}
                                  </Badge>
                                </div>
                              </div>

                              <div className="min-h-[200px] flex items-center justify-center">
                                <div className="text-center space-y-4">
                                  <div className="text-2xl font-bold mb-4">
                                    {showFlashcardBack ? currentFlashcard.back : currentFlashcard.front}
                                  </div>
                                  <Button
                                    onClick={() => setShowFlashcardBack(!showFlashcardBack)}
                                    variant="outline"
                                  >
                                    {showFlashcardBack ? 'Mostra Fronte' : 'Mostra Retro'}
                                  </Button>
                                </div>
                              </div>

                              <div className="flex justify-between mt-6">
                                <Button onClick={handlePrevFlashcard} variant="outline">
                                  <ArrowLeft className="w-4 h-4 mr-2" />
                                  Precedente
                                </Button>
                                <Button onClick={handleNextFlashcard}>
                                  Successiva
                                  <SkipForward className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {currentTab === 'reflection' && (
                        <div className="space-y-6">
                          {aiResults?.interactiveLearning?.reflectiveQuestions.map((question, index) => (
                            <div key={question.id} className="bg-muted/20 rounded-lg p-8">
                              <h3 className="text-xl font-bold mb-4">Domanda Riflessiva {index + 1}</h3>
                              <p className="text-lg mb-6">{question.question}</p>
                              
                              <div className="space-y-3">
                                <h4 className="font-semibold text-muted-foreground">Spunti per la riflessione:</h4>
                                {question.prompts.map((prompt, promptIndex) => (
                                  <div key={promptIndex} className="flex items-start gap-3 bg-background/50 rounded-lg p-4">
                                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-xs font-bold text-primary">{promptIndex + 1}</span>
                                    </div>
                                    <p className="text-sm">{prompt}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h2 className="text-xl font-semibold mb-2">Modalità Studio Attiva</h2>
                      <p className="text-sm">Genera i quiz per visualizzare il contenuto in modalità studio</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Zen Controls - Angolo in alto a destra */}
        <div className="absolute top-4 right-4 z-50">
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50 shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSound}
              className="h-8 w-8 p-0"
              title={isSoundEnabled ? "Disattiva suoni" : "Attiva suoni ambientali"}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleZenMode}
              className="h-8 w-8 p-0"
              title="Esci dalla modalità studio"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Zen Footer - Centrato in basso */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 border border-border/50 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground">
                {hasQuiz ? 'Modalità Studio - Quiz Attivi' : 'Modalità Studio Attiva'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Main Content */}
      {!hasQuiz ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-lg font-semibold mb-3">Genera Quiz Interattivi</h3>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                <strong>Jiraiya Sensei</strong> creerà quiz personalizzati basati sull'analisi del tuo testo:
              </p>

              <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Quiz a scelta multipla con spiegazioni</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Flashcard per concetti chiave</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Domande riflessive per l'introspezione</span>
                </div>
              </div>

              <Button 
                onClick={onGenerateQuiz}
                disabled={isGenerating}
                size="lg" 
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Generando quiz...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Genera Quiz AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="quiz" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span className="hidden sm:inline">Quiz</span>
              <span className="sm:hidden">🎯</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Flashcard</span>
              <span className="sm:hidden">📚</span>
            </TabsTrigger>
            <TabsTrigger value="reflection" className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              <span className="hidden sm:inline">Riflessione</span>
              <span className="sm:hidden">🧠</span>
            </TabsTrigger>
          </TabsList>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-4">
            {!quizCompleted ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Domanda {currentQuizIndex + 1} di {aiResults?.interactiveLearning?.quiz.length}</span>
                    <Badge className={getDifficultyColor(currentQuiz?.difficulty || 'medium')}>
                      {currentQuiz?.difficulty || 'medium'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg font-medium">{currentQuiz?.question}</p>
                  
                  <div className="space-y-2">
                    {currentQuiz?.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === index ? 
                          (index === currentQuiz?.correctAnswer ? "default" : "destructive") : 
                          "outline"
                        }
                        className="w-full justify-start h-auto p-4"
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <div className="flex items-center gap-3">
                          {selectedAnswer === index && (
                            index === currentQuiz?.correctAnswer ? 
                              <CheckCircle className="w-4 h-4 text-green-600" /> : 
                              <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                          <span className="text-left">{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {showExplanation && (
                    <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                      <h4 className="font-semibold mb-2">Spiegazione:</h4>
                      <p className="text-sm">{currentQuiz?.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      onClick={handleRestartQuiz}
                      variant="outline"
                      size="sm"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Ricomincia
                    </Button>

                    <Button
                      onClick={handleNextQuiz}
                      disabled={!showExplanation}
                      size="sm"
                    >
                      {currentQuizIndex < (aiResults?.interactiveLearning?.quiz.length || 0) - 1 ? (
                        <>
                          <SkipForward className="w-4 h-4 mr-2" />
                          Prossima
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completa
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quiz Completato!</h3>
                  <p className="text-lg mb-4">
                    Hai risposto correttamente a <strong>{score}</strong> domande su <strong>{aiResults?.interactiveLearning?.quiz.length}</strong>
                  </p>
                  <div className="text-sm text-muted-foreground mb-6">
                    Percentuale di successo: <strong>{Math.round((score / (aiResults?.interactiveLearning?.quiz.length || 1)) * 100)}%</strong>
                  </div>
                  <Button onClick={handleRestartQuiz} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Ricomincia Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="space-y-4">
            {hasFlashcards ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Flashcard {currentFlashcardIndex + 1} di {aiResults?.interactiveLearning?.flashcards.length}</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(currentFlashcard?.category || 'concept')}
                      {currentFlashcard?.category || 'concept'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="min-h-[200px] bg-card border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center cursor-pointer transition-all hover:border-primary"
                    onClick={() => setShowFlashcardBack(!showFlashcardBack)}
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        {showFlashcardBack ? 'Risposta' : 'Domanda'}
                      </h3>
                      <p className="text-foreground">
                        {showFlashcardBack ? currentFlashcard?.back : currentFlashcard?.front}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={handlePrevFlashcard}
                      variant="outline"
                      size="sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Precedente
                    </Button>

                    <Button
                      onClick={() => setShowFlashcardBack(!showFlashcardBack)}
                      variant="outline"
                      size="sm"
                    >
                      {showFlashcardBack ? (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Nascondi
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Mostra
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleNextFlashcard}
                      size="sm"
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Successiva
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Nessuna flashcard disponibile</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reflection Tab */}
          <TabsContent value="reflection" className="space-y-4">
            {hasReflectiveQuestions ? (
              <div className="space-y-4">
                {aiResults?.interactiveLearning?.reflectiveQuestions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        Domanda Riflessiva {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-lg font-medium">{question.question}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">Spunti per la riflessione:</h4>
                        {question.prompts.map((prompt, promptIndex) => (
                          <div key={promptIndex} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                            <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">{promptIndex + 1}</span>
                            </div>
                            <p className="text-sm">{prompt}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Nessuna domanda riflessiva disponibile</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Status Info */}
      <div className="pt-3 text-center">
        <div className="text-xs text-muted-foreground">
          <span>🎯 {hasQuiz ? 'Quiz interattivi attivi' : 'Pronto per generare quiz'}</span>
          {hasQuiz && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {aiResults?.interactiveLearning?.quiz.length || 0} quiz
              </Badge>
              <Badge variant="outline" className="text-xs">
                {aiResults?.interactiveLearning?.flashcards.length || 0} flashcard
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};