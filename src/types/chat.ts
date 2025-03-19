export interface Message {
  id: string;
  chat_id: string;
  sender: 'cliente' | 'agent';
  message: string;
  agent_id: string;
  created_at: string;
};


export interface Conversation {
  session_id: string;
  name_contact: string;
  messages: Message[];
  hasNewMessages?: boolean;
  message_timestamp: string;
  tags: string[];
  picture: string;
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
  tags: string[]
}

export interface LeadInfoResponse {
  success: boolean;
  data: LeadInfo;
}

export interface Collaborator {
  name_contact: string;
  saler_id: string;
}