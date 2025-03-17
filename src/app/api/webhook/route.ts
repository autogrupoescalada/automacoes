import { NextResponse } from "next/server";
import { OpenAIService } from "../../../services/OpenAIService";
import { PipedriveService } from "../../../services/PipedriveService";
import { type MeetingTranscript } from "../../../interfaces/MeetingTranscript";

const openAIService = new OpenAIService(process.env.OPENAI_API_KEY!);
const pipedriveService = new PipedriveService(process.env.PIPEDRIVE_API_TOKEN!);

// Exportar a função POST
export async function POST(req: Request) {
  const { title, transcript, summary } =
    (await req.json()) as MeetingTranscript;

  const transcriptText = transcript.speaker_blocks
    .map((block) => `${block.speaker.name}: ${block.words}`)
    .join("\n");

  try {
    // Extrair insights da transcrição
    const insights = await openAIService.extractInsights(transcriptText);
    const dealId = Number(title);

    // Criar um buffer a partir do resumo
    const summaryBuffer = Buffer.from(summary, "utf-8");

    // Enviar o resumo como um arquivo para o Pipedrive
    await pipedriveService.attachFileToDeal(
      dealId,
      summaryBuffer,
      `Resumo-${title}.txt`,
    );

    // Adicionar a nota ao negócio
    await pipedriveService.addNoteToDeal(dealId, insights);
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro ao processar a transcrição ou adicionar a nota." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Webhook recebido e processado com sucesso!",
  });
}
