
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .select('*')
    .eq('customer_phone', params.id)
    .single();

  if (chatError) {
    return NextResponse.json({ error: chatError.message }, { status: 500 });
  }

  const { data: messages, error: messagesError } = await supabase
    .from('messages_chats')
    .select('*')
    .eq('chat_id', chat.id)
    .order('created_at', { ascending: true });

  if (messagesError) {
    return NextResponse.json({ error: messagesError.message }, { status: 500 });
  }

  return NextResponse.json({ chat, messages });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('customer_phone', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
