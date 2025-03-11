import { notFound } from "next/navigation"
import { Chat, ClientSideChatbotProps } from "@/components/chat-sdk"
import { Chatbot } from "@prisma/client"
import { db } from "@/lib/db"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { getClientIP } from "@/lib/getIP"
import { Icons } from "@/components/icons"
import dynamic from 'next/dynamic'

// Import the Chat component with no SSR to avoid hydration mismatches
const ClientSideChat = dynamic(() => import('@/components/chat-sdk').then(mod => mod.Chat), { 
  ssr: false 
})

var ipRangeCheck = require("ip-range-check");


interface ChatbotSettingsProps {
    params: { chatbotId: string, defaultMessage: string, withExitX: boolean, clientSidePrompt: string }
}

async function getChatbotForUser(chatbotId: Chatbot["id"]) {
    return await db.chatbot.findFirst({
        where: {
            id: chatbotId,
        },
    })
}

export default async function ChatbotPage({ params }: ChatbotSettingsProps) {

    const chatbot = await getChatbotForUser(params.chatbotId)

    let accessDenied = false

    if (!chatbot) {
        notFound()
    }

    // validate ip restrictions
    const ip = getClientIP()
    if (!chatbot?.allowEveryone) {

        if (!ipRangeCheck(ip, chatbot?.allowedIpRanges || [])) {
            accessDenied = true
        }
    }

    // validate is ip is banned 
    if(ipRangeCheck(ip, chatbot.bannedIps)) {
        accessDenied = true
    }

    const plan = await getUserSubscriptionPlan(chatbot.userId)
    
    if (chatbot.displayBranding === false && plan?.brandingCustomization === false) {
        chatbot.displayBranding = true
    }

    if (chatbot.chatFileAttachementEnabled && plan?.chatFileAttachments === false) {
        chatbot.chatFileAttachementEnabled = false
    }

    if (chatbot.chatbotLogoURL !== '' && plan?.basicCustomization === false) {
        chatbot.chatbotLogoURL = null
    }

    if (accessDenied) {
        return (
            <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
              <Icons.lock className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-background sm:text-4xl">Access Denied</h1>
              <p className="mt-4 text-muted-foreground">
                You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an
                error.
              </p>
            </div>
          </div>
        )
    }
    
    // Create a minimal version of the chatbot object with only the properties needed
    const clientSideChatbot: any = {
        id: chatbot.id,
        name: chatbot.name,
        userId: chatbot.userId,
        openaiId: chatbot.openaiId || '',
        createdAt: chatbot.createdAt,
        welcomeMessage: chatbot.welcomeMessage || 'Hello! How can I help you today?',
        chatbotErrorMessage: chatbot.chatbotErrorMessage || "I'm sorry, I encountered an error. Please try again.",
        isImported: chatbot.isImported || false,
        chatTitle: chatbot.chatTitle || '',
        chatbotLogoURL: chatbot.chatbotLogoURL || '',
        chatMessagePlaceHolder: chatbot.chatMessagePlaceHolder || 'Type a message...',
        rightToLeftLanguage: chatbot.rightToLeftLanguage || false,
        bubbleColor: chatbot.bubbleColor || '#FFFFFF',
        bubbleTextColor: chatbot.bubbleTextColor || '#000000',
        chatHeaderBackgroundColor: chatbot.chatHeaderBackgroundColor || '#FFFFFF',
        chatHeaderTextColor: chatbot.chatHeaderTextColor || '#000000',
        chatbotReplyBackgroundColor: chatbot.chatbotReplyBackgroundColor || '#e4e4e7',
        chatbotReplyTextColor: chatbot.chatbotReplyTextColor || '#000000',
        userReplyBackgroundColor: chatbot.userReplyBackgroundColor || '#e4e4e7',
        userReplyTextColor: chatbot.userReplyTextColor || '#000000',
        chatInputStyle: chatbot.chatInputStyle || 'default',
        inquiryEnabled: chatbot.inquiryEnabled || false,
        inquiryLinkText: chatbot.inquiryLinkText || 'Contact our support team',
        inquiryDisplayLinkAfterXMessage: chatbot.inquiryDisplayLinkAfterXMessage || 1,
        chatHistoryEnabled: chatbot.chatHistoryEnabled || false,
        displayBranding: chatbot.displayBranding || true,
        chatFileAttachementEnabled: chatbot.chatFileAttachementEnabled || false,
        bannedIps: chatbot.bannedIps || [],
        allowEveryone: chatbot.allowEveryone || true,
        allowedIpRanges: chatbot.allowedIpRanges || [],
        apiVersion: 'v2',
        preserveHistory: true
    }

    return (
        <ClientSideChat chatbot={clientSideChatbot} withExitX={params.withExitX} defaultMessage={params.defaultMessage || ""} clientSidePrompt={params.clientSidePrompt || ""}></ClientSideChat>
    )
}