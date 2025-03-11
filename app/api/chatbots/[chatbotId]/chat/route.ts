import { db } from "@/lib/db";
import OpenAI from "openai";
import { z } from "zod";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { AssistantResponse } from "@/lib/assistant-response";
import { zfd } from "zod-form-data";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { fileTypesFullList } from "@/lib/validations/codeInterpreter";
import { fileTypes as searchFile } from "@/lib/validations/fileSearch";
import { getClientIP } from "@/lib/getIP";

export const maxDuration = 300;

const routeContextSchema = z.object({
  params: z.object({
    chatbotId: z.string(),
  }),
});

const schema = zfd.formData({
  threadId: z.string().or(z.undefined()),
  message: zfd.text(),
  clientSidePrompt: z.string().or(z.undefined()),
  file: z.instanceof(Blob).or(z.string()),
  filename: z.string(),
});

// Helper function to retry API calls
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
}

// Helper function to verify if an assistant exists and create it if it doesn't
async function verifyAndCreateAssistant(client: OpenAI, chatbot: any): Promise<string> {
  console.log(`Verifying assistant with ID: ${chatbot.openaiId || 'none'}`);
  
  let assistantId = null;
  let needsCreation = true;
  
  // Check if the assistant exists in OpenAI
  if (chatbot.openaiId) {
    try {
      const existingAssistant = await client.beta.assistants.retrieve(chatbot.openaiId);
      console.log(`Assistant exists with ID: ${existingAssistant.id}`);
      assistantId = existingAssistant.id;
      needsCreation = false;
    } catch (error) {
      console.log(`Assistant not found or error retrieving: ${error}`);
      // Assistant doesn't exist or there was an error, we'll create a new one
      needsCreation = true;
    }
  }
  
  if (needsCreation) {
    console.log("Creating new assistant...");
    
    // Get the model
    const model = await db.chatbotModel.findUnique({
      where: {
        id: chatbot.modelId || undefined
      }
    });
    
    const modelName = model?.name || "gpt-4o";
    console.log(`Using model: ${modelName}`);
    
    // Get the files associated with the chatbot
    const chatbotFiles = await db.chatbotFiles.findMany({
      where: {
        chatbotId: chatbot.id
      },
      include: {
        file: true
      }
    });
    
    const fileIds = chatbotFiles.map(cf => cf.file.openAIFileId);
    console.log(`Found ${fileIds.length} files for the assistant`);
    
    // Create a new assistant with proper configuration
    const assistantOptions: any = {
      name: chatbot.name,
      instructions: chatbot.prompt || "You are a helpful assistant.",
      model: modelName,
      tools: []
    };
    
    // Add file_ids if there are any
    if (fileIds.length > 0) {
      assistantOptions.file_ids = fileIds;
    }
    
    console.log("Creating assistant with options:", JSON.stringify(assistantOptions, null, 2));
    
    try {
      const newAssistant = await client.beta.assistants.create(assistantOptions);
      console.log(`Created new assistant with ID: ${newAssistant.id}`);
      assistantId = newAssistant.id;
      
      // Update the chatbot in the database with the new assistant ID
      await db.chatbot.update({
        where: {
          id: chatbot.id
        },
        data: {
          openaiId: newAssistant.id
        }
      });
      
      console.log(`Updated chatbot record with new assistant ID: ${newAssistant.id}`);
    } catch (createError) {
      console.error("Error creating assistant:", createError);
      throw createError;
    }
  }
  
  return assistantId!;
}

export async function OPTIONS(req: Request) {
  return new Response("Ok", { status: 200 });
}

