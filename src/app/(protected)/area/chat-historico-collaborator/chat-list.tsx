"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { type Conversation } from "@/types";
import { Card } from "@/components/ui/card";
import { User2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function formatTimestamp(timestamp?: string): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString();
  }
}

interface ChatListProps {
  conversations: Conversation[];
  onSelectChat: (phone: string) => void;
  selectedChat?: string;
}

export function ChatList({ conversations, onSelectChat, selectedChat }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name_contact?.toLowerCase().includes(searchLower) ||
      contact.session_id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card className="h-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Conversas</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-2">
          {filteredConversations.map((contact) => (
            <div
              key={contact.session_id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChat === contact.session_id ? "bg-primary/10" : "hover:bg-muted"
              }`}
            >
              <div
                className="flex flex-1 items-center gap-3"
                onClick={() => onSelectChat(contact.session_id)}
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User2 className="h-5 w-5" />
                  {contact.hasNewMessages && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium leading-none mb-1">
                    {contact.name_contact || "Desconhecido"}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {contact.session_id}
                  </div>
                </div>
              </div>
              {/* Exibe a hora ou data da última mensagem */}
              <div className="flex flex-col items-end">
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(contact.message_timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
