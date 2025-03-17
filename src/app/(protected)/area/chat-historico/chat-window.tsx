"use client";

import { type Message } from "@/types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";

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

interface ChatWindowProps {
  messages: Message[];
  selectedChat?: string;
  onMessageSent: () => void;
}

export function ChatWindow({ messages, selectedChat, onMessageSent }: ChatWindowProps) {
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
        "https://autowebhook.escaladaecom.com.br/webhook/send-message",
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

  return (
    <Card className="h-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">
          {selectedChat ? `Chat com ${selectedChat}` : "Selecione um chat"}
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4 h-[calc(100vh-12rem)]">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.message.id || `msg-${index}`}
              className={`flex ${
                msg.message.type === "ai" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  msg.message.type === "ai"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div>{msg.message.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatMessageTimestamp(msg.message_timestamp)}
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
          <Button
            onClick={() => void handleSendMessage()}
            disabled={sending || !messageInput.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}
