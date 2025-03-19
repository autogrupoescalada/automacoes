
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const salerId = searchParams.get('salerId');
  
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('agent_id', salerId)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ conversations: data });
}
