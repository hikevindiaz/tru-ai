import { Icons } from "@/components/icons"
import { Switch } from "@/components/ui/switch"
import { SettingsCard } from "../cards/settings-card"
import { useState } from "react"

interface Channel {
  id: string
  name: string
  description: string
  icon: keyof typeof Icons
  enabled: boolean
}

export function ChannelsTab() {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "widget",
      name: "Website Widget",
      description: "Embed a chat widget on your website",
      icon: "message",
      enabled: false
    },
    {
      id: "voice",
      name: "Voice Calling",
      description: "Enable voice conversations with your customers",
      icon: "phone",
      enabled: false
    },
    {
      id: "sms",
      name: "SMS",
      description: "Send and receive text messages",
      icon: "message",
      enabled: false
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Connect through WhatsApp messaging",
      icon: "message",
      enabled: false
    },
    {
      id: "facebook",
      name: "Facebook Messenger",
      description: "Integrate with Facebook Messenger",
      icon: "facebook",
      enabled: false
    },
    {
      id: "instagram",
      name: "Instagram DM",
      description: "Connect through Instagram Direct Messages",
      icon: "instagram",
      enabled: false
    }
  ])

  const toggleChannel = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ))
  }

  return (
    <div className="mt-8 space-y-6">
      <SettingsCard
        title="Communication Channels"
        icon={<Icons.settings className="h-4 w-4" />}
      >
        <div className="space-y-6">
          {channels.map((channel) => {
            const ChannelIcon = Icons[channel.icon]
            return (
              <div 
                key={channel.id}
                className="flex items-start justify-between"
              >
                <div className="flex items-start gap-3">
                  <ChannelIcon className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{channel.name}</p>
                    <p className="text-sm text-gray-500">
                      {channel.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {channel.enabled && (
                    <button
                      onClick={() => {/* Open configuration modal */}}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icons.settings className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                  <Switch
                    checked={channel.enabled}
                    onCheckedChange={() => toggleChannel(channel.id)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </SettingsCard>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          Enable the channels you want to use for communication. Each channel can be configured after enabling.
        </p>
      </div>
    </div>
  )
} 