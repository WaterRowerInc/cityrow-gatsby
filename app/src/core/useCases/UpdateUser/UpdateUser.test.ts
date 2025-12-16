import { GetUser } from "../GetUser/GetUser";
import { userFixtures } from "../../domain/user/testing/UserFixtures";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { UpdateUser } from "./UpdateUser";
import { AuthService } from "../../domain/auth/AuthService";
import { UserNotLoggedInError } from "../../domain/user/UserNotLoggedInError";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { UserStorage } from "core/domain/user/UserStorage";

describe("UpdateUser should", () => {
  it("update user store it and retrieve it", async () => {
    when(getUser.execute()).thenResolve(aUserWithoutMachine);
    when(authService.updateUser(anUpdateUserRequestWithoutMachineAndMonitor, aUserWithoutMachine.pk)).thenResolve(
      aUserWithoutMachine
    );

    const user = await updateUser().execute(anUpdateUserRequestWithoutMachineAndMonitor);

    verify(userStorage.store(user)).called();
    expect(user).toBe(aUserWithoutMachine);
  });

  it("create user equipment when editing the user", async () => {
    when(getUser.execute()).thenResolve(aUserWithoutMachine);

    await updateUser().execute(anUpdateUserRequest);

    verify(getUser.execute()).called();
    verify(authService.updateEquipment(anything(), anything(), anything())).never();
    verify(authService.createEquipment(anUpdateUserRequest.machine, anUpdateUserRequest.monitor)).called();
  });

  it("update user equipment when editing the user", async () => {
    when(getUser.execute()).thenResolve({ ...aUserWithoutMachine, equipmentId: "123" });

    await updateUser().execute(anUpdateUserRequest);

    verify(getUser.execute()).called();
    verify(authService.createEquipment(anything(), anything())).never();
    verify(authService.updateEquipment("123", anUpdateUserRequest.machine, anUpdateUserRequest.monitor)).called();
  });

  it("throw an error when user is not logged in", async () => {
    when(getUser.execute()).thenThrow(new UserNotLoggedInError());

    await expectThrows(async () => await updateUser().execute(anything()), UserNotLoggedInError);
  });

  it("throw an unexpected error", async () => {
    when(getUser.execute()).thenThrow(new Error("An unexpected error"));

    await expectThrows(async () => await updateUser().execute(anything()), NotExpectedError);
  });

  beforeEach(() => {
    authService = mock<AuthService>();
    getUser = mock<GetUser>();
    userStorage = mock<UserStorage>();
  });

  function updateUser(): UpdateUser {
    return new UpdateUser(instance(authService), instance(getUser), instance(userStorage));
  }

  let authService: AuthService;
  let getUser: GetUser;
  let userStorage: UserStorage;

  const aUserWithoutMachine = userFixtures.aUser;
  const anUpdateUserRequestWithoutMachineAndMonitor = {
    firstName: "fn",
    lastName: "ln",
    birthday: "01/01/2001",
    machine: "",
    monitor: "",
  };

  const anUpdateUserRequest = {
    firstName: "fn",
    lastName: "ln",
    birthday: "01/01/2001",
    machine: "123",
    monitor: "123",
  };
});
