export interface Message {
  message: {
    id: string;
    type: 'ai' | 'user';
    content: string;
    additional_kwargs: Record<string, any>;
    response_metadata: Record<string, any>;
  };
  message_timestamp: string;
}


export interface Conversation {
  session_id: string;
  name_contact: string;
  messages: Message[];
  hasNewMessages?: boolean;
  message_timestamp: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface ConversationResponse {
  messages: Message[];
} 