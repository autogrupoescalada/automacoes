
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();
  
  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .select('*')
    .eq('customer_phone', body.session_id)
    .single();

  if (chatError) {
    return NextResponse.json({ error: chatError.message }, { status: 500 });
  }

  const { error: messageError } = await supabase
    .from('messages_chats')
    .insert({
      chat_id: chat.id,
      message: body.message,
      sender: 'agent',
      agent_id: chat.agent_id
    });

  if (messageError) {
    return NextResponse.json({ error: messageError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
