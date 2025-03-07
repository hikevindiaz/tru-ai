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

export const maxDuration = 60;

export async function GET(request: Request) {
  // Ensure the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all chatbots for the user
    const chatbots = await prisma.chatbot.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(chatbots);
  } catch (error) {
    console.error("Error fetching chatbots:", error);
    return NextResponse.json({ 
      error: "Failed to fetch chatbots",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Validate user subscription plan
    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    const count = await prisma.chatbot.count({
      where: {
        userId: user.id,
      },
    })

    if (count >= subscriptionPlan.maxChatbots) {
      throw new RequiresHigherPlanError()
    }

    const json = await req.json()
    const body = chatbotSchema.parse(json)

    const model = await prisma.chatbotModel.findUnique({
      where: {
        id: body.modelId
      }
    })

    if (!model) {
      return new Response("Invalid Model", { status: 400 })
    }

    const openAIConfig = await prisma.openAIConfig.findUnique({
      select: {
        globalAPIKey: true,
        id: true,
      },
      where: {
        userId: session?.user?.id
      }
    })

    if (!openAIConfig?.globalAPIKey) {
      return new Response("Missing your global OpenAI API key, please configure your account.", { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: openAIConfig?.globalAPIKey
    })

    const files = await prisma.file.findMany({
      select: {
        id: true,
        openAIFileId: true,
        name: true,
      },
      where: {
        id: {
          in: body.files
        },
      },
    })

    if (!files) {
      return new Response("Invalid files", { status: 400 })
    }

    try {
      const openaiTest = new OpenAI({
        apiKey: body.openAIKey
      })
      await openaiTest.models.list()
    } catch (error) {
      return new Response("Invalid OpenAI API key", { status: 400, statusText: "Invalid OpenAI API key" })
    }

    // validate file extension to create vector store or user code interpreter
    let bodyTools = {
      'code_interpreter': {
        file_ids: []
      },
      'file_search': {
        vector_store_ids: []
      }
    };

    // validate file extension to create vector store 
    const allFileforFileSearch = files.filter((f) => searchFile.includes(f.name.split('.').pop()!));
    console.log(allFileforFileSearch);

    const allFileforCodeInterpreter = files.filter((f) => codeFile.includes(f.name.split('.').pop()?.toLocaleLowerCase()!));
    console.log(allFileforCodeInterpreter);

    bodyTools['code_interpreter'] = {
      file_ids: allFileforCodeInterpreter.map((f) => f.openAIFileId)
    };

    if (allFileforFileSearch.length > 0) {
      const vectorStores = await openai.beta.vectorStores.list();
      const vectorStore = vectorStores.data.find((vs) => vs.name === `Vector Store - ${body.name}`);

      if (vectorStore) {
        await openai.beta.vectorStores.del(vectorStore.id);
      }

      const batch = await openai.beta.vectorStores.create({
        name: `Vector Store - ${body.name}`,
        file_ids: allFileforFileSearch.map((f) => f.openAIFileId)
      });

      bodyTools['file_search'] = {
        vector_store_ids: [batch.id]
      };
    }

    const createdChatbot = await openai.beta.assistants.create({
      name: body.name,
      instructions: body.prompt,
      model: model.name,
      tools: [{ type: "file_search" }, { type: "code_interpreter" }],
      tool_resources: {
        ...bodyTools
      }
    })

    const chatbot = await prisma.chatbot.create({
      data: {
        name: body.name,
        prompt: body.prompt,
        openaiKey: body.openAIKey,
        openaiId: createdChatbot.id,
        modelId: model.id,
        userId: user?.id,
        welcomeMessage: body.welcomeMessage,
        chatbotErrorMessage: body.chatbotErrorMessage,
      },
      select: {
        id: true,
      },
    })

    await prisma.chatbotFiles.createMany(
      {
        data: files.map((file) => ({
          chatbotId: chatbot.id,
          fileId: file.id,
        })),
      }
    )

    return new Response(JSON.stringify({ chatbot }))
  } catch (error) {
    console.log(error)

    if (error instanceof RequiresHigherPlanError) {
      return new Response("Upgrade to higher plan", { status: 402 })
    }

    return new Response(null, { status: 500 })
  }
}
