"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { type Conversation, type LeadInfo, type Collaborator } from "@/types";
import { Card } from "@/components/ui/card";
import { User2, Search, MoreVertical, Tag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

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

// Map tag names to their corresponding colors
const TAG_COLORS = {
  Quente: "bg-red-500",
  Morno: "bg-yellow-500",
  Frio: "bg-blue-500",
  "Call Agendada": "bg-green-500",
};

// Available tags
const AVAILABLE_TAGS = ["Quente", "Morno", "Frio", "Call Agendada"];

interface ChatListProps {
  conversations: Conversation[];
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  selectedChat?: string;
  predefinedMessages: PredefinedMessage[];
}

type PredefinedMessage = {
  id: number;
  agent_id: number;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
};

export function ChatList({
  conversations,
  onSelectChat,
  onDeleteChat,
  selectedChat,
  predefinedMessages,
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [isUpdatingOwner, setIsUpdatingOwner] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUpdatingTags, setIsUpdatingTags] = useState(false);
  const [tagFilterOpen, setTagFilterOpen] = useState(false);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [chatConfigModalOpen, setChatConfigModalOpen] = useState(false);
  const [chatConfigName, setChatConfigName] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isUpdatingChat, setIsUpdatingChat] = useState(false);

  // New states for predefined messages
  const [predefinedMessagesModalOpen, setPredefinedMessagesModalOpen] =
    useState(false);
  const [editingMessage, setEditingMessage] =
    useState<PredefinedMessage | null>(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");
  const [isUpdatingMessage, setIsUpdatingMessage] = useState(false);

  const fetchCollaborators = async () => {
    try {
      console.log("Buscando chats...");
      const response = await fetch("/api/agents");

      if (!response.ok) {
        throw new Error(
          `Erro HTTP ${response.status} - ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);

      setCollaborators(data.agents || []);
    } catch (error) {
      console.error("Erro ao buscar chats:", error);
    }
  };

  useEffect(() => {
    const loadCollaborators = async () => {
      await fetchCollaborators();
    };

    loadCollaborators().catch((error) =>
      console.error("Erro ao buscar colaboradores:", error),
    );
  }, []);

  const fetchLeadInfo = async (session_id: string) => {
    setIsLoading(true);
    setCurrentSessionId(session_id);
    try {
      const response = await fetch(
        `https://autowebhook.escaladaecom.com.br/webhook/get-deal?session_id=${session_id}`,
        {
          headers: {
            Authorization: "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lead information");
      }

      const data = await response.json();
      setLeadInfo(data);
      setSelectedCollaborator(data.owner_id || "");
      setSelectedTags(data.tags || []);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching lead information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOwner = async () => {
    if (!selectedCollaborator || !currentSessionId) return;

    console.log("Atualizando responsável para:", selectedCollaborator);

    setIsUpdatingOwner(true);
    try {
      const response = await fetch(
        "https://autowebhook.escaladaecom.com.br/webhook/owner-deal",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
          body: JSON.stringify({
            session_id: currentSessionId,
            owner_id: selectedCollaborator,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar responsável");
      }

      console.log("Responsável atualizado com sucesso!");
      await fetchLeadInfo(currentSessionId);
    } catch (error) {
      console.error("Erro ao atualizar responsável:", error);
    } finally {
      setIsUpdatingOwner(false);
    }
  };

  const updateTags = async () => {
    if (!currentSessionId) return;

    console.log("Atualizando tags para:", selectedTags);

    setIsUpdatingTags(true);
    try {
      const response = await fetch(
        "https://autowebhook.escaladaecom.com.br/webhook/update-tags",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
          body: JSON.stringify({
            session_id: currentSessionId,
            tags: selectedTags,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar tags");
      }

      console.log("Tags atualizadas com sucesso!");
      await fetchLeadInfo(currentSessionId);
    } catch (error) {
      console.error("Erro ao atualizar tags:", error);
    } finally {
      setIsUpdatingTags(false);
    }
  };

  const openChatConfigModal = (chatId: string, chatName: string) => {
    setCurrentChatId(chatId);
    setChatConfigName(chatName);
    setChatConfigModalOpen(true);
  };

  const updateChatConfig = async () => {
    if (!currentChatId || chatConfigName.trim() === "") return;

    setIsUpdatingChat(true);
    try {
      const response = await fetch(
        "https://autowebhook.escaladaecom.com.br/webhook/update-chat",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
          body: JSON.stringify({
            chat_id: currentChatId,
            name_contact: chatConfigName,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar chat");
      }

      console.log("Chat atualizado com sucesso!");
      setChatConfigModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar chat:", error);
    } finally {
      setIsUpdatingChat(false);
    }
  };

  // Function to update predefined message
  const updatePredefinedMessage = async () => {
    if (!editingMessage) return;

    setIsUpdatingMessage(true);
    try {
      const response = await fetch(
        `https://autowebhook.escaladaecom.com.br/webhook/predefined_messages-update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 7cVxO8sPdL2eK1zQrT5wX9uB0mN3jF4a",
          },
          body: JSON.stringify({
            id: editingMessage.id,
            message: editedMessageContent,
            name: editingMessage.name, // Keep the original name
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar mensagem predefinida");
      }

      console.log("Mensagem predefinida atualizada com sucesso!");
      // Here you would typically refresh the predefined messages list
      // This would require a function to be passed from the parent component
      setEditingMessage(null);
    } catch (error) {
      console.error("Erro ao atualizar mensagem predefinida:", error);
    } finally {
      setIsUpdatingMessage(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const toggleTagFilter = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const editMessage = (message: PredefinedMessage) => {
    setEditingMessage(message);
    setEditedMessageContent(message.message);
  };

  // Function to render tag indicators based on tags array
  const renderTagIndicators = (tags?: string[]) => {
    if (!tags || tags.length === 0) return null;

    return (
      <div className="mt-1 flex gap-1">
        {tags.map((tag, index) => {
          const tagColor =
            TAG_COLORS[tag as keyof typeof TAG_COLORS] || "bg-gray-500";
          return (
            <div
              key={`${tag}-${index}`}
              className={`${tagColor} h-2 w-2 rounded-full`}
              title={tag}
            />
          );
        })}
      </div>
    );
  };

  const filteredConversations = conversations.filter((contact) => {
    if (!contact) return false;

    const searchLower = searchTerm.toLowerCase();
    const nameMatch = contact.customer_name
      ? contact.customer_name.toLowerCase().includes(searchLower)
      : false;
    const nameContactMatch = contact.customer_name
      ? contact.customer_name.toLowerCase().includes(searchLower)
      : false;
    const sessionMatch = contact.customer_phone
      ? contact.customer_phone.toLowerCase().includes(searchLower)
      : false;
    const matchesSearch = nameMatch || nameContactMatch || sessionMatch;

    // If no tag filters are applied, only apply search filter
    if (tagFilters.length === 0) {
      return matchesSearch;
    }

    // Apply both search and tag filters
    const hasAllTags = tagFilters.every((tag) =>
      contact.tags ? contact.tags.includes(tag) : false,
    );

    return matchesSearch && hasAllTags;
  });

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">Conversas</h2>

        {/* New Settings Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setPredefinedMessagesModalOpen(true)}
            >
              Mensagens Predefinidas
            </DropdownMenuItem>
            {/* You can add more settings options here */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-b p-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Buscar por nome ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tag filter section */}
        <div className="mb-3">
          <Button
            variant="outline"
            size="sm"
            className="flex w-full items-center gap-2"
            onClick={() => setTagFilterOpen(!tagFilterOpen)}
          >
            <Tag className="h-4 w-4" />
            <span>Filtrar por tags</span>
            {tagFilters.length > 0 && (
              <div className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {tagFilters.length}
              </div>
            )}
          </Button>

          {tagFilterOpen && (
            <div className="mt-2 rounded-md border p-2">
              <div className="mb-2 text-sm font-medium">Filtrar por tags:</div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = tagFilters.includes(tag);
                  const tagColor =
                    TAG_COLORS[tag as keyof typeof TAG_COLORS] || "bg-gray-500";
                  const tagOpacity = isSelected ? "opacity-100" : "opacity-50";
                  const textColor =
                    tag === "Morno" ? "text-black" : "text-white";
                  return (
                    <button
                      key={tag}
                      className={`${tagColor} ${tagOpacity} ${textColor} cursor-pointer rounded-full px-2 py-1 text-xs`}
                      onClick={() => toggleTagFilter(tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              {tagFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-xs"
                  onClick={() => setTagFilters([])}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Active filters display */}
        {tagFilters.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            <span className="text-xs text-muted-foreground">
              Filtros ativos:
            </span>
            {tagFilters.map((tag) => {
              const tagColor =
                TAG_COLORS[tag as keyof typeof TAG_COLORS] || "bg-gray-500";
              const textColor = tag === "Morno" ? "text-black" : "text-white";
              return (
                <span
                  key={tag}
                  className={`${tagColor} ${textColor} rounded-full px-1.5 py-0.5 text-xs`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <ScrollArea className="h-[calc(86vh-10rem)]">
        <div className="p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((contact) => (
              <div
                key={contact.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${selectedChat === contact.id
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                  }`}
              >
                <div
                  className="flex flex-1 items-center gap-3"
                  onClick={() => onSelectChat(contact.id)}
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {contact.picture ? (
                      <Image
                        src={contact.picture}
                        alt={contact.customer_name || "Perfil"}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <User2 className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="mb-1 font-medium leading-none">
                      {contact.customer_name ||
                        contact.customer_name ||
                        "Desconhecido"}
                    </div>
                    {renderTagIndicators(contact.tags)}
                    <div className="truncate text-sm text-muted-foreground">
                      {contact.customer_phone || contact.customer_phone}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(contact.updated_at)}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        openChatConfigModal(
                          contact.id,
                          contact.customer_name || "Desconhecido",
                        )
                      }
                    >
                      Configuração
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => fetchLeadInfo(contact.customer_phone)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Carregando..." : "Informações do Lead"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDeleteChat(contact.id)}
                    >
                      Excluir Conversa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma conversa encontrada com os filtros atuais.
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Lead Info Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações do Lead</DialogTitle>
          </DialogHeader>
          {leadInfo && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex flex-col gap-2 border-b py-2">
                  <span className="font-medium">Responsável Atual</span>
                  <span className="text-sm text-muted-foreground">
                    {leadInfo.owner_name || "Não definido"}
                  </span>
                  <span className="mt-4 font-medium">Alterar Responsável</span>
                  <Select
                    value={selectedCollaborator || ""}
                    onValueChange={(value) => {
                      console.log("Novo responsável selecionado:", value);
                      setSelectedCollaborator(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um responsável">
                        {collaborators.find(
                          (c) => c.id === selectedCollaborator,
                        )?.name ?? "Selecione um responsável"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {collaborators.map((collaborator, index) => (
                        <SelectItem
                          key={collaborator.id || `collaborator-${index}`}
                          value={collaborator.id}
                        >
                          {collaborator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={updateOwner}
                    disabled={
                      isUpdatingOwner ||
                      selectedCollaborator === leadInfo.owner_id
                    }
                  >
                    {isUpdatingOwner ? "Atualizando..." : "Alterar Responsável"}
                  </Button>
                </div>

                {/* Tags section */}
                <div className="flex flex-col gap-2 border-b py-2">
                  <span className="font-medium">Tags</span>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {selectedTags.length > 0 ? (
                      selectedTags.map((tag, index) => {
                        const tagColor =
                          TAG_COLORS[tag as keyof typeof TAG_COLORS] ||
                          "bg-gray-500";
                        const textColor =
                          tag === "Morno" ? "text-black" : "text-white";
                        return (
                          <span
                            key={`${tag}-${index}`}
                            className={`${tagColor} ${textColor} rounded-full px-2 py-1 text-xs`}
                          >
                            {tag}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Nenhuma tag selecionada
                      </span>
                    )}
                  </div>

                  <span className="font-medium">Gerenciar Tags</span>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      const tagColor =
                        TAG_COLORS[tag as keyof typeof TAG_COLORS] ||
                        "bg-gray-500";
                      const tagOpacity = isSelected
                        ? "opacity-100"
                        : "opacity-50";
                      const textColor =
                        tag === "Morno" ? "text-black" : "text-white";
                      return (
                        <button
                          key={tag}
                          className={`${tagColor} ${tagOpacity} ${textColor} cursor-pointer rounded-full px-2 py-1 text-xs`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <Button onClick={updateTags} disabled={isUpdatingTags}>
                    {isUpdatingTags ? "Atualizando..." : "Atualizar Tags"}
                  </Button>
                </div>

                <div className="flex justify-between border-b py-2">
                  <span className="font-medium">Status</span>
                  <span className="capitalize">{leadInfo.deal_status}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Configuration Modal */}
      <Dialog open={chatConfigModalOpen} onOpenChange={setChatConfigModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuração do Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Nome do Chat
            </label>
            <Input
              value={chatConfigName}
              onChange={(e) => setChatConfigName(e.target.value)}
            />
            <Button
              onClick={updateChatConfig}
              disabled={isUpdatingChat}
              className="w-full"
            >
              {isUpdatingChat ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Predefined Messages Modal */}
      <Dialog
        open={predefinedMessagesModalOpen}
        onOpenChange={setPredefinedMessagesModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mensagens Predefinidas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {predefinedMessages.length > 0 ? (
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {predefinedMessages.map((msg) => (
                  <div key={msg.id} className="rounded-lg border p-3">
                    <div className="mb-1 font-medium">{msg.name}</div>
                    {editingMessage?.id === msg.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedMessageContent}
                          onChange={(e) =>
                            setEditedMessageContent(e.target.value)
                          }
                          className="w-full rounded-md border p-2"
                          rows={4}
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={updatePredefinedMessage}
                            disabled={isUpdatingMessage}
                          >
                            {isUpdatingMessage ? "Salvando..." : "Salvar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingMessage(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="whitespace-pre-wrap text-sm text-gray-600">
                          {msg.message}
                        </p>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button size="sm" onClick={() => editMessage(msg)}>
                            Editar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p>Nenhuma mensagem predefinida encontrada.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
