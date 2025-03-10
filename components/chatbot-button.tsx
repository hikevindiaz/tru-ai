'use client'

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import GradientAgentSphere from './gradientagentsphere';

export interface ChatbotButtonComponentProps {
    textColor?: string;
    backgroundColor?: string;
    borderGradient?: boolean;
    borderGradientColors?: string[];
    title?: string;
    message?: string;
    waveEmoji?: boolean;
    onToggleChat?: (isOpen: boolean) => void;
    gradientColors?: string[];
    logoUrl?: string;
    chatbotName?: string;
    maxButtonWidth?: number;
}

export default function ChatbotButton({ 
    textColor = "#000000", 
    backgroundColor = "#FFFFFF",
    borderGradient = true,
    borderGradientColors = ["#2563EB", "#7E22CE", "#F97316"], // Blue, Purple, Orange for the border
    title,
    message = "Hi, let's talk",
    waveEmoji = true,
    onToggleChat,
    gradientColors = ["#022597", "#000001", "#1a56db"], // Default colors for the sphere
    logoUrl,
    chatbotName,
    maxButtonWidth = 320
}: ChatbotButtonComponentProps) {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLSpanElement>(null);
    const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);
    
    // Use chatbot name as title if provided, otherwise use default
    const displayTitle = chatbotName || title || "Link AI Smart Agent";

    // Calculate button width based on text content
    useEffect(() => {
        if (messageRef.current) {
            const textWidth = messageRef.current.scrollWidth;
            const logoWidth = 36; // w-9 = 36px
            const padding = 24; // px-3 = 12px * 2
            const gap = 8; // gap-2 = 8px
            const emojiWidth = waveEmoji ? 20 : 0; // Approximate width of emoji
            const margin = 16; // Extra margin for safety
            
            const calculatedWidth = Math.min(
                textWidth + logoWidth + padding + gap + emojiWidth + margin,
                maxButtonWidth
            );
            
            setButtonWidth(calculatedWidth);
        }
    }, [message, waveEmoji, maxButtonWidth]);

    useEffect(() => {
        // For compatibility with iframe messaging if still needed
        window.addEventListener('message', function (event) {
            if (event.data === 'openChat') {
                setIsChatVisible(true);
            }

            if (event.data === 'closeChat') {
                setIsChatVisible(false);
            }
        });

        return () => {
            window.removeEventListener('message', () => {});
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    function toggleChatVisibility() {
        setIsTransitioning(true);
        const newVisibility = !isChatVisible;
        
        // Call the callback if provided
        if (onToggleChat) {
            onToggleChat(newVisibility);
        }
        
        // For backward compatibility with iframe approach
        if (newVisibility) {
            window.parent.postMessage('openChat', '*');
        } else {
            window.parent.postMessage('closeChat', '*');
        }

        // Delay the state change to allow for animation
        timeoutRef.current = setTimeout(() => {
            setIsChatVisible(newVisibility);
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        }, 150);
    }

    // Create gradient colors for conic gradient (border)
    const [color1, color2, color3] = borderGradientColors;

    return (
        <div ref={containerRef} className="relative" style={{ height: isChatVisible ? '48px' : 'auto' }}>
            {/* Chat Button */}
            <div 
                className={`
                    transition-all duration-300 cursor-pointer overflow-hidden
                    ${isChatVisible ? 'opacity-0 scale-0 absolute pointer-events-none' : 'opacity-100 scale-100'}
                    ${isTransitioning ? 'transform' : ''}
                    ${borderGradient ? 'animate-border' : ''}
                `}
                style={{ 
                    width: buttonWidth ? `${buttonWidth}px` : 'auto',
                    maxWidth: `${maxButtonWidth}px`,
                    borderRadius: '16px',
                    padding: borderGradient ? '1px' : '0',
                    background: borderGradient ? 
                        `conic-gradient(from var(--border-angle), ${color1}, ${color2}, ${color3}, ${color2}, ${color1})` : 'transparent',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transformOrigin: 'right bottom',
                    position: isChatVisible ? 'absolute' : 'relative',
                    right: 0,
                    bottom: 0
                }}
                onClick={!isTransitioning ? toggleChatVisibility : undefined}
            >
                <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-[14px]"
                    style={{ backgroundColor }}
                >
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                        {logoUrl ? (
                            <Image 
                                src={logoUrl} 
                                alt={displayTitle}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <GradientAgentSphere size={36} gradientColors={gradientColors} />
                        )}
                    </div>
                    
                    <div className="flex flex-col -space-y-1 min-w-0">
                        <span className="text-[10px] font-normal opacity-70 truncate" style={{ color: textColor }}>{displayTitle}</span>
                        <div className="flex items-center">
                            <span 
                                ref={messageRef} 
                                className="text-base font-bold whitespace-nowrap" 
                                style={{ color: textColor }}
                            >
                                {message.length > 20 ? `${message.substring(0, 20)}...` : message}
                            </span>
                            {waveEmoji && (
                                <span className="ml-1 text-base flex-shrink-0" role="img" aria-label="wave">
                                    👋
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* X Button */}
            <div 
                className={`
                    transition-all duration-300 cursor-pointer overflow-hidden
                    ${!isChatVisible ? 'opacity-0 scale-0 absolute pointer-events-none' : 'opacity-100 scale-100'}
                    ${isTransitioning ? 'transform' : ''}
                    ${borderGradient ? 'animate-border' : ''}
                `}
                style={{ 
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    padding: borderGradient ? '1px' : '0',
                    background: borderGradient ? 
                        `conic-gradient(from var(--border-angle), ${color1}, ${color2}, ${color3}, ${color2}, ${color1})` : 'transparent',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transformOrigin: 'center',
                    position: 'absolute',
                    right: 0,
                    bottom: 0
                }}
                onClick={!isTransitioning ? toggleChatVisibility : undefined}
            >
                <div 
                    className="flex items-center justify-center w-full h-full rounded-full"
                    style={{ backgroundColor }}
                >
                    <X 
                        size={20} 
                        color={textColor} 
                        className={`transition-transform duration-300 ${isTransitioning && !isChatVisible ? 'rotate-90' : 'rotate-0'}`}
                    />
                </div>
            </div>

            {/* CSS for border animation */}
            <style jsx global>{`
                @property --border-angle {
                    syntax: '<angle>';
                    initial-value: 0deg;
                    inherits: false;
                }
                
                @keyframes border {
                    to {
                        --border-angle: 360deg;
                    }
                }
                
                .animate-border {
                    animation: border 4s linear infinite;
                }
            `}</style>
        </div>
    );
}