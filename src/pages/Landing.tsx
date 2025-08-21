import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Brain, 
  Target, 
  Eye, 
  Lightbulb, 
  FileText, 
  Camera, 
  Wand2, 
  Star,
  Quote,
  Heart,
  Shield,
  Globe,
  Sparkles,
  CheckCircle,
  BookMarked,
  PenTool,
  BarChart3,
  Award,
  Clock,
  Zap,
  Play,
  Download,
  Share2,
  Settings,
  Lock,
  Globe2,
  Smartphone,
  Monitor,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const heroFeatures = [
    {
      icon: Camera,
      title: "OCR Intelligente",
      description: "Trasforma qualsiasi testo stampato in digitale con precisione elevata"
    },
    {
      icon: Brain,
      title: "Analisi AI Avanzata",
      description: "Scopri significati nascosti e simboli attraverso l'intelligenza artificiale"
    },
    {
      icon: Target,
      title: "Quiz Personalizzati",
      description: "Testa la comprensione con contenuti interattivi generati automaticamente"
    }
  ];

  const teacherBenefits = [
    {
      icon: BookMarked,
      title: "Preparazione Lezioni",
      description: "Analizza rapidamente testi letterari per creare lezioni coinvolgenti e approfondite",
      color: "text-blue-600"
    },
    {
      icon: PenTool,
      title: "Creazione Quiz",
      description: "Genera automaticamente quiz e domande di comprensione personalizzate",
      color: "text-green-600"
    },
    {
      icon: Brain,
      title: "Analisi Approfondita",
      description: "Ottieni analisi simboliche e filosofiche dettagliate per arricchire le tue lezioni",
      color: "text-purple-600"
    },
    {
      icon: FileText,
      title: "Materiali Didattici",
      description: "Crea materiali di studio esportando le analisi in formato Markdown",
      color: "text-orange-600"
    },
    {
      icon: Clock,
      title: "Risparmio Tempo",
      description: "Automatizza l'analisi di testi complessi, risparmiando ore di lavoro manuale",
      color: "text-red-600"
    },
    {
      icon: Award,
      title: "Contenuti Qualitativi",
      description: "Migliora la qualità delle tue lezioni con analisi AI professionali",
      color: "text-indigo-600"
    }
  ];

  const readerBenefits = [
    {
      icon: Eye,
      title: "Scoperta di Significati",
      description: "Rivela simboli, archetipi e significati nascosti nei tuoi libri preferiti",
      color: "text-emerald-600"
    },
    {
      icon: Heart,
      title: "Riflessione Personale",
      description: "Approfondisci la tua comprensione attraverso analisi filosofiche e simboliche",
      color: "text-pink-600"
    },
    {
      icon: Lightbulb,
      title: "Lezioni di Vita",
      description: "Estrai insegnamenti pratici e riflessioni filosofiche da ogni lettura",
      color: "text-yellow-600"
    },
    {
      icon: Brain,
      title: "Analisi Approfondita",
      description: "Ottieni analisi dettagliate di trama, personaggi e temi letterari",
      color: "text-cyan-600"
    },
    {
      icon: Target,
      title: "Quiz Interattivi",
      description: "Testa la tua comprensione con quiz personalizzati e flashcards",
      color: "text-rose-600"
    },
    {
      icon: FileText,
      title: "Export e Condivisione",
      description: "Salva e condividi le tue analisi in formato Markdown",
      color: "text-violet-600"
    }
  ];

  const features = [
    {
      icon: Camera,
      title: "OCR Intelligente",
      description: "Trasforma immagini di testo in digitale con precisione elevata",
      details: ["Supporto per JPG, PNG, PDF", "Gestione di caratteri speciali", "Correzione automatica errori"]
    },
    {
      icon: Brain,
      title: "Analisi Letteraria AI",
      description: "Analisi approfondita di trama, personaggi, simboli e temi",
      details: ["Analisi simbolica avanzata", "Interpretazione filosofica", "Connessioni tematiche"]
    },
    {
      icon: Target,
      title: "Quiz Intelligenti",
      description: "Generazione automatica di quiz personalizzati basati sul contenuto",
      details: ["Domande a scelta multipla", "Flashcards interattive", "Domande riflessive"]
    },
    {
      icon: FileText,
      title: "Export Markdown",
      description: "Esporta le tue analisi in formato Markdown per condivisione e archiviazione",
      details: ["Formato Markdown pulito", "Struttura organizzata", "Facile condivisione"]
    }
  ];

  const testimonials = [
    {
      name: "Prof.ssa Maria Rossi",
      role: "Insegnante di Lettere",
      content: "Jiraiya Sensei ha rivoluzionato il mio modo di preparare le lezioni. L'analisi simbolica è incredibilmente accurata e i quiz generati automaticamente coinvolgono molto i miei studenti.",
      rating: 5
    },
    {
      name: "Alessandro Bianchi",
      role: "Appassionato di Letteratura",
      content: "Finalmente posso approfondire i miei libri preferiti in modo professionale. Le analisi sono dettagliate e le lezioni di vita estratte sono sempre illuminanti.",
      rating: 5
    },
    {
      name: "Prof. Marco Verdi",
      role: "Docente Universitario",
      content: "Uso Jiraiya Sensei per le mie ricerche letterarie. L'OCR è preciso e l'analisi AI offre spunti interessanti che integro nelle mie pubblicazioni.",
      rating: 5
    }
  ];

  const futurePlans = {
    teacher: {
      title: "Insegnante",
      icon: GraduationCap,
      description: "Gestisci classi e monitora i progressi degli studenti",
      features: [
        "Registrazione e gestione classi",
        "Assegnazione letture estive",
        "Configurazione quiz personalizzati",
        "Monitoraggio progressi in tempo reale",
        "Dashboard analitiche avanzate",
        "Collaborazione con colleghi"
      ],
      color: "text-blue-600"
    },
    student: {
      title: "Studente",
      icon: BookOpen,
      description: "Accedi ai materiali assegnati dal tuo insegnante",
      features: [
        "Accesso ai libri assegnati",
        "Materiali didattici integrati",
        "Quiz personalizzati per classe",
        "Tracciamento progressi personali",
        "Collaborazione con compagni",
        "Feedback personalizzato"
      ],
      color: "text-green-600"
    },
    enthusiast: {
      title: "Appassionato",
      icon: Heart,
      description: "Strumento personale per la riflessione e lo studio",
      features: [
        "Analisi letterarie illimitate",
        "Biblioteca personale",
        "Quiz di auto-valutazione",
        "Note e riflessioni personali",
        "Condivisione con community",
        "Esplorazione guidata"
      ],
      color: "text-purple-600"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
                          <Link to="/app" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Jiraiya Sensei" className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-bold">Jiraiya Sensei</h1>
                <p className="text-sm text-muted-foreground">Critico Letterario AI</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:block">
                Come Funziona
              </Link>
              <Link to="/app">
                <Button size="sm">
                  Prova Ora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                🎓 Per Insegnanti e Appassionati di Lettura
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Trasforma la
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Lettura </span>
                in
                <span className="bg-gradient-to-r from-purple-600 to-primary bg-clip-text text-transparent"> Saggezza</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Jiraiya Sensei è il tuo mentore AI per l'analisi letteraria. Scopri significati nascosti, 
                crea quiz personalizzati e approfondisci ogni testo con intelligenza artificiale avanzata. 
                Versione beta disponibile ora.
              </p>
            </div>

                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link to="/app">
                 <Button size="lg" className="text-lg px-8 py-6">
                   Inizia Gratis Ora
                   <ArrowRight className="w-5 h-5 ml-2" />
                 </Button>
               </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Play className="w-5 h-5 mr-2" />
                  Guarda Demo
                </Button>
              </Link>
            </div>

            {/* Hero Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {heroFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Teachers Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Per Insegnanti</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Rivoluziona il tuo modo di insegnare letteratura con strumenti AI avanzati 
                che ti aiutano a creare lezioni coinvolgenti e valutazioni personalizzate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherBenefits.map((benefit, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 mb-4 bg-${benefit.color.replace('text-', '')}/10 rounded-lg flex items-center justify-center`}>
                      <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Readers Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold">Per Appassionati di Lettura</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Approfondisci i tuoi libri preferiti con analisi letterarie professionali 
                e scopri significati che non avevi mai notato prima.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {readerBenefits.map((benefit, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 mb-4 bg-${benefit.color.replace('text-', '')}/10 rounded-lg flex items-center justify-center`}>
                      <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Caratteristiche Avanzate</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tecnologie all'avanguardia unite alla saggezza di Jiraiya per un'esperienza di apprendimento unica
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {feature.description}
                        </p>
                        <ul className="space-y-2">
                          {feature.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Cosa Dicono di Noi</h2>
              <p className="text-xl text-muted-foreground">
                Insegnanti e appassionati che hanno già scoperto il potere di Jiraiya Sensei
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground mb-4 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

            {/* Future Plans Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
                🚀 Roadmap Futura
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Tre Livelli di Esperienza</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Stiamo sviluppando un sistema completo di autenticazione e gestione utenti 
                per offrire esperienze personalizzate per ogni tipo di utente.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Object.entries(futurePlans).map(([key, plan]) => (
                <Card key={key} className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader className="text-center pb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-${plan.color.replace('text-', '')}/10 rounded-full flex items-center justify-center`}>
                      <plan.icon className={`w-8 h-8 ${plan.color}`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.title}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-border">
                      <Badge variant="outline" className="text-xs">
                        In Sviluppo
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Development Roadmap */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-blue-200 mb-4">
                  📈 Roadmap di Sviluppo
                </Badge>
                <h3 className="text-2xl font-bold mb-4">Piano di Crescita</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Una roadmap chiara per trasformare Jiraiya Sensei in una piattaforma educativa completa
                </p>
              </div>

              <div className="relative">
                {/* Timeline Line - Hidden on mobile, visible on desktop */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full"></div>

                {/* Phase 1 - Current */}
                <div className="relative mb-8 md:mb-16 timeline-item">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 md:p-6 shadow-lg border border-blue-200 dark:border-blue-800 roadmap-card">
                        <div className="flex items-center justify-center md:justify-end gap-3 mb-3">
                          <Badge className="bg-blue-500 text-white">Fase 1</Badge>
                          <span className="text-sm text-muted-foreground">Q1 2024</span>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-center md:text-left">Versione Beta</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• OCR intelligente per immagini</li>
                          <li>• Analisi letteraria AI avanzata</li>
                          <li>• Quiz interattivi generati automaticamente</li>
                          <li>• Export in formato Markdown</li>
                        </ul>
                        <div className="mt-4 flex items-center justify-center md:justify-end gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Completato</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg z-10 timeline-dot"></div>
                    <div className="w-full md:w-1/2 md:pl-8"></div>
                  </div>
                </div>

                {/* Phase 2 - Authentication */}
                <div className="relative mb-8 md:mb-16 timeline-item">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 md:pr-8 hidden md:block"></div>
                    <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg z-10 timeline-dot"></div>
                    <div className="w-full md:w-1/2 md:pl-8 mt-4 md:mt-0">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 md:p-6 shadow-lg border border-purple-200 dark:border-purple-800 roadmap-card">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                          <Badge className="bg-purple-500 text-white">Fase 2</Badge>
                          <span className="text-sm text-muted-foreground">Q2 2024</span>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-center md:text-left">Sistema di Autenticazione</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Registrazione e login utenti</li>
                          <li>• Profili personalizzati</li>
                          <li>• Salvataggio analisi</li>
                          <li>• Dashboard utente</li>
                        </ul>
                        <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-yellow-600 font-medium">In Sviluppo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 3 - Teacher Features */}
                <div className="relative mb-8 md:mb-16 timeline-item">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 md:p-6 shadow-lg border border-green-200 dark:border-green-800 roadmap-card">
                        <div className="flex items-center justify-center md:justify-end gap-3 mb-3">
                          <Badge className="bg-green-500 text-white">Fase 3</Badge>
                          <span className="text-sm text-muted-foreground">Q3 2024</span>
                        </div>
                        <h4 className="text-lg font-semibold mb-2 text-center md:text-left">Piattaforma Educativa</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Gestione classi per insegnanti</li>
                          <li>• Assegnazione letture</li>
                          <li>• Monitoraggio progressi studenti</li>
                          <li>• Dashboard analitiche</li>
                        </ul>
                        <div className="mt-4 flex items-center justify-center md:justify-end gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-500 font-medium">Pianificato</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg z-10 timeline-dot"></div>
                    <div className="w-full md:w-1/2 md:pl-8"></div>
                  </div>
                </div>
              </div>

              {/* Investment Highlights */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 investment-highlight">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2 text-sm md:text-base">Mercato Target</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Insegnanti, studenti e appassionati di letteratura - mercato globale in crescita
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 investment-highlight">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2 text-sm md:text-base">Modello di Business</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Freemium + abbonamenti premium + licenze istituzionali
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 investment-highlight sm:col-span-2 lg:col-span-1">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2 text-sm md:text-base">Tecnologia</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      AI avanzata, OCR intelligente
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wand2 className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Prova la Versione Beta</h2>
            </div>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Scopri il potere dell'analisi letteraria AI con Jiraiya Sensei. 
              Questa è la versione beta con tutte le funzionalità core già disponibili.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Prova Ora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/20 text-black hover:bg-white/10">
                  Come Funziona
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-75 mt-6">
              🚀 Sistema di autenticazione e gestione utenti in arrivo
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Jiraiya Sensei" className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold">Jiraiya Sensei</h3>
                    <p className="text-sm text-muted-foreground">Critico Letterario AI</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Trasforma la lettura in saggezza con l'intelligenza artificiale avanzata.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Prodotto</h4>
                                 <ul className="space-y-2 text-sm text-muted-foreground">
                   <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Come Funziona</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">Caratteristiche</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">Prezzi</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">Demo</Link></li>
                 </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Supporto</h4>
                                 <ul className="space-y-2 text-sm text-muted-foreground">
                   <li><Link to="/app" className="hover:text-primary transition-colors">Documentazione</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">FAQ</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">Contatti</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">Community</Link></li>
                 </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legale</h4>
                                 <ul className="space-y-2 text-sm text-muted-foreground">
                   <li><Link to="/app" className="hover:text-primary transition-colors">Privacy</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">Termini</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">Cookie</Link></li>
                   <li><Link to="/app" className="hover:text-primary transition-colors">Licenze</Link></li>
                 </ul>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © 2024 Jiraiya Sensei. Tutti i diritti riservati.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .timeline-item:nth-child(odd) {
          animation: slideInFromLeft 0.8s ease-out;
        }

        .timeline-item:nth-child(even) {
          animation: slideInFromRight 0.8s ease-out;
        }

        .investment-highlight {
          animation: fadeInUp 0.6s ease-out;
        }

        .timeline-dot {
          transition: all 0.3s ease;
        }

        .timeline-dot:hover {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .roadmap-card {
          transition: all 0.3s ease;
        }

        .roadmap-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Landing;
