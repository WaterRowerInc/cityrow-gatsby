import { SessionStorage } from "../../domain/auth/SessionStorage";

export class LocalSessionStorage implements SessionStorage {
  get = async (): Promise<string | null> => localStorage.getItem("SESSION_KEY");

  store = async (session: string) => await localStorage.setItem("SESSION_KEY", session);

  remove = () => localStorage.removeItem("SESSION_KEY");

  hasSession = async (): Promise<boolean> => !!(await this.get());
}
