import { GetUser } from "../GetUser/GetUser";
import { AuthService } from "../../domain/auth/AuthService";
import { UpdateUserRequest } from "../../domain/user/UpdateUserRequest";
import { UserNotLoggedInError } from "../../domain/user/UserNotLoggedInError";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { User } from "../../domain/user/User";
import { UserStorage } from "../../domain/user/UserStorage";

export class UpdateUser {
  private readonly authService: AuthService;
  private readonly getUser: GetUser;
  private readonly userStorage: UserStorage;

  constructor(authService: AuthService, getUser: GetUser, userStorage: UserStorage) {
    this.authService = authService;
    this.getUser = getUser;
    this.userStorage = userStorage;
  }

  execute = async (updateUserRequest: UpdateUserRequest): Promise<User> => {
    try {
      const user = await this.getUser.execute();
      if (updateUserRequest.machine && updateUserRequest.monitor)
        await this.createOrUpdateUserEquipment(updateUserRequest, user);

      const newUser = await this.authService.updateUser(updateUserRequest, user.pk!);
      await this.userStorage.store(newUser);
      return newUser;
    } catch (e: any) {
      if (e instanceof UserNotLoggedInError) throw e;
      throw new NotExpectedError(e.message);
    }
  };

  private createOrUpdateUserEquipment = async (updateUserRequest: UpdateUserRequest, user: User): Promise<void> => {
    if (user.equipmentId)
      return await this.authService.updateEquipment(
        user.equipmentId,
        updateUserRequest.machine,
        updateUserRequest.monitor
      );

    await this.authService.createEquipment(updateUserRequest.machine, updateUserRequest.monitor);
  };
}
