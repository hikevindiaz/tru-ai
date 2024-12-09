"use client"

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaComments, FaHistory, FaPhone } from 'react-icons/fa'
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Inquiries } from "@/components/inquiries"

interface Inquiry {
  id: number
  message: string
  date: string
}

interface ChatHistory {
  id: number
  message: string
  date: string
}

interface CallHistory {
  id: number
  duration: string
  date: string
}

interface Chatbot {
  id: string
  name: string
}

export default function InteractionsPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Inquiries')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [callHistory, setCallHistory] = useState<CallHistory[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchChatbots() {
      try {
        const response = await fetch('/api/chatbots')
        if (response.ok) {
          const data = await response.json()
          setChatbots(data)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching chatbots:', error)
      }
    }

    fetchChatbots()
  }, [router])

  useEffect(() => {
    if (selectedChatbot !== null) {
      async function fetchChatbotData() {
        try {
          const inquiriesResponse = await fetch(`/api/chatbots/${selectedChatbot}/inquiries`)
          if (inquiriesResponse.ok) {
            const inquiriesData = await inquiriesResponse.json()
            setInquiries(inquiriesData)
          } else {
            console.error('Failed to fetch inquiries')
            setInquiries([])
          }
        } catch (error) {
          console.error('Error fetching inquiries:', error)
        }
      }

      fetchChatbotData()
    }
  }, [selectedChatbot])

  const handleChatbotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (value) {
      setSelectedChatbot(value)
    } else {
      console.error('Invalid chatbotId selected')
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Interactions" text="Manage and review all interactions with your LinkReps.">
        <select
          id="chatbot"
          name="chatbot"
          onChange={handleChatbotChange}
          className="w-1/4 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-800 text-white"
        >
          <option value="">Select a LinkRep</option>
          {chatbots.map((chatbot) => (
            <option key={chatbot.id} value={chatbot.id}>
              {chatbot.name}
            </option>
          ))}
        </select>
      </DashboardHeader>
      <div className="p-4">
        <Tabs className="w-full overflow-x-auto max-w-full" defaultValue="Inquiries">
          <TabsList className="mb-10 grid grid-cols-3 gap-4">
            <TabsTrigger value="Inquiries" onClick={() => setActiveTab('Inquiries')}>
              <FaComments className="inline-block mr-2" /> Inquiries
            </TabsTrigger>
            <TabsTrigger value="Chat History" onClick={() => setActiveTab('Chat History')}>
              <FaHistory className="inline-block mr-2" /> Chat History
            </TabsTrigger>
            <TabsTrigger value="Call History" onClick={() => setActiveTab('Call History')}>
              <FaPhone className="inline-block mr-2" /> Call History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Inquiries">
            {inquiries.length > 0 ? (
              <Inquiries inquiries={inquiries} defaultLayout={[265, 440, 655]} />
            ) : (
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="post" />
                <EmptyPlaceholder.Title>No inquiries found</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  There are no inquiries for this chatbot.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            )}
          </TabsContent>
          <TabsContent value="Chat History">
            {chatHistory.length > 0 ? (
              <ul className="divide-y divide-gray-200 ml-4">
                {chatHistory.map((chat) => (
                  <li key={chat.id} className="py-4">
                    <div className="flex justify-between">
                      <p>{chat.message}</p>
                      <p className="text-sm text-gray-500">{chat.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="messagesSquare" />
                <EmptyPlaceholder.Title>No chat history found</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  There is no chat history for this chatbot.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            )}
          </TabsContent>
          <TabsContent value="Call History">
            {callHistory.length > 0 ? (
              <ul className="divide-y divide-gray-200 ml-4">
                {callHistory.map((call) => (
                  <li key={call.id} className="py-4">
                    <div className="flex justify-between">
                      <p>Duration: {call.duration}</p>
                      <p className="text-sm text-gray-500">{call.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="phone" />
                <EmptyPlaceholder.Title>No call history found</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  There is no call history for this chatbot.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}