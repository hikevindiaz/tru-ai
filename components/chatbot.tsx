"use client"

import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";
import ChatWidget from './chat-widget';

interface ChatbotProps {
  chatbotData?: {
    id: string;
    name: string;
    chatbotLogoURL?: string;
    bubbleTextColor?: string;
    bubbleColor?: string;
  };
}

export default function Chatbot({ chatbotData }: ChatbotProps) {
    function ChatboxWrapper() {
        const params = useSearchParams();
        const chatboxParam = params?.get('chatbox') || '';

        // Use the chatbot ID from props or fallback to the default
        const chatbotId = chatbotData?.id || "cm3g1y5sr0001ctepual1zhpv";
        
        if (chatboxParam.match('false')) {
            return <></>;
        } else {
            return (
                <ChatWidget 
                    chatbotId={chatbotId}
                    chatbotName={chatbotData?.name}
                    logoUrl={chatbotData?.chatbotLogoURL}
                    buttonProps={{
                        textColor: chatbotData?.bubbleTextColor || "#000000",
                        backgroundColor: chatbotData?.bubbleColor || "#FFFFFF",
                        borderGradient: true,
                        message: "Hi, let's talk",
                        waveEmoji: true
                    }}
                />
            );
        }
    }

    return (
        <div>
            <Suspense>
                <ChatboxWrapper />
            </Suspense>
        </div>
    );
}