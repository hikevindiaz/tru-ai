import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { chatbotSchema } from "@/lib/validations/chatbot";
import OpenAI from "openai";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { RequiresHigherPlanError } from "@/lib/exceptions";
import { fileTypes as codeFile } from "@/lib/validations/codeInterpreter";
import { fileTypes as searchFile } from "@/lib/validations/fileSearch";

// Add the global OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatbots = await prisma.chatbot.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        model: {
          select: {
            id: true,
            name: true,
          },
        },
        knowledgeSources: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Log the first chatbot for debugging
    if (chatbots.length > 0) {
      console.log("Sample chatbot data:", JSON.stringify({
        id: chatbots[0].id,
        name: chatbots[0].name,
        modelId: chatbots[0].modelId,
        temperature: chatbots[0].temperature,
        maxPromptTokens: chatbots[0].maxPromptTokens,
        maxCompletionTokens: chatbots[0].maxCompletionTokens,
        knowledgeSources: chatbots[0].knowledgeSources?.map(ks => ({ id: ks.id, name: ks.name }))
      }, null, 2));
    }

    return NextResponse.json(chatbots);
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatbots' },
      { status: 500 }
    );
  }
}

// Define the types for the tools to fix the linter errors
type ToolResources = {
  code_interpreter: {
    file_ids: string[];
  };
  file_search: {
    vector_store_ids: string[];
  };
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Create the chatbot with default values for new fields
    const chatbot = await prisma.chatbot.create({
      data: {
        name: body.name,
        userId: session.user.id,
        prompt: body.prompt || "You are a helpful assistant.",
        welcomeMessage: body.welcomeMessage || "Hello! How can I help you today?",
        chatbotErrorMessage: body.chatbotErrorMessage || "I'm sorry, I encountered an error. Please try again later.",
        temperature: body.temperature || 0.7,
        maxPromptTokens: body.maxPromptTokens || 1200,
        maxCompletionTokens: body.maxCompletionTokens || 1200,
        // Initialize training-related fields with default values
        trainingStatus: "idle",
        trainingMessage: null,
        lastTrainedAt: null,
      },
    });

    return NextResponse.json(chatbot);
  } catch (error) {
    console.error("Error creating chatbot:", error);
    return NextResponse.json(
      { error: "Failed to create chatbot" },
      { status: 500 }
    );
  }
}
