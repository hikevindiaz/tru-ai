import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { getOpenAIKey, getModelNameFromId, uploadFileToOpenAI, processTextToFile, processQAPairsToFile } from "@/lib/openai";
import { combineKnowledgeSources } from "@/lib/knowledge-processing";
import { processTextWithChunking, createTableOfContents, optimizeForRetrieval } from "@/lib/advanced-knowledge-processing";

export const maxDuration = 300; // 5 minutes timeout for long-running operation

export async function POST(
  req: Request,
  { params }: { params: { chatbotId: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatbotId = params.chatbotId;
    
    // Parse the request body for training options
    const body = await req.json();
    const trainingOptions = {
      forceRetrain: body.forceRetrain || false,
      optimizeForSpeed: body.optimizeForSpeed || true,
    };
    
    console.log("Training options:", trainingOptions);
    
    // Fetch the chatbot with its knowledge sources
    const chatbot = await prisma.chatbot.findUnique({
      where: {
        id: chatbotId,
        userId: session.user.id,
      },
      include: {
        knowledgeSources: true,
        model: true,
      },
    });

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // Update the chatbot's training status to 'training'
    await prisma.chatbot.update({
      where: { id: chatbotId },
      data: {
        trainingStatus: "training" as any,
        trainingMessage: "Processing knowledge sources...",
      },
    });

    // Initialize OpenAI client
    const openaiApiKey = await getOpenAIKey();
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Check if the assistant exists in OpenAI
    let assistantExists = false;
    try {
      if (chatbot.openaiId) {
        const existingAssistant = await openai.beta.assistants.retrieve(
          chatbot.openaiId
        );
        assistantExists = !!existingAssistant;
      }
    } catch (error) {
      console.error("Error checking assistant existence:", error);
      assistantExists = false;
    }

    // Process knowledge sources
    const knowledgeSources = chatbot.knowledgeSources || [];
    console.log(`Processing ${knowledgeSources.length} knowledge sources for chatbot ${chatbotId}`);

    // Array to store all file IDs that will be attached to the assistant
    const fileIds: string[] = [];
    
    // Phase 3: Implement caching strategy
    // Check if we have previously processed files for this knowledge source
    const existingFiles = await prisma.chatbotFiles.findMany({
      where: {
        chatbotId: chatbotId,
      },
      include: {
        file: true,
      },
    });
    
    // Map of knowledge source IDs to their last updated time
    const knowledgeSourceLastUpdated = new Map<string, Date>();
    
    // Get the last updated time for each knowledge source
    for (const source of knowledgeSources) {
      knowledgeSourceLastUpdated.set(source.id, source.updatedAt);
    }
    
    // Check if we can reuse any existing files
    // If forceRetrain is true, we won't reuse any files
    const filesToReuse = trainingOptions.forceRetrain 
      ? [] 
      : existingFiles.filter(cf => {
          // If the file has a knowledge source ID
          if (cf.file.knowledgeSourceId) {
            // Get the last updated time for this knowledge source
            const lastUpdated = knowledgeSourceLastUpdated.get(cf.file.knowledgeSourceId);
            
            // If the knowledge source hasn't been updated since the file was created,
            // we can reuse the file
            if (lastUpdated && cf.file.createdAt > lastUpdated) {
              console.log(`Reusing file ${cf.file.name} for knowledge source ${cf.file.knowledgeSourceId}`);
              return true;
            }
          }
          
          return false;
        });
    
    // Add the OpenAI file IDs of files we're reusing
    for (const fileToReuse of filesToReuse) {
      fileIds.push(fileToReuse.file.openAIFileId);
    }
    
    // Set of knowledge source IDs that we've already processed
    const processedKnowledgeSources = new Set<string>(
      filesToReuse.map(cf => cf.file.knowledgeSourceId).filter(Boolean) as string[]
    );

    // Process each knowledge source that hasn't been processed yet
    for (const source of knowledgeSources) {
      // Skip if we've already processed this knowledge source
      if (processedKnowledgeSources.has(source.id)) {
        console.log(`Skipping knowledge source ${source.id} as it's already processed`);
        continue;
      }
      
      console.log(`Processing knowledge source: ${source.name} (${source.id})`);
      
      try {
        // Phase 3: Implement vector embedding for better retrieval
        // For each knowledge source, we'll create a combined file with all content
        // This helps with context and retrieval
        
        // Collect all content from this knowledge source
        const sourceContent = [];
        const sections = [];
        
        // 1. Process files from the knowledge source
        const files = await prisma.file.findMany({
          where: {
            knowledgeSourceId: source.id,
          },
        });
        
        console.log(`Found ${files.length} files for knowledge source ${source.id}`);
        
        // Upload each file to OpenAI
        for (const file of files) {
          try {
            console.log(`Uploading file: ${file.name}`);
            const fileId = await uploadFileToOpenAI(openai, file.blobUrl, file.name);
            fileIds.push(fileId);
            
            // Store the file in the database for future reuse
            await prisma.file.create({
              data: {
                userId: session.user.id,
                name: `${file.name} (processed)`,
                openAIFileId: fileId,
                blobUrl: file.blobUrl,
                knowledgeSourceId: source.id,
                ChatbotFiles: {
                  create: {
                    chatbotId: chatbotId,
                  },
                },
              },
            });
            
            console.log(`File uploaded successfully: ${fileId}`);
          } catch (fileError) {
            console.error(`Error uploading file ${file.name}:`, fileError);
            // Continue with other files even if one fails
          }
        }
        
        // 2. Process text content from the knowledge source
        const textContents = await prisma.textContent.findMany({
          where: {
            knowledgeSourceId: source.id,
          },
        });
        
        console.log(`Found ${textContents.length} text contents for knowledge source ${source.id}`);
        
        // Add text content to the source content array
        for (const text of textContents) {
          sourceContent.push({
            type: 'text',
            content: text.content,
          });
        }
        
        // 3. Process QA content from the knowledge source
        const qaContents = await prisma.qAContent.findMany({
          where: {
            knowledgeSourceId: source.id,
          },
        });
        
        console.log(`Found ${qaContents.length} QA contents for knowledge source ${source.id}`);
        
        // Add QA content to the source content array
        if (qaContents.length > 0) {
          sourceContent.push({
            type: 'qa',
            content: qaContents.map(qa => ({
              question: qa.question,
              answer: qa.answer,
            })),
          });
        }
        
        // 4. Process website content from the knowledge source
        const websiteContents = await prisma.websiteContent.findMany({
          where: {
            knowledgeSourceId: source.id,
          },
        });
        
        console.log(`Found ${websiteContents.length} website contents for knowledge source ${source.id}`);
        
        // Add website content to the source content array
        for (const website of websiteContents) {
          sourceContent.push({
            type: 'website',
            content: { url: website.url },
          });
        }
        
        // 5. Process catalog content from the knowledge source
        const catalogContents = await prisma.catalogContent.findMany({
          where: {
            knowledgeSourceId: source.id,
          },
          include: {
            products: true,
          },
        });
        
        console.log(`Found ${catalogContents.length} catalog contents for knowledge source ${source.id}`);
        
        // Add catalog content to the source content array
        for (const catalog of catalogContents) {
          sourceContent.push({
            type: 'catalog',
            content: {
              instructions: catalog.instructions,
              products: catalog.products.map(product => ({
                title: product.title,
                description: product.description,
                price: product.price,
                taxRate: product.taxRate,
                categories: product.categories,
              })),
            },
          });
        }
        
        // Phase 4: Advanced processing based on options
        if (!trainingOptions.optimizeForSpeed) {
          // If we're not optimizing for speed, we can do more advanced processing
          
          // 1. Process text content with chunking for better retrieval
          for (let i = 0; i < textContents.length; i++) {
            try {
              const text = textContents[i];
              console.log(`Processing text content ${i + 1}/${textContents.length} with chunking`);
              
              // Add the section for the table of contents
              sections.push({
                title: `Text Content ${i + 1}`,
                content: text.content,
              });
              
              // Process the text with chunking
              const chunkFileIds = await processTextWithChunking(
                openai,
                text.content,
                `text_content_${source.id}_${i + 1}.txt`,
                2000, // chunk size
                300   // overlap
              );
              
              // Add the chunk file IDs to the list
              fileIds.push(...chunkFileIds);
              
              console.log(`Text content processed with chunking: ${chunkFileIds.length} chunks`);
            } catch (textError) {
              console.error(`Error processing text content with chunking:`, textError);
            }
          }
          
          // 2. Create a table of contents for the knowledge source
          if (sections.length > 0) {
            try {
              console.log(`Creating table of contents for knowledge source ${source.id}`);
              const tocFileId = await createTableOfContents(
                openai,
                sections,
                `toc_${source.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
              );
              
              fileIds.push(tocFileId);
              console.log(`Table of contents created successfully: ${tocFileId}`);
            } catch (tocError) {
              console.error(`Error creating table of contents:`, tocError);
            }
          }
          
          // 3. Optimize the combined content for retrieval
          if (sourceContent.length > 0) {
            try {
              console.log(`Optimizing combined content for retrieval`);
              
              // Combine all content into a single string
              let combinedText = "";
              
              for (const content of sourceContent) {
                if (content.type === 'text') {
                  combinedText += content.content + "\n\n";
                } else if (content.type === 'qa') {
                  const qaContent = content.content as { question: string; answer: string }[];
                  for (const qa of qaContent) {
                    combinedText += `Q: ${qa.question}\nA: ${qa.answer}\n\n`;
                  }
                }
              }
              
              // Optimize the combined content for retrieval
              const optimizedFileId = await optimizeForRetrieval(
                openai,
                combinedText,
                `optimized_${source.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
              );
              
              fileIds.push(optimizedFileId);
              console.log(`Content optimized for retrieval: ${optimizedFileId}`);
            } catch (optimizeError) {
              console.error(`Error optimizing content for retrieval:`, optimizeError);
            }
          }
        } else {
          // If we're optimizing for speed, just create a combined file
          if (sourceContent.length > 0) {
            try {
              console.log(`Creating combined file for knowledge source ${source.id}`);
              const combinedFileId = await combineKnowledgeSources(
                openai,
                sourceContent as any,
                `combined_${source.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
              );
              
              fileIds.push(combinedFileId);
              
              // Store the combined file in the database for future reuse
              await prisma.file.create({
                data: {
                  userId: session.user.id,
                  name: `Combined: ${source.name}`,
                  openAIFileId: combinedFileId,
                  blobUrl: "", // No blob URL for combined files
                  knowledgeSourceId: source.id,
                  ChatbotFiles: {
                    create: {
                      chatbotId: chatbotId,
                    },
                  },
                },
              });
              
              console.log(`Combined file created successfully: ${combinedFileId}`);
            } catch (combineError) {
              console.error(`Error creating combined file for knowledge source ${source.id}:`, combineError);
            }
          }
        }
        
      } catch (sourceError) {
        console.error(`Error processing knowledge source ${source.id}:`, sourceError);
        // Continue with other knowledge sources even if one fails
      }
    }

    console.log(`Processed ${fileIds.length} files for the assistant`);

    // Prepare the instructions based on the agent's prompt
    const instructions = chatbot.prompt || "You are a helpful assistant.";
    
    // Get the model name from the model ID
    const modelName = chatbot.modelId 
      ? await getModelNameFromId(chatbot.modelId)
      : "gpt-4o-mini";

    // Update or create the assistant in OpenAI
    let assistantId = chatbot.openaiId;
    
    // Phase 4: Optimize the assistant configuration
    if (assistantExists && assistantId) {
      console.log(`Updating existing assistant ${assistantId}`);
      
      try {
        // Update the assistant with new files and instructions
        await openai.beta.assistants.update(assistantId, {
          name: chatbot.name,
          instructions: instructions,
          model: modelName,
          tools: [{ type: "file_search" }], // Enable file search for knowledge base
        });
        
        // Update the files separately to avoid API limitations
        if (fileIds.length > 0) {
          try {
            // Get current files attached to the assistant
            const currentFilesResponse = await openai.beta.assistants.files.list(assistantId);
            
            // Delete all existing files
            for (const file of currentFilesResponse.data) {
              await openai.beta.assistants.files.del(assistantId, file.id);
            }
            
            // Add new files
            for (const fileId of fileIds) {
              await openai.beta.assistants.files.create(assistantId, {
                file_id: fileId,
              });
            }
          } catch (fileError) {
            console.error("Error updating assistant files:", fileError);
            // Continue with the process even if file attachment fails
          }
        }
        
        console.log(`Assistant updated successfully`);
      } catch (updateError) {
        console.error(`Error updating assistant:`, updateError);
        throw updateError;
      }
    } else {
      console.log(`Creating a new assistant for chatbot ${chatbotId}`);
      
      try {
        // Create a new assistant
        const newAssistant = await openai.beta.assistants.create({
          name: chatbot.name,
          instructions: instructions,
          model: modelName,
          tools: [{ type: "file_search" }], // Enable file search for knowledge base
        });
        
        assistantId = newAssistant.id;
        
        // Add files to the assistant
        if (fileIds.length > 0) {
          try {
            for (const fileId of fileIds) {
              await openai.beta.assistants.files.create(assistantId, {
                file_id: fileId,
              });
            }
          } catch (fileError) {
            console.error("Error attaching files to assistant:", fileError);
            // Continue with the process even if file attachment fails
          }
        }
        
        console.log(`New assistant created: ${assistantId}`);
      } catch (createError) {
        console.error(`Error creating assistant:`, createError);
        throw createError;
      }
    }

    // Update the chatbot with the training results and assistant ID
    const updatedChatbot = await prisma.chatbot.update({
      where: { id: chatbotId },
      data: {
        openaiId: assistantId,
        lastTrainedAt: new Date() as any,
        trainingStatus: "success" as any,
        trainingMessage: "Agent trained successfully",
      },
    });

    return NextResponse.json({
      message: "Agent trained successfully",
      lastTrainedAt: updatedChatbot.lastTrainedAt || new Date(),
      status: updatedChatbot.trainingStatus || "success",
      assistantId: updatedChatbot.openaiId,
    });
  } catch (error) {
    console.error("Error training agent:", error);
    
    // Update the chatbot with the error status
    try {
      await prisma.chatbot.update({
        where: { id: params.chatbotId },
        data: {
          trainingStatus: "error" as any,
          trainingMessage: error instanceof Error ? error.message : "Unknown error occurred",
        },
      });
    } catch (updateError) {
      console.error("Error updating chatbot training status:", updateError);
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
} 