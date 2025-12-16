import { instance, mock, verify, when } from "ts-mockito";
import { PaymentInfoService } from "../../domain/subscriptions/PaymentInfoService";
import { GetUserPaymentInfo } from "./GetUserPaymentInfo";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NoPaymentInfoError } from "../../domain/payment/NoPaymentInfoError";

describe("GetUserPaymentInfo should", () => {
  it("retrieve the user's payment info", async () => {
    await getUserPaymentInfo().execute();

    verify(paymentInfoService.getPaymentInfo()).called();
  });

  it("fail if get payment info fails", async () => {
    when(paymentInfoService.getPaymentInfo()).thenThrow(new NoPaymentInfoError());

    await expectThrows(async () => {
      await getUserPaymentInfo().execute();
    }, NoPaymentInfoError);
  });

  it("fail if get payment info fails", async () => {
    when(paymentInfoService.getPaymentInfo()).thenThrow(new Error("An error"));

    await expectThrows(async () => {
      await getUserPaymentInfo().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    paymentInfoService = mock<PaymentInfoService>();
  });

  function getUserPaymentInfo(): GetUserPaymentInfo {
    return new GetUserPaymentInfo(instance(paymentInfoService));
  }

  let paymentInfoService: PaymentInfoService;
});
