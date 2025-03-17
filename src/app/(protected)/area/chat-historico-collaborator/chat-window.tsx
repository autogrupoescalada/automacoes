"use client";

import { type Message } from "@/types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useEffect } from "react";

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
}

export function ChatWindow({ messages, selectedChat }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    </Card>
  );
}
