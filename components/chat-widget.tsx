'use client'

import { useState, useEffect } from 'react'
import ChatbotButton from './chatbot-button'

interface ChatWidgetProps {
  chatbotId: string;
  chatbotName?: string;
  logoUrl?: string;
  buttonProps?: {
    textColor?: string;
    backgroundColor?: string;
    borderGradient?: boolean;
    title?: string;
    message?: string;
    waveEmoji?: boolean;
    gradientColors?: string[];
  };
}

export default function ChatWidget({
  chatbotId,
  chatbotName,
  logoUrl,
  buttonProps = {}
}: ChatWidgetProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  // Toggle chat visibility
  const toggleChat = (isOpen: boolean) => {
    setIsChatOpen(isOpen);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end">
      {/* Chat iframe */}
      {isChatOpen && (
        <div className="mb-3 mr-3 w-[30rem] h-[65vh] border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white transition-all duration-300 ease-in-out sm:w-[30rem] sm:h-[65vh]">
          <iframe
            src={`https://dashboard.getlinkai.com/embed/${chatbotId}/window?chatbox=false&withExitX=true`}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            allowFullScreen
          />
        </div>
      )}

      {/* Chat button */}
      <div className="mb-3 mr-3">
        <ChatbotButton
          textColor={buttonProps.textColor}
          backgroundColor={buttonProps.backgroundColor}
          borderGradient={buttonProps.borderGradient}
          title={buttonProps.title}
          message={buttonProps.message}
          waveEmoji={buttonProps.waveEmoji}
          onToggleChat={toggleChat}
          gradientColors={buttonProps.gradientColors}
          logoUrl={logoUrl}
          chatbotName={chatbotName}
        />
      </div>
    </div>
  );
} 