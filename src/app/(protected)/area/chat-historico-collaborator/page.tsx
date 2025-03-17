"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import para capturar parâmetros da URL
import { ChatList } from "./chat-list";
import { ChatWindow } from "./chat-window";
import { type Conversation, type Message } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);

  const searchParams = useSearchParams();
  const salerPhone = searchParams.get("phone"); // Captura o 'id' da URL como 'saler_phone'

  const fetchConversations = async () => {
    try {
      if (!salerPhone) {
        console.warn("Nenhum 'saler_phone' encontrado na URL.");
        return;
      }

      const response = await fetch(
        `https://autowebhook.escaladaecom.com.br/webhook/collaborators-conversations?saler_phone=${salerPhone}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
        }
      );
      const data = await response.json();
      if (data.conversations && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
    }
  };

  const fetchMessages = async (phone: string) => {
    try {
      const response = await fetch(
        `https://autowebhook.escaladaecom.com.br/webhook/collaborator-conversation-id?session_id=${phone}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
        }
      );
      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  const handleSelectChat = async (phone: string) => {
    setSelectedChat(phone);
    setMessages([]);
    await fetchMessages(phone);
  };

  useEffect(() => {
    if (salerPhone) {
      void fetchConversations();
      const conversationsInterval = setInterval(() => {
        void fetchConversations();
      }, 60000);
      return () => clearInterval(conversationsInterval);
    }
  }, [salerPhone]);

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
    <main className="flex h-screen bg-gray-100">
      <div className={`w-full md:w-1/3 ${selectedChat ? "hidden md:block" : "block"}`}>
        <ChatList
          conversations={conversations}
          onSelectChat={handleSelectChat}
          selectedChat={selectedChat}
        />
      </div>

      <div className={`w-full md:flex-1 ${!selectedChat ? "hidden md:block" : "block"}`}>
        <div className="h-full flex flex-col">
          {selectedChat && (
            <div className="bg-white p-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChat(undefined)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>
          )}
          <div className="flex-1">
            <ChatWindow
              messages={messages}
              selectedChat={selectedChat}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
