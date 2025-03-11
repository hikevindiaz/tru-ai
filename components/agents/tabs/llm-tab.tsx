import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent } from "@/types/agent";
import { Bot, Brain, Key, Settings, Codepen, Database, RefreshCcw } from "lucide-react";
import { FloatingActionCard } from "@/components/agents/floating-action-card";
import { Icons } from "@/components/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatbotModel {
  id: string;
  name: string;
}

interface KnowledgeSource {
  id: string;
  name: string;
  description?: string;
  type?: string;
}

interface LLMTabProps {
  agent: Agent;
  onSave: (data: Partial<Agent>) => Promise<any>;
}

// List of additional models to show as disabled
const DISABLED_MODELS = [
  "gpt-4o-2024-05-13",
  "gpt-4-turbo-2024-04-09",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "llama-3-70b-instruct",
  "mistral-large-2",
  "gemini-1.5-pro-latest"
];

// Default token values
const DEFAULT_PROMPT_TOKENS = 1200;
const DEFAULT_COMPLETION_TOKENS = 1200;

// Add a new interface for training options
interface TrainingOptions {
  forceRetrain: boolean;
  optimizeForSpeed: boolean;
}

// Update the TrainingStatus interface
interface TrainingStatus {
  status: 'idle' | 'training' | 'success' | 'error';
  lastTrainedAt?: Date | null;
  message?: string;
  progress?: number; // Progress percentage (0-100)
}

