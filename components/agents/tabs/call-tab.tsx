import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import type { Agent } from "@/types/agent"
import { Phone, Clock, MessageSquare } from "lucide-react"
import { useState } from "react"

interface CallTabProps {
  agent: Agent
  onSave: (data: Partial<Agent>) => Promise<void>
}

export function CallTab({ agent, onSave }: CallTabProps) {
  const [checkUserPresence, setCheckUserPresence] = useState(agent.checkUserPresence || false)
  const [presenceMessageDelay, setPresenceMessageDelay] = useState(agent.presenceMessageDelay || 3)
  const [silenceTimeout, setSilenceTimeout] = useState(agent.silenceTimeout || 10)
  const [callTimeout, setCallTimeout] = useState(agent.callTimeout || 300)

  return (
    <div className="mt-8 space-y-6">
      {/* Phone Number */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Phone Number</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 z-10" />
              <Select defaultValue={agent.phoneNumber}>
                <SelectTrigger className="pl-9 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Select phone number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1234567890">+1 (234) 567-890</SelectItem>
                  <SelectItem value="+1987654321">+1 (987) 654-321</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can buy new phone numbers
              </p>
              <a href="/dashboard/phone-numbers" className="text-sm text-primary hover:underline">
                here
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Voice Selection */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Voice</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 z-10" />
              <Select defaultValue={agent.voice}>
                <SelectTrigger className="pl-9 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloy">Alloy</SelectItem>
                  <SelectItem value="echo">Echo</SelectItem>
                  <SelectItem value="fable">Fable</SelectItem>
                  <SelectItem value="onyx">Onyx</SelectItem>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="shimmer">Shimmer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
              Select the voice that will be used for the call.
            </p>
          </div>
        </div>
      </Card>

      {/* Check User Presence */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Check User Presence</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Enable User Presence Check</p>
              <p className="text-sm/6 text-gray-500 dark:text-gray-400">
                Ask if user is still there after silence
              </p>
            </div>
            <Switch
              checked={checkUserPresence}
              onCheckedChange={setCheckUserPresence}
            />
          </div>
          {checkUserPresence && (
            <div className="mt-6">
              <div className="space-y-4">
                <Slider
                  defaultValue={[presenceMessageDelay]}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={(value) => setPresenceMessageDelay(value[0])}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current delay:
                  <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                    {presenceMessageDelay} seconds
                  </span>
                </p>
              </div>
              <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-400">
                Seconds to wait in silence before asking.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Silence Timeout */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Silence Timeout</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <div className="space-y-4">
              <Slider
                defaultValue={[silenceTimeout]}
                max={30}
                min={3}
                step={1}
                onValueChange={(value) => setSilenceTimeout(value[0])}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current timeout:
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                  {silenceTimeout} seconds
                </span>
              </p>
            </div>
            <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-400">
              This will hang up the call after this many seconds of silence.
            </p>
          </div>
        </div>
      </Card>

      {/* Call Timeout */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Call Termination</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex-1">
            <div className="space-y-4">
              <Slider
                defaultValue={[callTimeout]}
                max={900}
                min={30}
                step={30}
                onValueChange={(value) => setCallTimeout(value[0])}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current timeout:
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                  {callTimeout} seconds
                </span>
              </p>
            </div>
            <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-400">
              The call will hang up after this many seconds of call time.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
} 