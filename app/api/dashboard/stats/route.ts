import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Define our own colors
const colorCombinations = [
  { text: 'text-fuchsia-800 dark:text-fuchsia-500', bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20' },
  { text: 'text-blue-800 dark:text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' },
  { text: 'text-pink-800 dark:text-pink-500', bg: 'bg-pink-100 dark:bg-pink-500/20' },
  { text: 'text-emerald-800 dark:text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
  { text: 'text-orange-800 dark:text-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/20' },
  { text: 'text-indigo-800 dark:text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
];

interface UserInquiry {
  id: string;
  email: string;
  name: string;
  initials: string;
  chatbotName: string;
  daysAgo: string;
  inquiry: string;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let totalAgents = 0;
    let totalFiles = 0;
    let messageCountLast30Days = 0;
    let messages = [];

    try {
      totalAgents = await db.chatbot.count({
        where: { userId: user.id },
      });
    } catch (error) {
      console.error('Error counting chatbots:', error);
    }

    try {
      totalFiles = await db.file.count({
        where: { userId: user.id },
      });
    } catch (error) {
      console.error('Error counting files:', error);
    }

    try {
      messageCountLast30Days = await db.message.count({
        where: {
          userId: user.id,
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
        },
      });

      messages = await db.message.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
        },
        select: {
          createdAt: true,
        },
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }

    const data = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      data.push({ name: formattedDate, total: 0 });
    }

    messages.forEach((message) => {
      const messageDate = message.createdAt.toISOString().split("T")[0];
      const dataEntry = data.find((entry) => entry.name === messageDate);
      if (dataEntry) {
        dataEntry.total++;
      }
    });

    data.reverse();

    // Get chatbot IDs first
    let chatbotIds = [];
    try {
      chatbotIds = await db.chatbot.findMany({
        where: { userId: user.id },
        select: { id: true },
      });
      console.log('Found chatbot IDs:', chatbotIds);
    } catch (error) {
      console.error('Error fetching chatbot IDs:', error);
    }

    // Fetch user inquiries
    let userInquiries: UserInquiry[]    = [];
    try {
      const inquiriesData = await db.clientInquiries.findMany({
        where: {
          chatbotId: { in: chatbotIds.map((chatbot) => chatbot.id) },
           deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          email: true,
          threadId: true,
          inquiry: true,
          createdAt: true,
          chatbotId: true,
          chatbot: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      console.log('Raw inquiries data:', inquiriesData);

      userInquiries = inquiriesData.map((inquiry) => {
        // Get username from email (everything before @)
    const emailUsername = inquiry.email.split('@')[0];
    // Capitalize first letter and clean up any numbers or special chars for display
    const nameToUse = emailUsername.replace(/[0-9_.-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Just use first letter for initial
    const initial = nameToUse.charAt(0).toUpperCase();
  
    const daysAgo = Math.floor((Date.now() - new Date(inquiry.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const daysAgoText = daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo}d ago`;
  
    // Use consistent color based on the initial letter
    const colorIndex = initial.charCodeAt(0) % colorCombinations.length;
    const color = colorCombinations[colorIndex];

    return {
      id: inquiry.id,
      name: nameToUse,
      initial: initial,
      textColor: color.text,
      bgColor: color.bg,
      email: inquiry.email,
      href: `/dashboard/chatbots/${inquiry.chatbotId}/inquiries`,  // Added proper href
      details: [
        {
          type: 'Agent',
          value: inquiry.chatbot?.name || 'Unknown Agent',  // Using optional chaining
        },
        {
          type: 'Date',
          value: daysAgoText,
        },
      ],
    };
  });

  console.log('Formatted user inquiries:', userInquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }

    // Fetch chatbot errors
    let chatbotErrors = [];
    try {
      const errors = await db.chatbotErrors.findMany({
        where: {
          chatbotId: { in: chatbotIds.map((chatbot) => chatbot.id) },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          chatbotId: true,
          threadId: true,
          errorMessage: true,
          createdAt: true,
        },
      });

      // Get chatbot names separately
      const chatbotNamesForIds = await db.chatbot.findMany({
        where: { 
          id: { in: errors.map(error => error.chatbotId) } 
        },
        select: { 
          id: true, 
          name: true 
        },
      });

      console.log('Raw errors data:', errors);

      chatbotErrors = errors.map(error => ({
        agent: chatbotNamesForIds.find(chatbot => chatbot.id === error.chatbotId)?.name || 'Unknown',
        chatbotId: error.chatbotId,
        threadId: error.threadId || 'N/A',
        error: error.errorMessage || 'Unknown error',
        date: new Date(error.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      console.log('Formatted errors:', chatbotErrors);
    } catch (error) {
      console.error('Error fetching chatbot errors:', error);
    }

    return NextResponse.json({
      totalAgents,
      totalFiles,
      messageCountLast30Days,
      messagesPerDay: data,
      userInquiries,
      chatbotErrors,
    });

  } catch (error) {
    console.error('Main error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}