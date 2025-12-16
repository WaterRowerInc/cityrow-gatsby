export interface SessionStorage {
  get(): Promise<string | null>;

  hasSession(): Promise<boolean>;

  remove();

  store(session: string);
}
