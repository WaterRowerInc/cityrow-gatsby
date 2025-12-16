import axios, { AxiosInstance } from "axios";

export class HttpLambdaClient {
  private http: AxiosInstance;

  constructor(serverBaseUrl: string) {
    this.http = axios.create({
      baseURL: serverBaseUrl,
      headers: { "Content-Type": "application/json" },
    });
  }

  post = async (url: string, jsonBody: object = {}): Promise<any> => {
    try {
      return await this.http.post(url, JSON.stringify(jsonBody));
    } catch (e) {
      this.handleError(e);
    }
  };

  private handleError = (e: any) => {
    throw e;
  };
}
