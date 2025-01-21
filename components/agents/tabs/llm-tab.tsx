import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Agent } from "@/types/agent"
import { SettingsCard } from "../cards/settings-card"
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
      <SettingsCard
        title="OpenAI Model"
        icon={<Icons.bot className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.bot className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <Select defaultValue={agent.modelId}>
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">
                  <div className="flex items-center gap-2">
                    <Icons.bot className="h-4 w-4" />
                    GPT-4o mini
                  </div>
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo">
                  <div className="flex items-center gap-2">
                    <Icons.bot className="h-4 w-4" />
                    GPT-3.5 Turbo
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            Select the AI model that will power your LinkRep.
          </p>
        </div>
      </SettingsCard>

      {/* Knowledge Base File */}
      <SettingsCard
        title="Choose Knowledge Base File"
        icon={<Icons.brain className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.brain className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <Select defaultValue={agent.brainFiles?.[0]}>
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select file" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file1">documentation.pdf</SelectItem>
                <SelectItem value="file2">knowledge-base.pdf</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            Link AI will use this file to search for specific content and search for answers. If you don't have a file yet, it is because you haven't published any files in the files section.
          </p>
        </div>
      </SettingsCard>

      {/* Max Tokens */}
      <SettingsCard
        title="Tokens generated on each LLM output"
        icon={<Icons.key className="h-4 w-4" />}
      >
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
            <p className="text-sm text-gray-500">
              Maximum tokens per response:
              <span className="ml-1 font-semibold text-gray-900 dark:text-gray-50">
                {maxTokens} tokens
              </span>
            </p>
          </div>
          <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-500">
            The maximum number of tokens that can be generated in a single response.
          </p>
        </div>
      </SettingsCard>

      {/* Temperature */}
      <SettingsCard
        title="Temperature"
        icon={<Icons.settings className="h-4 w-4" />}
      >
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
            <p className="text-sm text-gray-500">
              Creativity level:
              <span className="ml-1 font-semibold text-gray-900 dark:text-gray-50">
                {temperature.toFixed(1)}
              </span>
            </p>
          </div>
          <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-500">
            Increasing temperature enables heightened creativity, but increases chance of deviation from prompt.
          </p>
        </div>
      </SettingsCard>
    </div>
  )
} 