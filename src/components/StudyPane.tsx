import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  Play, 
  Settings, 
  Download, 
  RotateCcw,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import type { AiResults, QuizQuestion, Flashcard } from '@/types';

interface StudyPaneProps {
  aiResults: AiResults | null;
  isGeneratingQuiz: boolean;
  onGenerateQuiz: () => void;
  onResetQuiz: () => void;
  quizItems: QuizQuestion[];
  flashcards: Flashcard[];
  lastScore?: { correct: number; total: number };
}

export const StudyPane: React.FC<StudyPaneProps> = ({
  aiResults,
  isGeneratingQuiz,
  onGenerateQuiz,
  onResetQuiz,
  quizItems,
  flashcards,
  lastScore
}) => {
  const [activeTab, setActiveTab] = useState('config');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    numQuestions: 5,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    type: 'mcq' as 'mcq' | 'boolean' | 'cloze'
  });

  const currentQuestion = quizItems[currentQuestionIndex];
  const isQuizComplete = selectedAnswer !== null;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizItems.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    onResetQuiz();
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Studio</h2>
        </div>
        <div className="flex items-center gap-2">
          {quizItems.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {quizItems.length} domande
            </Badge>
          )}
          {lastScore && (
            <Badge variant="secondary" className="text-xs">
              {lastScore.correct}/{lastScore.total}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Config
          </TabsTrigger>
          <TabsTrigger value="quiz" className="text-xs" disabled={quizItems.length === 0}>
            <Target className="w-3 h-3 mr-1" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="text-xs">
            <BookOpen className="w-3 h-3 mr-1" />
            Flashcard
          </TabsTrigger>
        </TabsList>

        {/* Config Tab */}
        <TabsContent value="config" className="flex-1 flex flex-col mt-2">
          {!aiResults ? (
            /* Empty State - No Analysis */
            <Card className="flex-1 flex items-center justify-center">
              <CardContent className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-sm font-medium mb-2">Nessuna analisi disponibile</h3>
                <p className="text-xs text-muted-foreground">
                  Completa l'analisi AI per generare quiz
                </p>
              </CardContent>
            </Card>
          ) : (
            /* Quiz Configuration */
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuratore Quiz
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Number of Questions */}
                  <div className="space-y-2">
                    <Label htmlFor="numQuestions" className="text-xs">Numero domande</Label>
                    <Input
                      id="numQuestions"
                      type="number"
                      min="1"
                      max="20"
                      value={quizConfig.numQuestions}
                      onChange={(e) => setQuizConfig(prev => ({
                        ...prev,
                        numQuestions: parseInt(e.target.value) || 5
                      }))}
                      className="h-8"
                    />
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-xs">Difficoltà</Label>
                    <Select
                      value={quizConfig.difficulty}
                      onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                        setQuizConfig(prev => ({ ...prev, difficulty: value }))
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Facile</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="hard">Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-xs">Tipo</Label>
                    <Select
                      value={quizConfig.type}
                      onValueChange={(value: 'mcq' | 'boolean' | 'cloze') => 
                        setQuizConfig(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Scelta multipla</SelectItem>
                        <SelectItem value="boolean">Vero/Falso</SelectItem>
                        <SelectItem value="cloze">Completamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={onGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  className="w-full mt-auto"
                  size="sm"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Genera Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="flex-1 flex flex-col mt-2">
          {currentQuestion ? (
            <div className="flex-1 flex flex-col">
              {/* Quiz AI Disclaimer */}
              <Alert className="mb-4 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <AlertDescription className="text-sm text-purple-800 dark:text-purple-300">
                  <strong>Quiz generati dall'AI:</strong> Le domande e le risposte sono create automaticamente dall'intelligenza artificiale. 
                  Potrebbero contenere errori o imprecisioni. Usali come supporto allo studio, non come fonte definitiva.
                </AlertDescription>
              </Alert>

              {/* Question Card */}
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Domanda {currentQuestionIndex + 1} di {quizItems.length}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {currentQuestion.difficulty}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetQuiz}
                        className="h-6 px-2"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <p className="text-sm font-medium mb-4">{currentQuestion.question}</p>
                  
                  <div className="space-y-2 flex-1">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={isQuizComplete}
                        className={`w-full p-3 text-left rounded-md border transition-colors ${
                          selectedAnswer === index
                            ? index === currentQuestion.correctAnswer
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-background hover:bg-muted/50'
                        } ${isQuizComplete ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{index + 1}.</span>
                          <span className="text-sm">{option}</span>
                          {selectedAnswer === index && (
                            index === currentQuestion.correctAnswer ? (
                              <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                            )
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Explanation */}
                  {showExplanation && (
                    <div className="p-3 bg-muted/30 rounded-md mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium">Spiegazione</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation - Compatta */}
              <div className="flex items-center justify-center gap-4 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <span className="text-xs text-muted-foreground">
                  {currentQuestionIndex + 1} / {quizItems.length}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === quizItems.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <CardContent className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-sm font-medium mb-2">Nessun quiz disponibile</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Genera un quiz per iniziare
                </p>
                <Button onClick={() => setActiveTab('config')} size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configura Quiz
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Flashcards Tab */}
        <TabsContent value="flashcards" className="flex-1 flex flex-col mt-2">
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-sm font-medium mb-2">Flashcard in Sviluppo</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Questa funzionalità è attualmente in fase di sviluppo
              </p>
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};