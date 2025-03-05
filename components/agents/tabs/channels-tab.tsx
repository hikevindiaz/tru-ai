import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Globe, 
  MessageSquare, 
  Phone, 
  MessagesSquare 
} from "lucide-react"

export function ChannelsTab() {
  return (
    <div className="mt-8 space-y-6">
      {/* Website */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Website</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Enable Website Chat</p>
              <p className="text-sm/6 text-gray-500 dark:text-gray-400">
                Add a chat widget to your website
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* WhatsApp */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">WhatsApp</Label>
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Coming Soon
            </span>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Enable WhatsApp</p>
              <p className="text-sm/6 text-gray-500 dark:text-gray-400">
                Connect your WhatsApp Business account
              </p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </Card>

      {/* SMS */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">SMS</Label>
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Coming Soon
            </span>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Enable SMS</p>
              <p className="text-sm/6 text-gray-500 dark:text-gray-400">
                Connect a phone number for SMS
              </p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </Card>

      {/* Facebook Messenger */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-100">Facebook Messenger</Label>
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Coming Soon
            </span>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Enable Messenger</p>
              <p className="text-sm/6 text-gray-500 dark:text-gray-400">
                Connect your Facebook page
              </p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </Card>
    </div>
  )
} 