import { User } from "../user/User";
import { UpdateUserRequest } from "../user/UpdateUserRequest";
import { RegisterUserRequest } from "./RegisterUserRequest";

export interface AuthService {
  registerUser(registerUserRequest: RegisterUserRequest): Promise<{ user: User; token: string }>;

  logIn(email: string, password: string): Promise<{ user: User; token: string }>;

  changePassword(currentPassword: string, newPassword: string, userID: string): Promise<void>;

  resetPassword(email: string): Promise<void>;

  setPassword(token: string, password: string): Promise<void>;

  updateUser({ firstName, lastName, birthday }: UpdateUserRequest, userID: string): Promise<User>;

  createEquipment(machineId: string, monitorId: string): Promise<void>;

  updateEquipment(equipmentId: string, machineId: string, monitorId: string): Promise<void>;

  getUser(): Promise<User>;

  deleteUser();
}
