export interface Message {
  id: string; // Baseado na tabela messages_chats
  chat_id: number;
  sender: "cliente" | "agent";
  message: string;
  agent_id: number;
  created_at: string;
}

export interface Conversation {
  id: string; // Baseado na tabela chats
  customer_phone: string;
  customer_name: string | null;
  agent_id: number;
  picture: string | null;
  tags: string[];
  status: "active" | "inactive"; // Assumindo possíveis valores de status
  created_at: string;
  updated_at: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface ConversationResponse {
  messages: Message[];
}

export interface LeadInfo {
  owner_id: string;
  owner_name: string;
  deal_status: string;
  created_at?: string;
  updated_at?: string;
  value?: number;
  pipeline?: string;
  stage?: string;
  tags: string[];
}

export interface LeadInfoResponse {
  success: boolean;
  data: LeadInfo;
}

export interface Collaborator {
  id: string; // Baseado na tabela agents
  phone: string;
  name: string;
  agent_type: "chatbot" | "human";
  created_at: string;
  updated_at: string;
}

export interface PredefinedMessage {
  id: string; // Baseado na tabela predefined_messages
  agent_id: number;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
}
