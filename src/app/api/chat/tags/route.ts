
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();

  const { error } = await supabase
    .from('chats')
    .update({ tags: body.tags })
    .eq('customer_phone', body.session_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
