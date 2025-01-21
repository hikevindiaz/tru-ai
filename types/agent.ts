export interface Action {
  id: string
  type: string
  config: Record<string, any>
}

export interface Agent {
  id: string
  name: string
  status: 'draft' | 'live'
  welcomeMessage: string
  prompt: string
  errorMessage: string
  language: string
  modelId: string
  brainFiles: string[]
  maxTokens: number
  temperature: number
  phoneNumber: string
  voice: string
  responseRate: 'rapid' | 'normal' | 'patient'
  checkUserPresence: boolean
  presenceMessage: string
  presenceMessageDelay: number
  silenceTimeout: number
  hangUpMessage: string
  callTimeout: number
  actions: Action[]
} 