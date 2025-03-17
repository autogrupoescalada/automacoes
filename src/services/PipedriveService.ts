import axios from "axios";
import FormData from "form-data";

export class PipedriveService {
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.baseUrl = "https://api.pipedrive.com/v1";
  }

  public async addNoteToDeal(
    dealId: number,
    noteContent: string,
  ): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/notes`,
        {
          content: noteContent,
          deal_id: dealId,
        },
        {
          params: {
            api_token: this.apiToken,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async attachFileToDeal(
    dealId: number,
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<void> {
    try {
      const form = new FormData();
      form.append("file", fileBuffer, fileName);
      form.append("deal_id", dealId.toString());

      await axios.post(`${this.baseUrl}/files`, form, {
        headers: {
          ...form.getHeaders(),
        },
        params: {
          api_token: this.apiToken,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
