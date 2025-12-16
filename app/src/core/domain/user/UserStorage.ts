import { User } from "./User";

export type UserCallback = (user: User | null) => void;
export type UserSubscription = { unsubscribe: () => void };

export interface UserStorage {
  get(): Promise<User | null>;

  getAnonymousId(): string;

  getUserId(): Promise<string | undefined>;

  store(user: User);

  remove(): void;

  subscribe(user: UserCallback): UserSubscription;
}
