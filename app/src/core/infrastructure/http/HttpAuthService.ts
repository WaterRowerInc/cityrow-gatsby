import { AuthService } from "../../domain/auth/AuthService";
import { ConnectivityIssuesError } from "../../domain/errors/ConnectivityIssuesError";
import { HttpClient } from "./HttpClient";
import { User } from "../../domain/user/User";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { BadCredentialsError } from "../../domain/auth/BadCredentialsError";
import { InvalidOldPasswordError } from "../../domain/auth/InvalidOldPasswordError";
import { UpdateUserRequest } from "../../domain/user/UpdateUserRequest";
import { RegisterUserRequest } from "../../domain/auth/RegisterUserRequest";
import { EmailAlreadyRegisteredError } from "../../domain/auth/EmailAlreadyRegisteredError";

export class HttpAuthService implements AuthService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  deleteUser = async () => {
    try {
      await this.httpClient.post("/user/delete/");
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  registerUser = async ({
    email,
    password,
    firstName,
    lastName,
  }: RegisterUserRequest): Promise<{ user: User; token: string }> => {
    try {
      const response = await this.httpClient.post("/auth/registration-new-user/", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      return { token: response.data.token, user: this.jsonToUser(response.data.user) };
    } catch (e: any) {
      if (e?.response?.data?.errors?.[0]?.field === "email") throw new EmailAlreadyRegisteredError();
      throw e;
    }
  };

  logIn = async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await this.httpClient.post("/auth/login/", {
        email,
        password,
      });
      return { token: response.data.token, user: this.jsonToUser(response.data.user) };
    } catch (e: any) {
      const isNetworkError = !e?.response;
      if (isNetworkError) throw new ConnectivityIssuesError();
      if (e?.response.data.error_type === "ValidationError") throw new BadCredentialsError();
      throw new NotExpectedError(e.message);
    }
  };

  getUser = async (): Promise<User> => {
    const response = await this.httpClient.get(`/user/me`);
    return this.jsonToUser(response?.data);
  };

  changePassword = async (currentPassword: string, newPassword: string, userID: string): Promise<void> => {
    try {
      await this.httpClient.post(`/user/${userID}/change_password/`, {
        old_password: currentPassword,
        new_password: newPassword,
      });
    } catch (e: any) {
      const isNetworkError = !e?.response;
      if (isNetworkError) throw new ConnectivityIssuesError();
      if (e?.response.data.error_type === "ValidationError") throw new InvalidOldPasswordError();
      throw new NotExpectedError(e.message);
    }
  };

  resetPassword = async (email: string): Promise<void> => {
    try {
      return await this.httpClient.post(`/forgot_password/`, {
        email,
      });
    } catch (e: any) {
      const isNetworkError = !e?.response;
      if (isNetworkError) throw new ConnectivityIssuesError();
      throw new NotExpectedError(e?.response.data.error_type === "ValidationError" ? "ValidationError" : e.message);
    }
  };

  setPassword = async (token: string, password: string): Promise<void> => {
    try {
      return await this.httpClient.post(`/set_password/`, {
        id: token,
        password: password,
      });
    } catch (e: any) {
      const isNetworkError = !e?.response;
      if (isNetworkError) throw new ConnectivityIssuesError();
      throw new NotExpectedError(e?.response.data.error_type === "ValidationError" ? "ValidationError" : e.message);
    }
  };

  updateUser = async ({ firstName, lastName, birthday }: UpdateUserRequest, userID: string): Promise<User> => {
    try {
      const response = await this.httpClient.put(`/user/${userID}/`, {
        first_name: firstName,
        last_name: lastName,
        birthday: birthday,
      });
      return this.jsonToUser(response?.data);
    } catch (e: any) {
      const isNetworkError = !e?.response;
      if (isNetworkError) throw new ConnectivityIssuesError();
      throw new NotExpectedError(e.message);
    }
  };

  createEquipment = async (machineId: string, monitorId: string) => {
    await this.httpClient.post(`/my-equipment/`, {
      rowing_machine: machineId,
      monitor: monitorId,
    });
  };

  updateEquipment = async (equipmentId: string, machineId: string, monitorId: string) => {
    await this.httpClient.put(`/my-equipment/${equipmentId}/`, {
      rowing_machine: machineId,
      monitor: monitorId,
    });
  };

  jsonToUser = (json: any): User => ({
    firstName: json?.first_name,
    lastName: json?.last_name,
    email: json.email,
    dateJoined: json?.date_joined,
    pk: json.pk,
    birthday: json?.birthday,
    monitorId: json?.equipments?.[0]?.monitor?.id,
    monitorTitle: json?.equipments?.[0]?.monitor?.title,
    machineId: json?.equipments?.[0]?.rowing_machine?.id,
    machineTitle: json?.equipments?.[0]?.rowing_machine?.title,
    equipmentId: json?.equipments?.[0]?.id,
  });
}
