"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { type Conversation } from "@/types";
import { Card } from "@/components/ui/card";
import { User2, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import axios from "axios";

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
  onDeleteChat: (phone: string) => void;
  selectedChat?: string;
}

export function ChatList({ conversations, onSelectChat, onDeleteChat, selectedChat }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [leadInfo, setLeadInfo] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchLeadInfo = async (session_id: string) => {
    try {
      const response = await axios.get(`https://autowebhook.escaladaecom.com.br/webhook/get-deal`, {
        params: { session_id },
        headers: {
          Authorization: "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a"
        }
      });
      setLeadInfo(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar informações do lead", error);
    }
  };

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
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedChat === contact.session_id ? "bg-primary/10" : "hover:bg-muted"
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
              <div className="flex flex-col items-end">
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(contact.message_timestamp)}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => fetchLeadInfo(contact.session_id)}>Mais Informações</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500" onClick={() => onDeleteChat(contact.session_id)}>Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
      {/* Modal */}
      {modalOpen && leadInfo && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogTitle>Informações do Lead</DialogTitle>
            <div className="mt-2 space-y-2">
              <p><strong>ID do Dono:</strong> {leadInfo.owner_id}</p>
              <p><strong>Nome do Dono:</strong> {leadInfo.owner_name}</p>
              <p><strong>Status do Negócio:</strong> {leadInfo.deal_status}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
