import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Agent } from "@/types/agent";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentSchema, type AgentFormValues } from "@/lib/validations/agent";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AgentTabProps {
  agent: Agent;
  onSave: (data: Partial<Agent>) => Promise<void>;
  form: ReturnType<typeof useForm<AgentFormValues>>;
}

export function AgentTab({ agent, onSave, form }: AgentTabProps) {
  const languageOptions = [
    { value: "en", label: "English", emoji: "🇬🇧" },
    { value: "es", label: "Spanish", emoji: "🇪🇸" },
    { value: "fr", label: "French", emoji: "🇫🇷" },
    { value: "de", label: "German", emoji: "🇩🇪" },
    { value: "it", label: "Italian", emoji: "🇮🇹" },
    { value: "pt", label: "Portuguese", emoji: "🇵🇹" },
    { value: "nl", label: "Dutch", emoji: "🇳🇱" },
    { value: "ru", label: "Russian", emoji: "🇷🇺" },
    { value: "ja", label: "Japanese", emoji: "🇯🇵" },
    { value: "zh", label: "Chinese", emoji: "🇨🇳" },
    { value: "ar", label: "Arabic", emoji: "🇸🇦" },
    { value: "hi", label: "Hindi", emoji: "🇮🇳" },
  ];

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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder="Enter agent name"
                    className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-900"
                  />
                </FormControl>
                <FormMessage />
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
                  The name that will identify your agent.
                </p>
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="welcomeMessage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder="Hello, how can I help you today?"
                    className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-900"
                  />
                </FormControl>
                <FormMessage />
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
                  The welcome message that will be sent to the user when they start a conversation.
                </p>
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    {...field}
                    className="min-h-[100px] resize-y bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-900"
                  />
                </FormControl>
                <FormMessage />
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
                  This gives purpose and identity to your agent.
                </p>
              </FormItem>
            )}
          />
        </div>
      </Card>

      {/* Primary Language */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Icons.speech className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-50">Primary Language</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="mt-2 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-900">
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
                </FormControl>
                <FormMessage />
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
                  The primary language your agent will use to communicate.
                </p>
              </FormItem>
            )}
          />
        </div>
      </Card>

      {/* Secondary Language */}
      <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Icons.speech className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Label className="font-medium text-gray-900 dark:text-gray-50">Secondary Language</Label>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900/50">
          <FormField
            control={form.control}
            name="secondLanguage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="mt-2 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-900">
                      <SelectValue placeholder="Select secondary language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="flex items-center gap-2.5">
                          None
                        </span>
                      </SelectItem>
                      {languageOptions
                        .filter(lang => lang.value !== form.getValues().language)
                        .map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            <span className="flex items-center gap-2.5">
                              <span className="text-lg">{item.emoji}</span>
                              {item.label}
                            </span>
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
                  Optional secondary language your agent can understand and respond in.
                </p>
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="errorMessage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder="I apologize, but I'm having trouble understanding. Could you please rephrase that?"
                    className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-900"
                  />
                </FormControl>
                <FormMessage />
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
                  Message displayed when your agent encounters an error or cannot understand the user.
                </p>
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  );
} 