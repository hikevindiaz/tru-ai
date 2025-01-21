import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import type { Agent } from "@/types/agent"
import { SettingsCard } from "../cards/settings-card"
import { useState } from "react"
import { Clock } from "lucide-react"

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
      <SettingsCard
        title="Phone Number"
        icon={<Icons.phone className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <Select defaultValue={agent.phoneNumber}>
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select phone number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+1234567890">+1 (234) 567-890</SelectItem>
                <SelectItem value="+1987654321">+1 (987) 654-321</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <p className="text-sm text-gray-500">
              You can buy new phone numbers
            </p>
            <a href="/dashboard/phone-numbers" className="text-sm text-primary hover:underline">
              here
            </a>
          </div>
        </div>
      </SettingsCard>

      {/* Voice Selection */}
      <SettingsCard
        title="Voice"
        icon={<Icons.speech className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.speech className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <Select defaultValue={agent.voice}>
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rachel">Rachel (Female)</SelectItem>
                <SelectItem value="josh">Josh (Male)</SelectItem>
                <SelectItem value="emily">Emily (Female)</SelectItem>
                <SelectItem value="mike">Mike (Male)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            This is the voice that your LinkRep will have.
          </p>
        </div>
      </SettingsCard>

      {/* Response Rate */}
      <SettingsCard
        title="Response Rate"
        icon={<Icons.settings className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="relative">
            <Icons.settings className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <Select defaultValue={agent.responseRate}>
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select response rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rapid">Rapid</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            LinkRep will balance low latency and patient responses, may interrupt in long pauses.
          </p>
        </div>
      </SettingsCard>

      {/* User Presence Check */}
      <SettingsCard
        title="Check if User is Still There"
        icon={<Icons.user className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Switch
              checked={checkUserPresence}
              onCheckedChange={setCheckUserPresence}
            />
            <span className="font-normal">
              Enable user presence check
            </span>
          </div>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
            Agent will check if the user is online if there's no reply from the user
          </p>
        </div>
      </SettingsCard>

      {/* Conditional fields when presence check is enabled */}
      {checkUserPresence && (
        <>
          <SettingsCard
            title="Message to Customer"
            icon={<Icons.message className="h-4 w-4" />}
          >
            <div className="flex-1">
              <div className="relative">
                <Icons.message className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  defaultValue={agent.presenceMessage}
                  placeholder="Are you still there?"
                  className="pl-9"
                />
              </div>
              <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
                This is the message the LinkRep will tell the customer to verify if it's still online.
              </p>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Invoke message after (seconds)"
            icon={<Icons.clock className="h-4 w-4" />}
          >
            <div className="flex-1">
              <div className="space-y-4">
                <Slider
                  defaultValue={[presenceMessageDelay]}
                  max={6}
                  min={1}
                  step={1}
                  onValueChange={(value) => setPresenceMessageDelay(value[0])}
                />
                <p className="text-sm text-gray-500">
                  Current delay:
                  <span className="ml-1 font-semibold text-gray-900 dark:text-gray-50">
                    {presenceMessageDelay} seconds
                  </span>
                </p>
              </div>
              <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-500">
                Seconds to wait in silence before asking.
              </p>
            </div>
          </SettingsCard>
        </>
      )}

      {/* Silence Timeout */}
      <SettingsCard
        title="Hang Up After Silence of"
        icon={<Clock className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="space-y-4">
            <Slider
              defaultValue={[silenceTimeout]}
              max={30}
              min={3}
              step={1}
              onValueChange={(value) => setSilenceTimeout(value[0])}
            />
            <p className="text-sm text-gray-500">
              Current timeout:
              <span className="ml-1 font-semibold text-gray-900 dark:text-gray-50">
                {silenceTimeout} seconds
              </span>
            </p>
          </div>
          <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-500">
            This will hang up the call after this many seconds of silence.
          </p>
        </div>
      </SettingsCard>

      {/* Call Timeout */}
      <SettingsCard
        title="Call Termination"
        icon={<Clock className="h-4 w-4" />}
      >
        <div className="flex-1">
          <div className="space-y-4">
            <Slider
              defaultValue={[callTimeout]}
              max={900}
              min={30}
              step={30}
              onValueChange={(value) => setCallTimeout(value[0])}
            />
            <p className="text-sm text-gray-500">
              Current timeout:
              <span className="ml-1 font-semibold text-gray-900 dark:text-gray-50">
                {callTimeout} seconds
              </span>
            </p>
          </div>
          <p className="mt-4 text-sm/6 text-gray-500 dark:text-gray-500">
            The call will hang up after this many seconds of call time.
          </p>
        </div>
      </SettingsCard>
    </div>
  )
} 