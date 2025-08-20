import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, MessageSquare, List, Twitter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizPlayer } from './QuizPlayer';
import { FlashcardDeck } from './FlashcardDeck';
import type { AiResults } from '@/types';
import { useState } from 'react';

interface AiResultsTabsProps {
  results: AiResults;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AiResultsTabs: React.FC<AiResultsTabsProps> = ({ 
  results, 
  activeTab, 
  onTabChange 
}) => {
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  const handleCopy = async (text: string, itemKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [itemKey]: true }));
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [itemKey]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const CopyButton: React.FC<{ text: string; itemKey: string }> = ({ text, itemKey }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleCopy(text, itemKey)}
      className="h-8 w-8 p-0 hover:bg-accent"
    >
      {copiedItems[itemKey] ? (
        <Check className="w-3 h-3 text-success" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">🧙‍♂️ Risultati di Jiraiya Sensei</h2>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="summaries" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Sintesi
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="reflection" className="flex items-center gap-1">
            <List className="w-4 h-4" />
            Riflessione
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-1">
            <Copy className="w-4 h-4" />
            Flashcard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summaries" className="space-y-4">
          {/* Tweet Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-500" />
                  Tweet (≤280 caratteri)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={results.summaries.tweet.length <= 280 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {results.summaries.tweet.length}/280
                  </Badge>
                  <CopyButton text={results.summaries.tweet} itemKey="tweet" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-lg">
                {results.summaries.tweet}
              </p>
            </CardContent>
          </Card>

          {/* Paragraph Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Paragrafo (~150 parole)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {results.summaries.paragraph.split(' ').length} parole
                  </Badge>
                  <CopyButton text={results.summaries.paragraph} itemKey="paragraph" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {results.summaries.paragraph}
              </p>
            </CardContent>
          </Card>

          {/* Bullet Points */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <List className="w-4 h-4 text-accent" />
                  Schema puntato
                </CardTitle>
                <CopyButton 
                  text={results.summaries.bullets.map(bullet => `• ${bullet}`).join('\n')} 
                  itemKey="bullets" 
                />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.summaries.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <QuizPlayer questions={results.quiz} />
        </TabsContent>

        <TabsContent value="reflection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                🤔 Domanda Riflessiva Socratica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm leading-relaxed italic">
                  "{results.reflection}"
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  💭 La tua riflessione personale:
                </label>
                <Textarea
                  placeholder="Prendi il tempo necessario per riflettere profondamente su questa domanda. Non esistono risposte giuste o sbagliate, solo il tuo percorso di comprensione..."
                  value={reflectionAnswer}
                  onChange={(e) => setReflectionAnswer(e.target.value)}
                  className="min-h-32 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  ✨ La riflessione personale è uno strumento potente per l'apprendimento profondo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards">
          <FlashcardDeck flashcards={results.flashcards} />
        </TabsContent>
      </Tabs>
    </div>
  );
};