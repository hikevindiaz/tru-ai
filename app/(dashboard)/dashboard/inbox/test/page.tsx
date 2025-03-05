'use client'

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import DashboardSidebar from "@/components/DashboardSidebar";
import EmptyState from "@/components/ui/empty-state";
import { Icons } from "@/components/icons";

const messagesList = [
  { id: 1, name: "John Doe", preview: "Hey, how are you?", time: "10:30 AM" },
  { id: 2, name: "Jane Smith", preview: "Let's meet at 5!", time: "9:15 AM" },
  { id: 3, name: "Alice Brown", preview: "Can you check the report?", time: "Yesterday" },
];

const chatData = {
  1: [
    { sender: "John Doe", message: "Hey, how are you?", type: "received" },
    { sender: "Me", message: "I'm good! How about you?", type: "sent" },
    { sender: "John Doe", message: "Doing great, thanks!", type: "received" },
  ],
  2: [
    { sender: "Jane Smith", message: "Let's meet at 5!", type: "received" },
    { sender: "Me", message: "Sounds good!", type: "sent" },
  ],
  3: [
    { sender: "Alice Brown", message: "Can you check the report?", type: "received" },
    { sender: "Me", message: "Sure! I'll review it now.", type: "sent" },
  ],
};

const InboxPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const payload = {
      threadId: selectedChat ? selectedChat.toString() : undefined,
      message: newMessage.trim(),
    };
    console.log("Sending message payload:", payload);

    if (selectedChat) {
      if (chatData[selectedChat]) {
        chatData[selectedChat].push({
          sender: "Me",
          message: newMessage.trim(),
          type: "sent",
        });
      } else {
        chatData[selectedChat] = [
          { sender: "Me", message: newMessage.trim(), type: "sent" },
        ];
      }
    }

    setNewMessage("");
  };

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar
        title="Inbox"
        phoneNumbers={messagesList.map((msg) => ({
          id: msg.id.toString(),
          number: msg.name,
          agent: msg.preview,
        }))}
        selectedPhoneNumber={
          selectedChat
            ? {
                id: selectedChat.toString(),
                number:
                  messagesList.find((msg) => msg.id === selectedChat)?.name ||
                  "",
                agent:
                  messagesList.find((msg) => msg.id === selectedChat)
                    ?.preview || "",
              }
            : null
        }
        setSelectedPhoneNumber={(item) =>
          setSelectedChat(item ? parseInt(item.id) : null)
        }
        onAdd={() => {}}
      />

      {/* Right Section - Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-300 bg-white dark:bg-gray-900 flex items-center">
              <Avatar size="sm" src="https://via.placeholder.com/50" />
              <div className="ml-3">
                <h3 className="font-medium">
                  {messagesList.find((msg) => msg.id === selectedChat)?.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Thread ID: {selectedChat}
                </p>
              </div>
            </div>

            {/* Chat Body */}
            <Card className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-950 shadow-none">
              <CardBody>
                {chatData[selectedChat].map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.type === "sent" ? "justify-end" : "justify-start"
                    } mb-3`}
                  >
                    <div
                      className={`p-4 rounded-xl max-w-sm ${
                        chat.type === "sent"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-300 bg-white dark:bg-gray-900 flex items-center">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mr-3"
              />
              <Button color="blue" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Icons.speech className="h-12 w-12 text-blue-500" />}
            title="No Conversation Selected"
            description="Select a conversation from the sidebar to view the chat thread."
          />
        )}
      </div>
    </div>
  );
};

export default InboxPage;
