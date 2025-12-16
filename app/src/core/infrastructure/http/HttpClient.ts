import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { SessionStorage } from "../../domain/auth/SessionStorage";

export class HttpClient {
  private http: AxiosInstance;
  private sessionStorage: SessionStorage;
  private readonly serverToken?: string;

  constructor(serverBaseUrl: string, sessionStorage: SessionStorage, serverToken?: string) {
    this.sessionStorage = sessionStorage;
    this.http = axios.create({
      baseURL: serverBaseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.serverToken = serverToken;
  }

  get = async (url: string): Promise<any> => {
    try {
      return await this.http.get(url, await this.configWithAuthHeader());
    } catch (e) {
      this.handleError(e);
    }
  };

  post = async (url: string, jsonBody: any = {}): Promise<any> => {
    try {
      return await this.http.post(url, JSON.stringify(jsonBody), await this.configWithAuthHeader());
    } catch (e) {
      this.handleError(e);
    }
  };

  put = async (url: string, jsonBody: any = {}): Promise<any> => {
    try {
      return await this.http.put(url, JSON.stringify(jsonBody), await this.configWithAuthHeader());
    } catch (e) {
      this.handleError(e);
    }
  };

  delete = async (url: string): Promise<any> => {
    try {
      return await this.http.delete(url, await this.configWithAuthHeader());
    } catch (e) {
      this.handleError(e);
    }
  };

  async configWithAuthHeader(): Promise<AxiosRequestConfig> {
    if (this.serverToken) {
      return {
        headers: {
          Authorization: `Bearer ${this.serverToken}`,
        },
      };
    }
    if (!(await this.sessionStorage.hasSession())) {
      return {};
    }

    const session = await this.sessionStorage.get();
    return {
      headers: {
        Authorization: `jwt ${session}`,
      },
    };
  }

  private handleError = (e: any) => {
    throw e;
  };
}
