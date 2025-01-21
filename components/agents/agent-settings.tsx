"use client"

import { useState } from "react"
import { toast } from "sonner"
import { RiMoreFill, RiMessage2Line, RiUserLine, RiErrorWarningLine, RiDeleteBinLine, RiUser3Line, RiFileTextLine, RiTranslate2, RiRobot2Line, RiCodeLine } from "@remixicon/react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AgentTab } from "@/components/agents/tabs/agent-tab"
import { ChannelsTab } from "@/components/agents/tabs/channels-tab"
import { LLMTab } from "@/components/agents/tabs/llm-tab"
import { AddonConfigModal } from "@/components/agents/modals/addon-config-modal"
import { AgentHeader } from "@/components/agents/agent-header"
import { CallTab } from "@/components/agents/tabs/call-tab"
import { ActionsTab } from "@/components/agents/tabs/actions-tab"
import { WidgetTab } from "@/components/agents/tabs/widget-tab"
import { AddonsTab } from "@/components/agents/tabs/addons-tab"

interface Action {
  id: string
  type: string
  config: Record<string, any>
}

interface Agent {
  id: string
  name: string
  status: 'draft' | 'live'
  welcomeMessage: string
  prompt: string
  errorMessage: string
  language: string
  modelId: string
  brainFiles: string[]
  maxTokens: number
  temperature: number
  phoneNumber: string
  voice: string
  responseRate: 'rapid' | 'normal' | 'patient'
  checkUserPresence: boolean
  presenceMessage: string
  presenceMessageDelay: number
  silenceTimeout: number
  hangUpMessage: string
  callTimeout: number
  actions: Action[]
}

interface AgentSettingsProps {
  agent: Agent
  onSave: (data: Partial<Agent>) => Promise<void>
}

// Add the schema
const inquiryCustomizationSchema = z.object({
  inquiryEnabled: z.boolean(),
  inquiryLinkText: z.string().optional(),
  inquiryTitle: z.string().optional(),
  inquirySubtitle: z.string().optional(),
  inquiryEmailLabel: z.string().optional(),
  inquiryMessageLabel: z.string().optional(),
  inquirySendButtonText: z.string().optional(),
  inquiryAutomaticReplyText: z.string().optional(),
  inquiryDisplayLinkAfterXMessage: z.number().min(1).max(5).optional(),
})

export function AgentSettings({ agent, onSave }: AgentSettingsProps) {
  const [activeTab, setActiveTab] = useState("linkRep")
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleSaveConfig = (config: any) => {
    setIsModalOpen(false)
  }

  const handleChatClick = () => {
    window.location.href = `/chat/${agent.id}`;
  };

  const handleDeleteClick = () => {
    // Implement delete functionality if needed
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full max-w-full">
        <div className="flex-none p-8 pb-0 bg-white dark:bg-gray-950">
          <AgentHeader 
            agent={agent}
            onChatClick={handleChatClick}
            onDeleteClick={handleDeleteClick}
            showActions={true}
          />
        </div>

        <div className="flex-1 overflow-auto p-8 pt-6">
          <div className="max-w-[1200px] mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="linkRep">Agent</TabsTrigger>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="llm">LLM</TabsTrigger>
                <TabsTrigger value="call">Call</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="widget">Widget</TabsTrigger>
                <TabsTrigger value="addons">Add-Ons</TabsTrigger>
              </TabsList>

              <TabsContent value="linkRep">
                <AgentTab agent={agent} onSave={onSave} />
              </TabsContent>

              <TabsContent value="channels">
                <ChannelsTab />
              </TabsContent>

              <TabsContent value="llm">
                <LLMTab agent={agent} onSave={onSave} />
              </TabsContent>

              <TabsContent value="call">
                <CallTab agent={agent} onSave={onSave} />
              </TabsContent>

              <TabsContent value="actions">
                <ActionsTab agent={agent} onSave={onSave} />
              </TabsContent>

              <TabsContent value="widget">
                <WidgetTab agent={agent} onSave={onSave} />
              </TabsContent>

              <TabsContent value="addons">
                <AddonsTab 
                  agent={agent} 
                  onSave={onSave} 
                  onConfigureAddon={(addonId) => {
                    setIsModalOpen(true)
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AddonConfigModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveConfig}
      />
    </TooltipProvider>
  )
} 