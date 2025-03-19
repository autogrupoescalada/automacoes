import { NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import type { Database } from "@/types/database-types";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Define a schema for client data validation
const clientSchema = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido").nullable().optional(),
  phone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Create a type from the schema
type ClientInput = z.infer<typeof clientSchema>;

export async function GET() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Authentication error:", sessionError);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 },
      );
    }

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch clients
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .order("full_name", { ascending: true });

    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      return NextResponse.json(
        { error: "Failed to fetch clients" },
        { status: 500 },
      );
    }

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Authentication error:", sessionError);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 },
      );
    }

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client data from request
    const rawData = (await request.json()) as Record<string, unknown>;

    // Validate client data
    const validationResult = clientSchema.safeParse(rawData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid client data",
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const clientData: ClientInput = validationResult.data;

    // Insert new client
    const { data: insertData, error: insertError } = await supabase
      .from("clients")
      .insert<Database["public"]["Tables"]["clients"]["Insert"]>([
        {
          full_name: clientData.full_name,
          email: clientData.email,
          phone: clientData.phone,
          notes: clientData.notes,
        },
      ])
      .select<string, Database["public"]["Tables"]["clients"]["Row"]>()
      .single();

    if (insertError) {
      console.error("Error creating client:", insertError);
      return NextResponse.json(
        { error: "Failed to create client" },
        { status: 500 },
      );
    }

    if (!insertData) {
      return NextResponse.json(
        { error: "No data returned after creating client" },
        { status: 500 },
      );
    }

    // Return the client data
    return NextResponse.json(
      {
        client: insertData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
