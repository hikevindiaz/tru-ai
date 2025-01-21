import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Agent } from "@/types/agent"
import { SettingsCard } from "../cards/settings-card"

interface AgentTabProps {
  agent: Agent
  onSave: (data: Partial<Agent>) => Promise<void>
}

export function AgentTab({ agent, onSave }: AgentTabProps) {
  return (
    <div className="mt-8 space-y-6">
      {/* Display Name */}
      <SettingsCard
        title="Display Name"
        icon={<Icons.user className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.user className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              id="name" 
              defaultValue={agent.name}
              placeholder="Enter agent name"
              className="pl-9"
            />
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            The name that will identify your agent.
          </p>
        </div>
      </SettingsCard>

      {/* Welcome Message */}
      <SettingsCard
        title="Welcome Message"
        icon={<Icons.message className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.message className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              id="welcome"
              defaultValue={agent.welcomeMessage}
              placeholder="Hello, how can I help you today?"
              className="pl-9"
            />
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            The welcome message that will be sent to the user when they start a conversation.
          </p>
        </div>
      </SettingsCard>

      {/* Default Prompt */}
      <SettingsCard
        title="Default Prompt"
        icon={<Icons.post className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.post className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Textarea 
              id="prompt"
              defaultValue={agent.prompt}
              className="min-h-[100px] resize-y pl-9"
            />
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            This gives purpose and identity to your LinkRep.
          </p>
        </div>
      </SettingsCard>

      {/* Language */}
      <SettingsCard
        title="Language"
        icon={<Icons.speech className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.speech className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <Select defaultValue={agent.language}>
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            The primary language your LinkRep will use to communicate.
          </p>
        </div>
      </SettingsCard>

      {/* Error Message */}
      <SettingsCard
        title="Error Message"
        icon={<Icons.warning className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.warning className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              id="error"
              defaultValue={agent.errorMessage}
              placeholder="I apologize, but I'm having trouble understanding. Could you please rephrase that?"
              className="pl-9"
            />
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            Message displayed when your LinkRep encounters an error or cannot understand the user.
          </p>
        </div>
      </SettingsCard>
    </div>
  )
} 