"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatList } from "./chat-list";
import { ChatWindow } from "./chat-window";
import { type Conversation, type Message } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type PredefinedMessage = {
  id: number;
  agent_id: number;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
};

export default function ChatHistoricoPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>();
  const [predefinedMessages, setPredefinedMessages] = useState<PredefinedMessage[]>([]);
  const searchParams = useSearchParams();
  const salerId = searchParams.get('id');

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/chats?salerId=${salerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleSelectChat = (sessionId: string) => {
    setSelectedChat(sessionId);
    void fetchMessages(sessionId);
  };

  const handleDeleteChat = async (phone: string) => {
    try {
      const response = await fetch(`/api/chat/${phone}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.session_id !== phone));
        if (selectedChat === phone) {
          setSelectedChat(undefined);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    void fetchConversations();
    const conversationsInterval = setInterval(() => {
      void fetchConversations();
    }, 60000);

    return () => clearInterval(conversationsInterval);
  }, [salerId]);

  useEffect(() => {
    let messagesInterval: NodeJS.Timeout;
    if (selectedChat) {
      messagesInterval = setInterval(() => {
        void fetchMessages(selectedChat);
      }, 10000);
    }
    return () => {
      if (messagesInterval) {
        clearInterval(messagesInterval);
      }
    };
  }, [selectedChat]);

  return (
    <main className="flex h-screen">
      <div className={`w-full md:w-1/3 ${selectedChat ? "hidden md:block" : "block"}`}>
        <ChatList
          conversations={conversations}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          selectedChat={selectedChat}
          predefinedMessages={predefinedMessages}
        />
      </div>

      <div className={`w-full md:flex-1 ${!selectedChat ? "hidden md:block" : "block"}`}>
        <div className="h-full flex flex-col">
          {selectedChat && (
            <div className="p-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChat(undefined)}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
          )}
          <div className="flex-1">
            <ChatWindow
              messages={messages}
              selectedChat={selectedChat}
              onMessageSent={() => selectedChat && fetchMessages(selectedChat)}
              predefinedMessages={predefinedMessages}
            />
          </div>
        </div>
      </div>
    </main>
  );
}