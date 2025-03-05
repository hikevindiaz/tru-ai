import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Agent } from "@/types/agent"
import { Bot, Brain, Key, Settings, Codepen } from "lucide-react"
import { useState } from "react"

interface LLMTabProps {
  agent: Agent
  onSave: (data: Partial<Agent>) => Promise<void>
}

export function LLMTab({ agent, onSave }: LLMTabProps) {
  const [maxTokens, setMaxTokens] = useState(agent.maxTokens || 1000)
  const [temperature, setTemperature] = useState(agent.temperature || 0.7)

  return (
    <div className="mt-8 space-y-6">
      {/* OpenAI Model Selection */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Codepen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">OpenAI Model</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <div className="relative">
              <Codepen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 z-10" />
              <Select defaultValue={agent.modelId}>
                <SelectTrigger className="pl-9 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">
                    <div className="flex items-center gap-2">
                      <Codepen className="h-4 w-4" />
                      GPT-4o mini
                    </div>
                  </SelectItem>
                  <SelectItem value="gpt-3.5-turbo">
                    <div className="flex items-center gap-2">
                      <Codepen className="h-4 w-4" />
                      GPT-3.5 Turbo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
              Select the AI model that will power your LinkRep.
            </p>
          </div>
        </div>
      </Card>

      {/* Knowledge Base File */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Knowledge Base File</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <div className="relative">
              <Brain className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 z-10" />
              <Select defaultValue={agent.brainFiles?.[0]}>
                <SelectTrigger className="pl-9 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Select file" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file1">documentation.pdf</SelectItem>
                  <SelectItem value="file2">knowledge-base.pdf</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
              Link AI will use this file to search for specific content and search for answers.
            </p>
          </div>
        </div>
      </Card>

      {/* Max Tokens */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Max Tokens</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <div className="space-y-4">
              <Slider
                id="max-tokens"
                defaultValue={[maxTokens]}
                max={4000}
                min={1}
                step={1}
                onValueChange={(value) => setMaxTokens(value[0])}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Maximum tokens per response:
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                  {maxTokens} tokens
                </span>
              </p>
            </div>
            <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-400">
              The maximum number of tokens that can be generated in a single response.
            </p>
          </div>
        </div>
      </Card>

      {/* Temperature */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Temperature</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <div className="space-y-4">
              <Slider
                id="temperature"
                defaultValue={[temperature]}
                max={1.0}
                min={0}
                step={0.1}
                onValueChange={(value) => setTemperature(Number(value[0].toFixed(1)))}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Creativity level:
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                  {temperature.toFixed(1)}
                </span>
              </p>
            </div>
            <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-400">
              Increasing temperature enables heightened creativity, but increases chance of deviation from prompt.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}