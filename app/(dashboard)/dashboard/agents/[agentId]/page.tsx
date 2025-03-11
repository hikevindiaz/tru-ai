'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AgentSettings } from '@/components/agents/agent-settings';
import type { Agent } from '@/types/agent';

export default function AgentDetailsPage({ params }: { params: { agentId: string } }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch agent data
  const fetchAgent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chatbots/${params.agentId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Agent not found');
          router.push('/dashboard/agents');
          return;
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setAgent(data);
    } catch (error) {
      console.error('Error fetching agent:', error);
      toast.error(`Failed to load agent: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch agent on mount
  useEffect(() => {
    fetchAgent();
  }, [params.agentId]);

  // Handle save
  const handleSave = async (data: Partial<Agent>) => {
    try {
      const response = await fetch(`/api/chatbots/${params.agentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const updatedAgent = await response.json();
      
      // Update the local agent state
      setAgent((prev) => {
        if (!prev) return updatedAgent;
        return {
          ...prev,
          ...updatedAgent,
        };
      });
      
      // Refresh the agent data to ensure we have the latest state
      // This helps with the issue where refreshing the page shows old data
      fetchAgent();
      
      // Return the updated agent data
      return updatedAgent;
    } catch (error) {
      console.error('Error saving agent:', error);
      toast.error(`Failed to save agent: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Agent not found</h2>
          <p className="mt-2 text-gray-500">The agent you're looking for doesn't exist or you don't have access to it.</p>
          <button
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white"
            onClick={() => router.push('/dashboard/agents')}
          >
            Go back to agents
          </button>
        </div>
      </div>
    );
  }

  return <AgentSettings agent={agent} onSave={handleSave} />;
} 