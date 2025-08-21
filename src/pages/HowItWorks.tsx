import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Brain, 
  Upload, 
  Edit, 
  Target, 
  BookOpen, 
  Eye, 
  Lightbulb, 
  Zap, 
  FileText, 
  Camera, 
  Wand2, 
  Users, 
  Star,
  Quote,
  GraduationCap,
  Heart,
  Shield,
  Globe,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const features = [
    {
      icon: Camera,
      title: "OCR Avanzato",
      description: "Trasforma immagini di testo in testo digitale con precisione elevata, supportando vari formati e lingue.",
      color: "text-blue-600"
    },
    {
      icon: Brain,
      title: "Analisi AI",
      description: "Jiraiya Sensei analizza il testo con intelligenza artificiale avanzata per rivelare significati profondi.",
      color: "text-purple-600"
    },
    {
      icon: Eye,
      title: "Analisi Simbolica",
      description: "Scopre simboli, archetipi e significati nascosti nel testo attraverso l'analisi letteraria.",
      color: "text-green-600"
    },
    {
      icon: Lightbulb,
      title: "Lezioni di Vita",
      description: "Estrae insegnamenti pratici e riflessioni filosofiche per la crescita personale.",
      color: "text-yellow-600"
    },
    {
      icon: Target,
      title: "Quiz Interattivi",
      description: "Testa la tua comprensione con quiz personalizzati e flashcards per consolidare l'apprendimento.",
      color: "text-red-600"
    },
    {
      icon: FileText,
      title: "Export Completo",
      description: "Esporta le analisi in formato Markdown per conservare e condividere le tue scoperte.",
      color: "text-indigo-600"
    }
  ];

  const steps = [
    {
      step: "1",
      icon: Upload,
      title: "Carica le Pagine",
      description: "Carica immagini di testo, documenti o pagine di libri che vuoi analizzare.",
      details: "Supporta formati JPG, PNG, PDF. L'OCR converte automaticamente le immagini in testo."
    },
    {
      step: "2",
      icon: Edit,
      title: "Modifica il Testo",
      description: "Controlla e perfeziona il testo estratto prima dell'analisi.",
      details: "Strumenti di formattazione avanzati per pulire e ottimizzare il testo per l'analisi AI."
    },
    {
      step: "3",
      icon: Brain,
      title: "Analisi Letteraria",
      description: "Jiraiya Sensei analizza il testo con intelligenza artificiale avanzata.",
      details: "Genera sintesi, analisi simbolica, interpretazioni filosofiche e lezioni di vita personalizzate."
    },
    {
      step: "4",
      icon: Target,
      title: "Quiz e Apprendimento",
      description: "Testa la tua comprensione con contenuti interattivi personalizzati.",
      details: "Quiz, flashcards e domande riflessive generati automaticamente dal contenuto analizzato."
    }
  ];

  const philosophy = {
    title: "La Filosofia di Jiraiya Sensei",
    quote: "La saggezza non viene dall'età, ma dall'esperienza e dalla riflessione.",
    description: "Jiraiya Sensei rappresenta la figura del mentore saggio che guida l'allievo nel percorso di crescita e comprensione.",
    elements: [
      {
        icon: GraduationCap,
        title: "Mentore e Guida",
        description: "Come Jiraiya nella serie Naruto, il nostro AI serve come mentore che accompagna l'utente nel viaggio di scoperta letteraria."
      },
      {
        icon: Heart,
        title: "Supporto Emotivo",
        description: "Non solo analisi tecnica, ma anche comprensione emotiva e supporto nel processo di apprendimento."
      },
      {
        icon: Shield,
        title: "Protezione della Saggezza",
        description: "Aiuta a proteggere e tramandare la saggezza contenuta nei testi attraverso l'interpretazione moderna."
      },
      {
        icon: Globe,
        title: "Connessione Universale",
        description: "Rivela le connessioni universali tra testi diversi e le verità atemporali che contengono."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Jiraiya Sensei" className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-bold">Jiraiya Sensei</h1>
                <p className="text-sm text-muted-foreground">Come Funziona</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna all'App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/logo.png" alt="Jiraiya Sensei" className="w-16 h-16" />
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Jiraiya Sensei
                </h1>
                <p className="text-lg text-muted-foreground">Critico Letterario e Simbolico AI</p>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Scopri come l'intelligenza artificiale ispirata al leggendario mentore di Naruto 
              trasforma la lettura in un'esperienza di apprendimento profonda e significativa.
            </p>
          </div>

          {/* Philosophy Section */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Quote className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">{philosophy.title}</CardTitle>
              </div>
              <blockquote className="text-lg italic text-muted-foreground max-w-2xl mx-auto">
                "{philosophy.quote}"
              </blockquote>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground leading-relaxed">
                {philosophy.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {philosophy.elements.map((element, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <element.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{element.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {element.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How It Works Steps */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Come Funziona</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Un processo semplice in 4 step per trasformare qualsiasi testo in saggezza profonda
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <step.icon className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-3 leading-relaxed">
                          {step.description}
                        </p>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Caratteristiche Principali</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tecnologie avanzate unite alla saggezza di Jiraiya per un'esperienza di apprendimento unica
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 bg-${feature.color.replace('text-', '')}/10 rounded-lg flex items-center justify-center`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* OCR Technology Section */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl">Tecnologia OCR</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Come Funziona l'OCR</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Caricamento dell'immagine e compressione automatica se necessario</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Analisi dei caratteri e riconoscimento del testo tramite AI avanzata</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Pulizia automatica del testo e correzione degli errori comuni</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Formattazione intelligente per ottimizzare l'analisi successiva</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Formati Supportati</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Badge variant="outline" className="justify-center">JPG / JPEG</Badge>
                    <Badge variant="outline" className="justify-center">PNG</Badge>
                    <Badge variant="outline" className="justify-center">PDF</Badge>
                    <Badge variant="outline" className="justify-center">BMP</Badge>
                    <Badge variant="outline" className="justify-center">TIFF</Badge>
                    <Badge variant="outline" className="justify-center">WEBP</Badge>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Caratteristiche Avanzate
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Riconoscimento multilingua</li>
                      <li>• Gestione automatica dell'orientamento</li>
                      <li>• Compressione intelligente delle immagini</li>
                      <li>• Correzione automatica degli errori OCR</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Wand2 className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Pronto per Iniziare?</h2>
              </div>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                Trasforma qualsiasi testo in saggezza profonda con Jiraiya Sensei. 
                Inizia il tuo viaggio di scoperta letteraria oggi stesso.
              </p>
              <Link to="/">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Inizia l'Analisi
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
