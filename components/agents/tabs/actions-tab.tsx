import { Icons } from "@/components/icons"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SettingsCard } from "../cards/settings-card"
import { useState } from "react"
import type { Agent } from "@/types/agent"

interface ActionsTabProps {
  agent: Agent
  onSave: (data: Partial<Agent>) => Promise<void>
}

export function ActionsTab({ agent, onSave }: ActionsTabProps) {
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actions, setActions] = useState(agent.actions || [])

  return (
    <div className="mt-8 space-y-6">
      <SettingsCard
        title="Actions and Integrations"
        icon={<Icons.settings className="h-4 w-4" />}
      >
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-6">
            Configure actions that your agent can perform during conversations.
          </p>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icons.settings className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                <Select
                  value={selectedActionType || ""}
                  onValueChange={setSelectedActionType}
                >
                  <SelectTrigger className="pl-9">
                    <SelectValue placeholder="Choose Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Send Email</SelectItem>
                    <SelectItem value="calendar">Schedule Meeting</SelectItem>
                    <SelectItem value="crm">Update CRM</SelectItem>
                    <SelectItem value="webhook">Custom Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={() => {
                if (selectedActionType) {
                  setIsActionModalOpen(true)
                }
              }}
              disabled={!selectedActionType}
            >
              Add Action
            </Button>
          </div>

          {actions.length > 0 ? (
            <div className="mt-8 space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                Configured Actions
              </h3>
              {actions.map((action) => (
                <Card key={action.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {action.type === 'email' && <Icons.mail className="h-4 w-4 text-gray-500" />}
                      {action.type === 'calendar' && <Icons.calendar className="h-4 w-4 text-gray-500" />}
                      {action.type === 'crm' && <Icons.user className="h-4 w-4 text-gray-500" />}
                      {action.type === 'webhook' && <Icons.settings className="h-4 w-4 text-gray-500" />}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                          {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {action.type === 'email' && action.config.recipient}
                          {action.type === 'calendar' && 'Schedule meetings'}
                          {action.type === 'crm' && 'Update contact information'}
                          {action.type === 'webhook' && action.config.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedActionType(action.type)
                          setIsActionModalOpen(true)
                        }}
                      >
                        <Icons.settings className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setActions(actions.filter(a => a.id !== action.id))
                        }}
                      >
                        <Icons.trash className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center py-8 border-2 border-dashed rounded-lg">
              <Icons.settings className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No actions configured yet. Add an action to get started.
              </p>
            </div>
          )}
        </div>
      </SettingsCard>
    </div>
  )
} 