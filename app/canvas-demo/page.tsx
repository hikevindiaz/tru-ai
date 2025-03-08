'use client'

import { useState } from 'react'
import AnimatedCanvas from '@/components/AnimatedCanvas'

export default function CanvasDemoPage() {
  const [activeTab, setActiveTab] = useState('default')
  
  const presets = {
    default: {
      title: 'Default',
      description: 'Modern particle network with subtle connections',
      props: {
        primaryColor: '#2563EB',
        secondaryColor: '#7E22CE',
        tertiaryColor: '#F97316',
        particleCount: 40,
        particleSize: 2,
        connectionDistance: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }
    },
    minimal: {
      title: 'Minimal',
      description: 'Fewer particles with more subtle connections',
      props: {
        primaryColor: '#94A3B8',
        secondaryColor: '#64748B',
        tertiaryColor: '#334155',
        particleCount: 25,
        particleSize: 1.5,
        connectionDistance: 80,
        backgroundColor: 'rgba(15, 23, 42, 0.9)'
      }
    },
    vibrant: {
      title: 'Vibrant',
      description: 'Colorful particles with more connections',
      props: {
        primaryColor: '#EC4899',
        secondaryColor: '#8B5CF6',
        tertiaryColor: '#06B6D4',
        particleCount: 60,
        particleSize: 2.5,
        connectionDistance: 120,
        backgroundColor: 'rgba(17, 24, 39, 0.85)'
      }
    },
    subtle: {
      title: 'Subtle',
      description: 'Very minimal animation for background use',
      props: {
        primaryColor: '#94A3B8',
        secondaryColor: '#94A3B8',
        tertiaryColor: '#94A3B8',
        particleCount: 20,
        particleSize: 1,
        connectionDistance: 60,
        backgroundColor: 'rgba(15, 23, 42, 0.95)'
      }
    },
    chatgpt: {
      title: 'ChatGPT Style',
      description: 'Inspired by ChatGPT voice mode',
      props: {
        primaryColor: '#10A37F',
        secondaryColor: '#1A7F64',
        tertiaryColor: '#0E8D6E',
        particleCount: 30,
        particleSize: 2,
        connectionDistance: 90,
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }
    }
  }
  
  const currentPreset = presets[activeTab as keyof typeof presets]
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Animated Canvas Demo
          </h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            {Object.entries(presets).map(([key, preset]) => (
              <li className="mr-2" key={key}>
                <button
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === key
                      ? 'text-blue-600 dark:text-blue-500 border-b-2 border-blue-600 dark:border-blue-500'
                      : 'text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(key)}
                >
                  {preset.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {currentPreset.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {currentPreset.description}
          </p>
        </div>
        
        {/* Canvas Demo */}
        <div className="grid grid-cols-1 gap-6">
          {/* Full-width demo */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Full-width Demo
              </h3>
            </div>
            <div className="h-96 relative">
              <AnimatedCanvas
                className="rounded-b-lg"
                {...currentPreset.props}
              />
              
              {/* Overlay content to demonstrate usage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Modern & Sophisticated
                  </h2>
                  <p className="text-white/80 max-w-md">
                    This animated canvas creates a subtle, engaging background
                    that enhances your content without overwhelming it.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Side-by-side examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example with text */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  With Content Overlay
                </h3>
              </div>
              <div className="h-64 relative">
                <AnimatedCanvas
                  className="rounded-b-lg"
                  {...currentPreset.props}
                  particleCount={Math.floor(currentPreset.props.particleCount * 0.7)}
                />
                
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Feature Highlight
                    </h4>
                    <p className="text-white/80">
                      Perfect background for highlighting key features or calls to action.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Example as card background */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  As Card Background
                </h3>
              </div>
              <div className="h-64 relative">
                <AnimatedCanvas
                  className="rounded-b-lg"
                  {...currentPreset.props}
                  particleCount={Math.floor(currentPreset.props.particleCount * 0.7)}
                />
                
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="w-full max-w-sm">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          A
                        </div>
                        <div className="ml-3">
                          <h5 className="text-white font-medium">Analytics Dashboard</h5>
                          <p className="text-white/70 text-sm">Real-time data visualization</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-white/20 rounded-full w-full"></div>
                        <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                        <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Configuration */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Configuration
            </h3>
          </div>
          <div className="p-6">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              {`<AnimatedCanvas
  primaryColor="${currentPreset.props.primaryColor}"
  secondaryColor="${currentPreset.props.secondaryColor}"
  tertiaryColor="${currentPreset.props.tertiaryColor}"
  particleCount={${currentPreset.props.particleCount}}
  particleSize={${currentPreset.props.particleSize}}
  connectionDistance={${currentPreset.props.connectionDistance}}
  backgroundColor="${currentPreset.props.backgroundColor}"
  interactive={true}
/>`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
} 