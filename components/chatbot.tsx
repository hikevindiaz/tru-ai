"use client"

import React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";
import ChatWidget from './chat-widget';
import GradientAgentSphere from './gradientagentsphere';

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
                <div className="flex items-center">
                    <GradientAgentSphere size={24} className="mr-2" />
                    <h2 className="text-lg font-semibold">AI Assistant</h2>
                </div>
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