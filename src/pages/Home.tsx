import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Plus,
  Sun,
  Moon,
  Monitor,
  Upload,
  Info,
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { AiModelSelector } from '@/components/AiModelSelector';
import { NewProjectModal } from '@/components/NewProjectModal';
import { ProjectList } from '@/components/ProjectList';
import { MethodologyList } from '@/components/MethodologyList';
import { MethodologyEditor } from '@/components/MethodologyEditor';
import { JsonImportExport } from '@/components/JsonImportExport';
import { InfoModal } from '@/components/InfoModal';
import { useSessionState } from '@/hooks/use-session-state';
import type { Project, Methodology } from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateState, resetSession, exportState, importState } = useSessionState();
  const { theme, toggleTheme } = useTheme();


  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [methodologyEditor, setMethodologyEditor] = useState<{
    mode: 'create' | 'edit' | 'duplicate';
    methodology?: Methodology;
    isOpen: boolean;
  }>({ mode: 'create', isOpen: false });
  const [jsonImportExport, setJsonImportExport] = useState<{
    mode: 'import' | 'export';
    methodology?: Methodology;
    isOpen: boolean;
  }>({ mode: 'import', isOpen: false });
  const [infoModal, setInfoModal] = useState<{
    type: 'project' | 'methodology' | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });

  // Header control functions
  const handleOpenSettings = () => {
    // Placeholder for settings functionality
    toast.info('Impostazioni non ancora implementate');
  };

  // Info modal functions
  const handleOpenProjectInfo = () => {
    setInfoModal({ type: 'project', isOpen: true });
  };

  const handleOpenMethodologyInfo = () => {
    setInfoModal({ type: 'methodology', isOpen: true });
  };

  const handleCloseInfoModal = () => {
    setInfoModal({ type: null, isOpen: false });
  };

  // Project actions
  const handleSubmitCreateProject = () => {
    const { newProject } = state.ui.home || { newProject: { title: '', description: '', methodologyId: '' } };

    if (!newProject.title.trim()) {
      toast.error('Il titolo del progetto è obbligatorio');
      return;
    }

    setIsCreatingProject(true);

    // Create project immediately without delay
    const project: Project = {
      id: generateId(),
      title: newProject.title.trim(),
      description: newProject.description?.trim(),
      methodologyId: newProject.methodologyId || state.methodologies.find(m => m.isDefault)?.id || '',
      pages: [],
      mergedText: '',
      aiResults: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Update state and navigate immediately
    updateState(prev => {
      const newState = {
        ...prev,
        projects: [project, ...prev.projects],
        ui: {
          ...prev.ui,
          home: {
            ...prev.ui.home,
            newProject: { title: '', description: '', methodologyId: project.methodologyId }
          }
        }
      };

      console.log('Project created:', project);
      console.log('Updated state projects:', newState.projects.length);

      // Force immediate save to sessionStorage
      sessionStorage.setItem('jiraiya:state', JSON.stringify(newState));
      console.log('Forced save to sessionStorage:', newState.projects.length, 'projects');

      // Navigate after state update
      setTimeout(() => {
        setIsCreatingProject(false);
        setIsNewProjectModalOpen(false);
        toast.success(`Progetto "${project.title}" creato con successo!`);
        console.log('Navigating to workspace:', `/app/workspace/${project.id}`);
        navigate(`/app/workspace/${project.id}`);
      }, 100);

      return newState;
    });
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/app/workspace/${projectId}`);
  };

  const handleRenameProject = (projectId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;

    const newName = prompt('Nuovo nome del progetto:', project.title);
    if (newName && newName.trim() && newName !== project.title) {
      updateState(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === projectId
            ? { ...p, title: newName.trim(), updatedAt: Date.now() }
            : p
        )
      }));
      toast.success('Progetto rinominato');
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;

    const includeAnalysis = confirm('Vuoi includere l\'analisi AI nel progetto duplicato?');

    const duplicatedProject: Project = {
      ...project,
      id: generateId(),
      title: `${project.title} (copia)`,
      pages: [], // Reset pages
      mergedText: '',
      aiResults: includeAnalysis ? project.aiResults : null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    updateState(prev => ({
      ...prev,
      projects: [duplicatedProject, ...prev.projects]
    }));

    toast.success(`Progetto "${project.title}" duplicato`);
  };

  const handleDeleteProject = (projectId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;

    if (confirm(`Sei sicuro di voler eliminare il progetto "${project.title}"?`)) {
      updateState(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId)
      }));
      toast.success('Progetto eliminato');
    }
  };

  // Methodology actions
  const handleCreateProject = () => {
    setIsNewProjectModalOpen(true);
  };

  const handleCreateMethodology = () => {
    setMethodologyEditor({ mode: 'create', isOpen: true });
  };

  const handleEditMethodology = (methodology: Methodology) => {
    setMethodologyEditor({ mode: 'edit', methodology, isOpen: true });
  };

  const handleDuplicateMethodology = (methodology: Methodology) => {
    setMethodologyEditor({ mode: 'duplicate', methodology, isOpen: true });
  };

  const handleDeleteMethodology = (methodology: Methodology) => {
    if (methodology.isDefault) {
      toast.error('Non puoi eliminare la metodologia di sistema');
      return;
    }

    if (confirm(`Sei sicuro di voler eliminare la metodologia "${methodology.name}"?`)) {
      updateState(prev => ({
        ...prev,
        methodologies: prev.methodologies.filter(m => m.id !== methodology.id)
      }));
      toast.success('Metodologia eliminata');
    }
  };

  const handleSaveMethodology = (methodology: Methodology) => {
    updateState(prev => {
      const existingIndex = prev.methodologies.findIndex(m => m.id === methodology.id);

      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev.methodologies];
        updated[existingIndex] = methodology;
        return { ...prev, methodologies: updated };
      } else {
        // Add new
        return { ...prev, methodologies: [methodology, ...prev.methodologies] };
      }
    });

    setMethodologyEditor({ mode: 'create', isOpen: false });
    toast.success(`Metodologia "${methodology.name}" salvata`);
  };

  const handleExportMethodology = (methodology: Methodology) => {
    const exportData = {
      name: methodology.name,
      description: methodology.description,
      systemPrompt: methodology.systemPrompt,
      outputSchema: methodology.outputSchema,
      postProcessing: methodology.postProcessing
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${methodology.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(`Metodologia "${methodology.name}" esportata`);
  };

  const handleImportMethodology = () => {
    setJsonImportExport({ mode: 'import', isOpen: true });
  };

  const handleImportJson = (jsonData: string) => {
    try {
      const imported = JSON.parse(jsonData);

      // Validate required fields
      if (!imported.name || !imported.systemPrompt || !imported.outputSchema) {
        return { success: false, error: 'Campi obbligatori mancanti' };
      }

      // Check if name already exists
      const existingMethodology = state.methodologies.find(m => m.name === imported.name);
      if (existingMethodology) {
        const newName = prompt(
          `La metodologia "${imported.name}" esiste già. Inserisci un nuovo nome:`,
          `${imported.name} (importata)`
        );
        if (!newName) return { success: false, error: 'Importazione annullata' };
        imported.name = newName;
      }

      const newMethodology: Methodology = {
        id: generateId(),
        name: imported.name,
        description: imported.description || '',
        systemPrompt: imported.systemPrompt,
        outputSchema: imported.outputSchema,
        postProcessing: imported.postProcessing || {
          normalizeSpaces: true,
          mergeHyphenation: true
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      updateState(prev => ({
        ...prev,
        methodologies: [newMethodology, ...prev.methodologies]
      }));

      toast.success(`Metodologia "${newMethodology.name}" importata`);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'JSON non valido' };
    }
  };

  const handleResetSession = () => {
    if (confirm('Sei sicuro di voler resettare la sessione? Tutti i dati verranno persi.')) {
      resetSession();
      toast.success('Sessione resettata');
    }
  };

  const defaultMethodology = state.methodologies.find(m => m.isDefault);
  const newProject = state.ui.home?.newProject || {
    title: '',
    description: '',
    methodologyId: defaultMethodology?.id || ''
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Left - Brand */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-lg p-1.5">
                  <img src="/logo.png" alt="Jiraiya Sensei" className="w-6 h-6 object-cover" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-bold">Jiraiya Sensei</h1>
                  <p className="text-xs text-muted-foreground">(MVP)</p>
                </div>
              </Link>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-2">
              {/* AI Model Selector */}
              {state.selectedAiModel && (
                <AiModelSelector
                  selectedModelId={state.selectedAiModel}
                  onModelChange={(modelId) => updateState(prev => ({ ...prev, selectedAiModel: modelId }))}
                />
              )}

                          {/* Theme Toggle */}
            <Button
              variant="githubSecondary"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0"
              title="Cambia tema"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </Button>

            {/* Settings */}
            <Button
              variant="githubSecondary"
              size="sm"
              onClick={handleOpenSettings}
              className="h-8 w-8 p-0"
              title="Impostazioni"
            >
              <Settings className="h-4 w-4" />
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
          {/* Projects Section */}
          <div className="space-y-6">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Progetti</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenProjectInfo}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    title="Informazioni sui Progetti"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={handleCreateProject} variant="github" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Progetto
                </Button>
              </div>
            </div>

            <div className="container mx-auto px-4">
              {/* Data Persistence Warning */}
              <Alert className="mb-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Dati Temporanei:</strong> I progetti e le analisi vengono salvati solo nella sessione corrente del browser. 
                  Nella versione finale sarà integrato un sistema di salvataggio permanente per conservare il tuo lavoro.
                </AlertDescription>
              </Alert>

              <ProjectList
                projects={state.projects}
                methodologies={state.methodologies}
                onOpen={handleOpenProject}
                onRename={handleRenameProject}
                onDuplicate={handleDuplicateProject}
                onDelete={handleDeleteProject}
                onCreateNew={handleCreateProject}
              />
            </div>
          </div>

          {/* Methodologies Section */}
          <div className="space-y-6 mt-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Metodologie</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenMethodologyInfo}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    title="Informazioni sulle Metodologie"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleImportMethodology} variant="githubSecondary" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Importa
                  </Button>
                  <Button onClick={handleCreateMethodology} variant="github" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Metodologia
                  </Button>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4">
              <MethodologyList
                methodologies={state.methodologies}
                onEdit={handleEditMethodology}
                onDuplicate={handleDuplicateMethodology}
                onDelete={handleDeleteMethodology}
                onExport={handleExportMethodology}
                onCreateNew={handleCreateMethodology}
              />
            </div>
          </div>
      </main>

      {/* Modals */}
      <NewProjectModal
        methodologies={state.methodologies}
        newProject={newProject}
        onNewProjectChange={(project) =>
          updateState(prev => ({
            ...prev,
            ui: {
              ...prev.ui,
              home: {
                ...prev.ui.home,
                newProject: project
              }
            }
          }))
        }
        onCreateProject={handleSubmitCreateProject}
        onClose={() => setIsNewProjectModalOpen(false)}
        isOpen={isNewProjectModalOpen}
        isCreating={isCreatingProject}
      />

      <MethodologyEditor
        methodology={methodologyEditor.methodology}
        mode={methodologyEditor.mode}
        isOpen={methodologyEditor.isOpen}
        onSave={handleSaveMethodology}
        onCancel={() => setMethodologyEditor({ mode: 'create', isOpen: false })}
        onDelete={handleDeleteMethodology}
      />

      <JsonImportExport
        methodology={jsonImportExport.methodology}
        mode={jsonImportExport.mode}
        isOpen={jsonImportExport.isOpen}
        onImport={handleImportJson}
        onExport={handleExportMethodology}
        onClose={() => setJsonImportExport({ mode: 'import', isOpen: false })}
      />

      {/* Info Modal */}
      {infoModal.type && (
        <InfoModal
          type={infoModal.type}
          isOpen={infoModal.isOpen}
          onClose={handleCloseInfoModal}
        />
      )}
    </div>
  );
};

export default Home;