export async function POST(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    const { params } = routeContextSchema.parse(context);

    // Log the request method and URL for debugging
    console.log(`Processing ${req.method} request to ${req.url}`);

    const chatbot = await db.chatbot.findUnique({
      select: {
        id: true,
        userId: true,
        openaiId: true,
        chatbotErrorMessage: true,
        maxCompletionTokens: true,
        maxPromptTokens: true,
        name: true,
        prompt: true,
        modelId: true,
      },
      where: {
        id: params.chatbotId,
      },
    });
    console.log("Fetched Chatbot Data:", chatbot);

    if (!chatbot) {
      console.error("Chatbot not found for ID:", params.chatbotId);
      return new Response(JSON.stringify({ error: "Chatbot not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("Loaded OpenAI API Key:", process.env.OPENAI_API_KEY ? "API key exists" : "API key missing");
    
    // Use the global master OpenAI API key with better configuration
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Use the global master key from .env
      maxRetries: 3, // Add retries for better reliability
      timeout: 60000, // 60 second timeout
    });

    // Verify the OpenAI client is working
    try {
      await openai.models.list();
      console.log("OpenAI client initialized successfully");
    } catch (apiError) {
      console.error("Error initializing OpenAI client:", apiError);
      return new Response(
        JSON.stringify({
          error: 'Failed to initialize OpenAI client',
          message: apiError instanceof Error ? apiError.message : String(apiError),
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Verify and create the assistant if needed
    let assistantId;
    try {
      assistantId = await verifyAndCreateAssistant(openai, chatbot);
      if (!assistantId) {
        throw new Error("Failed to create or verify assistant");
      }
      console.log(`Using verified assistant ID: ${assistantId}`);
    } catch (error) {
      console.error("Error verifying/creating assistant:", error);
      return new Response(
        JSON.stringify({
          error: 'Failed to verify or create assistant',
          message: error instanceof Error ? error.message : String(error),
        }),
        { status: 500 }
      );
    }

    // Handle form data or JSON input
    let data;
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const input = await req.formData();
      data = schema.parse(input);
    } else {
      const json = await req.json();
      data = {
        threadId: json.threadId || "",
        message: json.message,
        clientSidePrompt: json.clientSidePrompt || "",
        file: "",
        filename: "",
      };
    }

    // Create a thread if needed
    const threadId = data.threadId && data.threadId !== "" ? data.threadId : (await openai.beta.threads.create({})).id;
    console.log("Thread ID Created or Used:", threadId);

    // Add the message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: data.message,
    });
    console.log("Created Message:", createdMessage);

    // Return using AssistantResponse to handle streaming properly
    return AssistantResponse(
      { threadId, messageId: createdMessage.id, chatbotId: params.chatbotId },
      async ({ sendMessage, forwardStream, sendDataMessage }) => {
        try {
          const plan = await getUserSubscriptionPlan(chatbot.userId);
          if (plan.unlimitedMessages === false) {
            const messageCount = await db.message.count({
              where: {
                userId: chatbot.userId,
                createdAt: {
                  gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                },
              },
            });
            console.log(`Message count: ${messageCount}`);
            if (messageCount >= plan.maxMessagesPerMonth!) {
              console.log(`Reached message limit ${chatbot.userId}`);
              sendMessage({
                id: "end",
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text: {
                      value: "You have reached your monthly message limit. Upgrade your plan to continue using your chatbot.",
                    },
                  },
                ],
              });
              return;
            }
          }

          // Run the assistant on the thread with better error handling
          try {
            // Get the latest assistant ID from the database (in case it was updated)
            const updatedChatbot = await db.chatbot.findUnique({
              select: {
                openaiId: true,
              },
              where: {
                id: chatbot.id,
              },
            });
            
            const currentAssistantId = updatedChatbot?.openaiId || assistantId;
            console.log("Starting run with assistant ID:", currentAssistantId);
            
            // Create a run with the assistant
            const run = await openai.beta.threads.runs.create(threadId, {
              assistant_id: currentAssistantId,
              instructions: (data.clientSidePrompt || "").replace("+", "") || undefined,
            });
            
            console.log("Created run:", run.id);
            
            // Poll for completion
            let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            console.log("Initial run status:", runStatus.status);
            
            const startTime = Date.now();
            const maxWaitTime = 60000; // 60 seconds timeout
            
            while (
              runStatus.status !== "completed" &&
              runStatus.status !== "failed" &&
              runStatus.status !== "cancelled" &&
              runStatus.status !== "expired"
            ) {
              // Check for timeout
              if (Date.now() - startTime > maxWaitTime) {
                console.log("Run timed out after", maxWaitTime, "ms");
                break;
              }
              
              // Wait before polling again
              await new Promise((resolve) => setTimeout(resolve, 1000));
              runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
              console.log("Updated run status:", runStatus.status);
            }
            
            if (runStatus.status !== "completed") {
              console.error("Run did not complete successfully:", runStatus.status);
              
              // Store the error in the database
              await db.chatbotErrors.create({
                data: {
                  chatbotId: chatbot.id,
                  threadId: threadId,
                  errorMessage: `Run status: ${runStatus.status}`,
                },
              });
              
              sendMessage({
                id: "end",
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text: { value: chatbot.chatbotErrorMessage || "I'm sorry, I encountered an error. Please try again." },
                  },
                ],
              });
              return;
            }
            
            // Get the messages
            const messages = await openai.beta.threads.messages.list(threadId);
            console.log("Message count:", messages.data.length);
            
            // Find the last assistant message
            const lastMessage = messages.data
              .filter((msg) => msg.role === "assistant")
              .shift();
            
            if (!lastMessage) {
              console.error("No response from assistant");
              sendMessage({
                id: "end",
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text: { value: chatbot.chatbotErrorMessage || "I'm sorry, I encountered an error. Please try again." },
                  },
                ],
              });
              return;
            }
            
            // Extract the content
            let messageContent = "";
            if (lastMessage.content && lastMessage.content.length > 0) {
              for (const contentBlock of lastMessage.content) {
                if (contentBlock.type === "text") {
                  messageContent += contentBlock.text.value;
                }
              }
            }
            
            // Store the message in the database
            await db.message.create({
              data: {
                userId: chatbot.userId,
                message: data.message,
                response: messageContent,
                threadId: threadId,
                chatbotId: chatbot.id,
              },
            });
            
            // Send the message to the client
            sendMessage({
              id: lastMessage.id,
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: { value: messageContent },
                },
              ],
            });
          } catch (runError) {
            console.error("Error running assistant:", runError);
            
            // If the error is a 404 Not Found for the assistant, try to recreate it
            if (runError instanceof OpenAI.APIError && runError.status === 404 && runError.error?.message?.includes('No assistant found')) {
              console.log("Assistant not found, attempting to recreate...");
              
              try {
                // Recreate the assistant
                const newAssistantId = await verifyAndCreateAssistant(openai, chatbot);
                
                // Update the error message to be more informative
                await db.chatbotErrors.create({
                  data: {
                    errorMessage: `Assistant not found. Created new assistant with ID: ${newAssistantId}`,
                    threadId: threadId || "",
                    chatbotId: chatbot.id,
                  },
                });
                
                // Send a message to try again
                sendMessage({
                  id: "retry",
                  role: "assistant",
                  content: [
                    {
                      type: "text",
                      text: { value: "I needed to reset my knowledge. Please try your message again." },
                    },
                  ],
                });
                return;
              } catch (recreateError) {
                console.error("Failed to recreate assistant:", recreateError);
              }
            }
            
            // Log the error to the database
            await db.chatbotErrors.create({
              data: {
                errorMessage: runError instanceof Error ? runError.message : String(runError),
                threadId: threadId || "",
                chatbotId: chatbot.id,
              },
            });
            
            // Send error message to the client
            sendMessage({
              id: "error",
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: { value: chatbot.chatbotErrorMessage || "I'm sorry, I encountered an error. Please try again." },
                },
              ],
            });
          }
        } catch (error) {
          console.error("Error in assistant response:", error);
          sendMessage({
            id: "end",
            role: "assistant",
            content: [
              { 
                type: "text", 
                text: { value: chatbot.chatbotErrorMessage || "I'm sorry, I encountered an error. Please try again." } 
              }
            ],
          });
        }
      }
    );
  } catch (error) {
    console.error("Error processing chat request:", error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof OpenAI.APIError) {
      return new Response(error.message, { status: 401 });
    }

    return new Response(null, { status: 500 });
  }
}
