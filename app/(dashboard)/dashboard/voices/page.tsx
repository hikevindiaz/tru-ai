"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/Input';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

// Define types for the voice data
interface VoiceLabel {
  [key: string]: string;
}

interface Voice {
  voice_id: string;
  name: string;
  labels: VoiceLabel;
  language?: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  [key: string]: any;
}

const VoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [voices, setVoices] = useState<Voice[]>([]);
  const [visibleVoices, setVisibleVoices] = useState(15);
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});
  const [showBanner, setShowBanner] = useState(true);
  const [voiceSettings, setVoiceSettings] = useState<Record<string, VoiceSettings>>({});
  const [showSettings, setShowSettings] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Default voice settings - higher stability for better quality
  const defaultSettings: VoiceSettings = {
    stability: 0.85,
    similarity_boost: 0.85,
    style: 0,
    use_speaker_boost: true
  };

  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/elevenlabs/voices');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        console.log('Loaded voices:', data);
        // Ensure data is an array before setting it
        setVoices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading voices:', error);
        setVoices([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadVoices();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTextChange = (voiceId: string, text: string) => {
    setTextInputs((prev) => ({ ...prev, [voiceId]: text }));
  };

  const handleSettingsChange = (voiceId: string, setting: keyof VoiceSettings, value: number | boolean) => {
    setVoiceSettings(prev => ({
      ...prev,
      [voiceId]: {
        ...(prev[voiceId] || defaultSettings),
        [setting]: value
      }
    }));
  };

  const toggleSettings = (voiceId: string) => {
    setShowSettings(prev => ({
      ...prev,
      [voiceId]: !prev[voiceId]
    }));
    
    // Initialize settings if they don't exist
    if (!voiceSettings[voiceId]) {
      setVoiceSettings(prev => ({
        ...prev,
        [voiceId]: { ...defaultSettings }
      }));
    }
  };

  const handlePlay = async (voiceId: string, language?: string) => {
    const text = textInputs[voiceId] || 'Hi there, how can I help you today? / ¿Cómo puedo ayudarte hoy?';
    setIsPlaying((prev) => ({ ...prev, [voiceId]: true }));

    try {
      // Use custom settings if available, otherwise fetch from API
      let settings: VoiceSettings = voiceSettings[voiceId] || { ...defaultSettings };
      
      if (!voiceSettings[voiceId]) {
        try {
          const fetchedSettings = await fetchVoiceSettings(voiceId);
          if (fetchedSettings) {
            settings = fetchedSettings;
            console.log('Voice settings for', voiceId, ':', settings);
            
            // Save fetched settings
            setVoiceSettings(prev => ({
              ...prev,
              [voiceId]: settings
            }));
          }
        } catch (error) {
          console.warn('Could not fetch voice settings, using defaults:', error);
        }
      }
      
      const response = await fetch('/api/elevenlabs/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          voiceId, 
          language,
          ...settings
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying((prev) => ({ ...prev, [voiceId]: false }));
        URL.revokeObjectURL(audioUrl); // Clean up the URL object
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying((prev) => ({ ...prev, [voiceId]: false }));
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying((prev) => ({ ...prev, [voiceId]: false }));
    }
  };

  const loadMoreVoices = () => {
    setVisibleVoices((prev) => prev + 15);
  };

  const tagMapping: Record<string, string[]> = {
    es: ['español', 'spanish'],
    // Add more mappings as needed
  };

  // Add a safeguard to ensure voices is an array before filtering
  const filteredVoices = Array.isArray(voices) ? voices.filter((voice) => {
    if (!voice || typeof voice !== 'object') return false;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = voice.name && typeof voice.name === 'string' 
      ? voice.name.toLowerCase().includes(searchLower) 
      : false;
    
    const labelMatch = voice.labels && typeof voice.labels === 'object'
      ? Object.entries(voice.labels).some(([key, value]) => {
          if (typeof value !== 'string') return false;
          const labelLower = value.toLowerCase();
          return (
            labelLower.includes(searchLower) ||
            (tagMapping[key] && tagMapping[key].some((term) => term.includes(searchLower)))
          );
        })
      : false;
      
    return nameMatch || labelMatch;
  }) : [];

  const fetchVoiceSettings = async (voiceId: string): Promise<VoiceSettings> => {
    try {
      // Use the new API endpoint with query parameters instead of dynamic routes
      const response = await fetch(`/api/elevenlabs/voice-settings?voiceId=${encodeURIComponent(voiceId)}`);
      
      if (!response.ok) {
        console.warn(`Failed to fetch voice settings for ${voiceId}: ${response.status}`);
        return { ...defaultSettings };
      }
      
      const data = await response.json();
      return {
        stability: typeof data.stability === 'number' ? data.stability : defaultSettings.stability,
        similarity_boost: typeof data.similarity_boost === 'number' ? data.similarity_boost : defaultSettings.similarity_boost,
        style: typeof data.style === 'number' ? data.style : defaultSettings.style,
        use_speaker_boost: typeof data.use_speaker_boost === 'boolean' ? data.use_speaker_boost : defaultSettings.use_speaker_boost
      };
    } catch (error) {
      console.error('Error fetching voice settings:', error);
      return { ...defaultSettings };
    }
  };

  return (
    <div>
      {/* Banner */}
      {showBanner && (
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 w-full">
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
              }}
              className="aspect-577/310 w-[36.0625rem] bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 opacity-30"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
              }}
              className="aspect-577/310 w-[36.0625rem] bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 opacity-30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm/6 text-gray-900">
              <strong className="font-semibold">Voice Library</strong>
              <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline h-0.5 w-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              Customize your agents with premium AI voices
            </p>
          </div>
          <div className="flex flex-1 justify-end">
            <button
              type="button"
              className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
              onClick={() => setShowBanner(false)}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon aria-hidden="true" className="h-5 w-5 text-gray-900" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Voices</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore and test new voices for your agents
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search for voice..."
              id="search"
              name="search"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-74 mt-2"
            />
          </div>
        </div>

        {/* Full width divider - directly using the Divider with margin adjustments */}
        <Divider className="-mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)]" />

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <span className="ml-2 text-sm text-gray-500">Loading voices...</span>
          </div>
        ) : voices.length === 0 ? (
          <div className="flex h-full items-center justify-center py-8 text-center">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No voices available.
              </p>
            </div>
          </div>
        ) : (
          /* Grid List */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVoices.slice(0, visibleVoices).map((voice, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{voice.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {voice.labels && Object.entries(voice.labels).slice(0, 3).map(([key, value]) => (
                        <Badge key={key} variant="default">
                          {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => toggleSettings(voice.voice_id)}
                    >
                      <Icons.settings className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">+ Add Voice</Button>
                  </div>
                </div>
                
                {/* Voice Settings */}
                {showSettings[voice.voice_id] && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <Label htmlFor={`stability-${voice.voice_id}`}>
                          Stability: {((voiceSettings[voice.voice_id]?.stability || defaultSettings.stability) * 100).toFixed(0)}%
                        </Label>
                      </div>
                      <Slider
                        id={`stability-${voice.voice_id}`}
                        min={0}
                        max={1}
                        step={0.05}
                        value={[voiceSettings[voice.voice_id]?.stability ?? defaultSettings.stability]}
                        onValueChange={(value) => handleSettingsChange(voice.voice_id, 'stability', value[0])}
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher values = more consistent, lower = more expressive.</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor={`similarity-${voice.voice_id}`}>
                          Similarity: {((voiceSettings[voice.voice_id]?.similarity_boost || defaultSettings.similarity_boost) * 100).toFixed(0)}%
                        </Label>
                      </div>
                      <Slider
                        id={`similarity-${voice.voice_id}`}
                        min={0}
                        max={1}
                        step={0.05}
                        value={[voiceSettings[voice.voice_id]?.similarity_boost ?? defaultSettings.similarity_boost]}
                        onValueChange={(value) => handleSettingsChange(voice.voice_id, 'similarity_boost', value[0])}
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher values make the voice more similar to the original.</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <Input
                    type="text"
                    value={textInputs[voice.voice_id] || 'Hi there, how can I help you today? / ¿Cómo puedo ayudarte hoy?'}
                    onChange={(e) => handleTextChange(voice.voice_id, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="primary"
                    onClick={() => handlePlay(voice.voice_id, voice.language)}
                    className="h-8 w-8 p-0 rounded-full flex items-center justify-center"
                  >
                    {isPlaying[voice.voice_id] ? (
                      <Icons.loading className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && filteredVoices.length > visibleVoices && (
          <div className="flex justify-center mt-6">
            <Button variant="primary" onClick={loadMoreVoices}>Load More</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoicesPage;
