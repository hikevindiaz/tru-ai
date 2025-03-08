'use client'

import { useState, useEffect } from 'react'
import ChatbotButton from './chatbot-button'

interface ChatWidgetProps {
  chatbotId?: string;
  apiUrl?: string;
  buttonProps?: {
    textColor?: string;
    backgroundColor?: string;
    borderGradient?: boolean;
    title?: string;
    message?: string;
    waveEmoji?: boolean;
  };
  chatbotName?: string;
  logoUrl?: string;
}

export default function ChatWidget({
  chatbotId = 'cm3g1y5sr0001ctepual1zhpv',
  apiUrl = 'https://dashboard.getlinkai.com',
  buttonProps = {},
  chatbotName,
  logoUrl
}: ChatWidgetProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleToggleChat = (isOpen: boolean) => {
    setIsChatOpen(isOpen);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isChatOpen && (
        <div 
          className="mb-3 mr-3 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 animate-slideUpFade"
          style={{
            width: isMobile ? 'calc(100vw - 2rem)' : '30rem',
            height: isMobile ? 'calc(100vh - 7rem)' : '65vh',
            border: '2px solid #e2e8f0',
          }}
        >
          <div className="w-full h-full">
            <iframe
              src={`${apiUrl}/embed/${chatbotId}/window?chatbox=false&withExitX=true`}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      )}
      
      {/* Chat Button */}
      <div className="mb-3 mr-3">
        <ChatbotButton
          textColor={buttonProps.textColor}
          backgroundColor={buttonProps.backgroundColor}
          borderGradient={buttonProps.borderGradient !== undefined ? buttonProps.borderGradient : true}
          title={buttonProps.title}
          message={buttonProps.message}
          waveEmoji={buttonProps.waveEmoji !== undefined ? buttonProps.waveEmoji : true}
          onToggleChat={handleToggleChat}
          chatbotName={chatbotName}
          logoUrl={logoUrl}
        />
      </div>
    </div>
  );
} 