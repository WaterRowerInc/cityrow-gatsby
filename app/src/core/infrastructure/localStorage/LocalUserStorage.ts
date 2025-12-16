import { v4 } from "uuid";
import { User } from "core/domain/user/User";
import { UserCallback, UserStorage, UserSubscription } from "core/domain/user/UserStorage";

export class LocalUserStorage implements UserStorage {
  private subscribers: UserCallback[] = [];

  async get(): Promise<User | null> {
    const userJSON = sessionStorage.getItem("USER");
    return userJSON ? JSON.parse(userJSON) : null;
  }

  getAnonymousId = (): string => {
    const id = sessionStorage.getItem("ANONYMOUS_ID");
    if (id) return id;
    const anonymousId = v4();
    sessionStorage.setItem("ANONYMOUS_ID", anonymousId);
    return anonymousId;
  };

  getUserId = async (): Promise<string | undefined> => {
    const user = await this.get();
    return user?.pk;
  };

  async store(user: User) {
    this.subscribers.forEach((subscriberCallback) => subscriberCallback(user));
    await sessionStorage.setItem("USER", JSON.stringify(user));
  }

  remove = () => {
    this.subscribers.forEach((subscriberCallback) => subscriberCallback(null));
    sessionStorage.removeItem("USER");
  };

  subscribe = (callback: UserCallback): UserSubscription => {
    const index = this.subscribers.push(callback) - 1;
    return {
      unsubscribe: () => this.subscribers.splice(index, 1),
    };
  };
}
