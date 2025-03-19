import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("id");

  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("predefined_messages")
    .select("*")
    .eq("agent_id", agentId)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();

  const { error } = await supabase
    .from("predefined_messages")
    .update({ message: body.message })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
