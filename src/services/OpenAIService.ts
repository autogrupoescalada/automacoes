import { OpenAI } from "openai";
import { prompt } from "../utils/prompt";

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  public async extractInsights(transcript: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: transcript,
          },
        ],
      });

      return response?.choices[0]?.message?.content ?? "";
    } catch (error) {
      console.error("Erro ao chamar a API do OpenAI:", error);
      throw error;
    }
  }
}