export function LLMTab({ agent, onSave }: LLMTabProps) {
  const [modelId, setModelId] = useState(agent.modelId || "");
  const [models, setModels] = useState<ChatbotModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [temperature, setTemperature] = useState(agent.temperature || 0.7);
  const [maxPromptTokens, setMaxPromptTokens] = useState(agent.maxPromptTokens || 1200);
  const [maxCompletionTokens, setMaxCompletionTokens] = useState(agent.maxCompletionTokens || 1200);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);
  const [selectedKnowledgeSources, setSelectedKnowledgeSources] = useState<string[]>([]);
  const [isLoadingKnowledgeSources, setIsLoadingKnowledgeSources] = useState(true);
  const [showTrainingOptions, setShowTrainingOptions] = useState(false);
  const [trainingOptions, setTrainingOptions] = useState<TrainingOptions>({
    forceRetrain: false,
    optimizeForSpeed: true,
  });
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    status: agent.trainingStatus || 'idle',
    lastTrainedAt: agent.lastTrainedAt ? new Date(agent.lastTrainedAt) : null,
    message: agent.trainingMessage || '',
    progress: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [saveResponse, setSaveResponse] = useState<any>(null);

  useEffect(() => {
    fetchModels();
    fetchKnowledgeSources();
    
    // Update training status from agent data
    if (agent.trainingStatus) {
      setTrainingStatus({
        status: agent.trainingStatus,
        lastTrainedAt: agent.lastTrainedAt ? new Date(agent.lastTrainedAt) : null,
        message: agent.trainingMessage || '',
        progress: 0,
      });
    }
    
    // Update selected knowledge sources if agent has them
    if (agent.knowledgeSources && agent.knowledgeSources.length > 0) {
      setSelectedKnowledgeSources(agent.knowledgeSources.map((ks: any) => ks.id));
    }
  }, [agent]);

  const fetchModels = async () => {
    try {
      setIsLoadingModels(true);
      const response = await fetch('/api/models');
      if (!response.ok) throw new Error('Failed to fetch models');
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load models');
    } finally {
      setIsLoadingModels(false);
    }
  };

  const fetchKnowledgeSources = async () => {
    try {
      setIsLoadingKnowledgeSources(true);
      const response = await fetch('/api/knowledge-sources');
      if (!response.ok) throw new Error('Failed to fetch knowledge sources');
      const data = await response.json();
      setKnowledgeSources(data);
      
      // Check if agent already has knowledge sources
      if (agent.knowledgeSources && agent.knowledgeSources.length > 0) {
        const knowledgeSourceIds = agent.knowledgeSources.map((ks: any) => ks.id);
        setSelectedKnowledgeSources(knowledgeSourceIds);
      }
    } catch (error) {
      console.error('Error fetching knowledge sources:', error);
      toast.error('Failed to load knowledge sources');
    } finally {
      setIsLoadingKnowledgeSources(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setSaveResponse(null);
    
    try {
      // Fix the knowledgeSources format to match the expected type
      const updatedData: Partial<Agent> = {
        modelId,
        temperature,
        maxPromptTokens,
        maxCompletionTokens,
        // Use the existing knowledge sources but only update the IDs
        knowledgeSources: selectedKnowledgeSources.map(id => {
          // Find the full knowledge source object if available
          const source = knowledgeSources.find(ks => ks.id === id);
          if (source) {
            return {
              id: source.id,
              name: source.name,
              description: source.description
            };
          }
          // Fallback if not found (shouldn't happen in normal operation)
          return {
            id,
            name: "Unknown Source",
            description: ""
          };
        }),
      };
      
      const result = await onSave(updatedData);
      setSaveResponse(result);
      setSaveStatus('success');
      setIsDirty(false);
      toast.success('LLM settings saved successfully');
    } catch (error) {
      console.error('Error saving LLM settings:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save LLM settings');
      toast.error('Failed to save LLM settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTrainAgent = async () => {
    try {
      // Update training status to training
      setTrainingStatus({
        status: 'training',
        lastTrainedAt: trainingStatus.lastTrainedAt,
        message: 'Starting training process...',
        progress: 0,
      });
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setTrainingStatus(prev => ({
          ...prev,
          progress: Math.min((prev.progress || 0) + 5, 95),
          message: (prev.progress || 0) < 30 
            ? 'Processing knowledge sources...' 
            : (prev.progress || 0) < 60 
              ? 'Training assistant...' 
              : 'Finalizing training...',
        }));
      }, 1000);
      
      // Make the actual API call
      const response = await fetch(`/api/chatbots/${agent.id}/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingOptions),
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Training failed');
      }
      
      const data = await response.json();
      
      // Update training status based on response
      setTrainingStatus({
        status: 'success',
        lastTrainedAt: new Date(),
        message: data.message || 'Training completed successfully',
        progress: 100,
      });
      
      // Update agent with new training status
      await onSave({
        trainingStatus: 'success',
        lastTrainedAt: new Date().toISOString(),
        trainingMessage: data.message || 'Training completed successfully',
        openaiId: data.assistantId || agent.openaiId,
      });
      
      toast.success('Agent trained successfully');
    } catch (error) {
      console.error('Error training agent:', error);
      
      setTrainingStatus({
        status: 'error',
        lastTrainedAt: trainingStatus.lastTrainedAt,
        message: error instanceof Error ? error.message : 'Training failed',
        progress: 0,
      });
      
      // Update agent with error status
      await onSave({
        trainingStatus: 'error',
        trainingMessage: error instanceof Error ? error.message : 'Training failed',
      });
      
      toast.error(`Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const toggleTrainingOptions = () => {
    setShowTrainingOptions(!showTrainingOptions);
  };

  const updateTrainingOption = (option: keyof TrainingOptions, value: boolean) => {
    setTrainingOptions(prev => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleKnowledgeSourceToggle = (id: string) => {
    setSelectedKnowledgeSources(prev => 
      prev.includes(id) 
        ? prev.filter(sourceId => sourceId !== id) 
        : [...prev, id]
    );
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Settings</CardTitle>
          <CardDescription>
            Configure the language model that powers your agent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={modelId}
              onValueChange={(value) => {
                setModelId(value);
                setIsDirty(true);
              }}
              disabled={isLoadingModels}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModels ? (
                  <SelectItem value="loading" disabled>
                    Loading models...
                  </SelectItem>
                ) : models.length > 0 ? (
                  models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-models" disabled>
                    No models available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Select the OpenAI model to use for your agent.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature: {temperature}</Label>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(values) => {
                setTemperature(values[0]);
                setIsDirty(true);
              }}
            />
            <p className="text-sm text-gray-500">
              Controls randomness: Lower values are more focused, higher values more creative.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPromptTokens">Max Prompt Tokens: {maxPromptTokens}</Label>
            <Slider
              id="maxPromptTokens"
              min={100}
              max={4000}
              step={100}
              value={[maxPromptTokens]}
              onValueChange={(values) => {
                setMaxPromptTokens(values[0]);
                setIsDirty(true);
              }}
            />
            <p className="text-sm text-gray-500">
              Maximum number of tokens to use for the prompt.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxCompletionTokens">Max Completion Tokens: {maxCompletionTokens}</Label>
            <Slider
              id="maxCompletionTokens"
              min={100}
              max={4000}
              step={100}
              value={[maxCompletionTokens]}
              onValueChange={(values) => {
                setMaxCompletionTokens(values[0]);
                setIsDirty(true);
              }}
            />
            <p className="text-sm text-gray-500">
              Maximum number of tokens to generate in the response.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveSettings}
            variant="primary"
          >
            Save Settings
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Sources</CardTitle>
          <CardDescription>
            Select knowledge sources to train your agent with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingKnowledgeSources ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              <span className="ml-2 text-sm text-gray-500">Loading knowledge sources...</span>
            </div>
          ) : knowledgeSources.length > 0 ? (
            <div className="space-y-4">
              {knowledgeSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`knowledge-source-${source.id}`}
                      checked={selectedKnowledgeSources.includes(source.id)}
                      onCheckedChange={() => handleKnowledgeSourceToggle(source.id)}
                    />
                    <Label htmlFor={`knowledge-source-${source.id}`} className="cursor-pointer">
                      {source.name}
                    </Label>
                  </div>
                  <Badge>
                    {source.type || 'Mixed'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No knowledge sources available.</p>
              <Button
                variant="secondary"
                className="mt-2"
                onClick={() => window.location.href = '/dashboard/knowledge'}
              >
                Create Knowledge Source
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Collapsible
            open={showTrainingOptions}
            onOpenChange={setShowTrainingOptions}
            className="w-full"
          >
            <div className="flex justify-between items-center">
              <CollapsibleTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-1">
                  Advanced Training Options
                  {showTrainingOptions ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="force-retrain">Force Retrain</Label>
                  <p className="text-sm text-gray-500">
                    Ignore cached data and retrain from scratch
                  </p>
                </div>
                <Switch
                  id="force-retrain"
                  checked={trainingOptions.forceRetrain}
                  onCheckedChange={(checked) => updateTrainingOption('forceRetrain', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="optimize-speed">Optimize for Speed</Label>
                  <p className="text-sm text-gray-500">
                    Faster training but potentially less accurate
                  </p>
                </div>
                <Switch
                  id="optimize-speed"
                  checked={trainingOptions.optimizeForSpeed}
                  onCheckedChange={(checked) => updateTrainingOption('optimizeForSpeed', checked)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="w-full">
            {trainingStatus.status === 'training' && (
              <div className="mb-4 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Training in progress...</span>
                  <span className="text-sm text-gray-500">{trainingStatus.progress}%</span>
                </div>
                <Progress value={trainingStatus.progress} className="w-full" />
                <p className="mt-2 text-sm text-gray-500">{trainingStatus.message}</p>
              </div>
            )}

            {trainingStatus.status === 'success' && (
              <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-400">Training Successful</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-500">
                  {trainingStatus.message || 'Your agent has been successfully trained.'}
                  {trainingStatus.lastTrainedAt && (
                    <div className="mt-1 text-xs">
                      Last trained: {trainingStatus.lastTrainedAt.toLocaleString()}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {trainingStatus.status === 'error' && (
              <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-800 dark:text-red-400">Training Failed</AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-500">
                  {trainingStatus.message || 'There was an error training your agent. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            {trainingStatus.status === 'idle' && trainingStatus.lastTrainedAt && (
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Training Status</AlertTitle>
                <AlertDescription>
                  Last trained: {trainingStatus.lastTrainedAt.toLocaleString()}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between w-full">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                className="mr-2"
              >
                Save Settings
              </Button>
              <Button
                variant="secondary"
                onClick={handleTrainAgent}
                disabled={trainingStatus.status === 'training' || selectedKnowledgeSources.length === 0}
                className={cn(
                  "relative",
                  trainingStatus.status === 'training' && "opacity-80"
                )}
              >
                {trainingStatus.status === 'training' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  'Train Agent'
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Debug Information (only visible in development) */}
      {process.env.NODE_ENV === 'development' && saveResponse && (
        <Card className="overflow-hidden p-4 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
          <h3 className="font-medium mb-2">Save Response Debug Info:</h3>
          <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-900 rounded">
            {JSON.stringify(saveResponse, null, 2)}
          </pre>
        </Card>
      )}

      {/* Floating Action Card */}
      <FloatingActionCard 
        isSaving={isSaving}
        isDirty={isDirty}
        onSave={handleSaveSettings}
        onCancel={() => {
          setIsDirty(false);
          // Reset to original values
          setModelId(agent.modelId || "");
          setTemperature(agent.temperature || 0.7);
          setMaxPromptTokens(agent.maxPromptTokens || 1200);
          setMaxCompletionTokens(agent.maxCompletionTokens || 1200);
          if (agent.knowledgeSources && agent.knowledgeSources.length > 0) {
            setSelectedKnowledgeSources(agent.knowledgeSources.map((ks: any) => ks.id));
          } else {
            setSelectedKnowledgeSources([]);
          }
        }}
        saveStatus={saveStatus}
        errorMessage={errorMessage}
      />
    </div>
  );
}