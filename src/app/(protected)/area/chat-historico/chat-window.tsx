"use client";

import { type Message } from "@/types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

function formatMessageTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  return (
    date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

type PredefinedMessage = {
  id: number;
  agent_id: number;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
};

interface ChatWindowProps {
  messages: Message[];
  selectedChat?: string;
  onMessageSent: () => void;
  predefinedMessages: PredefinedMessage[];
}

export function ChatWindow({ messages, selectedChat, onMessageSent, predefinedMessages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || sending) return;

    setSending(true);
    try {
      const response = await fetch(
        "https://autowebhook.escaladaecom.com.br/webhook/send-message-sb",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
          body: JSON.stringify({
            session_id: selectedChat,
            message: messageInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessageInput("");
      onMessageSent();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  const handleSelectPredefinedMessage = (message: string) => {
    setMessageInput(message);
  };

  // Function to truncate message preview
  const truncateMessage = (message: string, maxLength = 30) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };


  return (
    <Card className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">
          {selectedChat ? `Chat com ${selectedChat}` : "Selecione um chat"}
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4 h-[calc(100vh-12rem)]">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id || `msg-${index}`}
              className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.sender === "agent"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                <div>{msg.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatMessageTimestamp(msg.created_at)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {selectedChat && (
        <div className="p-4 border-t flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={sending}
            className="flex-1"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-64 p-0">
              <div className="py-2">
                <h3 className="px-3 py-1 text-sm font-medium text-gray-700">Mensagens Predefinidas</h3>
                <ScrollArea className="h-60">
                  {predefinedMessages.length > 0 ? (
                    <div className="space-y-1">
                      {predefinedMessages.map((item) => (
                        <div
                          key={item.id}
                          className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleSelectPredefinedMessage(item.message)}
                        >
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{truncateMessage(item.message)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Nenhuma mensagem predefinida
                    </div>
                  )}
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => void handleSendMessage()}
            disabled={sending || !messageInput.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}