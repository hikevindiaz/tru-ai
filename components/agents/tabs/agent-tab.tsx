import { RiExternalLinkLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/Divider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Agent } from "@/types/agent"
import { SettingsCard } from "../cards/settings-card"
import { focusInput } from "@/lib/utils"

interface AgentTabProps {
  agent: Agent
  onSave: (data: Partial<Agent>) => Promise<void>
}

export function AgentTab({ agent, onSave }: AgentTabProps) {
  const languageOptions = [
    {
      value: "en",
      label: "English",
      emoji: "🇬🇧",
    },
    {
      value: "es",
      label: "Spanish",
      emoji: "🇪🇸",
    },
    {
      value: "fr",
      label: "French",
      emoji: "🇫🇷",
    },
    {
      value: "de",
      label: "German",
      emoji: "🇩🇪",
    },
    {
      value: "it",
      label: "Italian",
      emoji: "🇮🇹",
    },
    {
      value: "pt",
      label: "Portuguese",
      emoji: "🇵🇹",
    },
  ]

  return (
    <div className="mt-8 space-y-6">
      {/* Display Name */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Icons.user className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-50">Display Name</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <Input 
              id="name" 
              defaultValue={agent.name}
              placeholder="Enter agent name"
              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-900"
            />
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
              The name that will identify your agent.
            </p>
          </div>
        </div>
      </Card>

      {/* Welcome Message */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Icons.message className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-50">Welcome Message</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <Input 
              id="welcome"
              defaultValue={agent.welcomeMessage}
              placeholder="Hello, how can I help you today?"
              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-900"
            />
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
              The welcome message that will be sent to the user when they start a conversation.
            </p>
          </div>
        </div>
      </Card>

      {/* Default Prompt */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Icons.post className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-50">Default Prompt</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <Textarea 
              id="prompt"
              defaultValue={agent.prompt}
              className="min-h-[100px] resize-y bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-900"
            />
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
              This gives purpose and identity to your LinkRep.
            </p>
          </div>
        </div>
      </Card>

      {/* Language - Updated Dropdown */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Icons.speech className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-50">Language</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <Select defaultValue={agent.language}>
              <SelectTrigger className={`mt-2 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-900 ${focusInput}`}>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <span className="flex items-center gap-2.5">
                      <span className="text-lg">{item.emoji}</span>
                      {item.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
              The primary language your LinkRep will use to communicate.
            </p>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Icons.warning className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-50">Error Message</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <Input 
              id="error"
              defaultValue={agent.errorMessage}
              placeholder="I apologize, but I'm having trouble understanding. Could you please rephrase that?"
              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-900"
            />
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
              Message displayed when your LinkRep encounters an error or cannot understand the user.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
} 