import { anything, capture, instance, mock, verify, when } from "ts-mockito";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { CreateCardPayment } from "./CreateCardPayment";
import { PaymentService } from "../../domain/payment/PaymentService";
import { CreatePaymentError } from "../../domain/payment/CreatePaymentError";

describe("CreateCardPayment should", () => {
  it("create a card payment for the given request", async () => {
    const aPaymentIntent = "aPaymentIntent";
    when(paymentService.createCardPayment(aCreateCardPaymentRequest)).thenResolve(aPaymentIntent);

    const paymentIntent = await createCardPayment().execute(aCreateCardPaymentRequest);

    verify(paymentService.createCardPayment(anything())).called();
    const [creditCardRequest] = capture(paymentService.createCardPayment).last();
    expect(creditCardRequest).toStrictEqual(aCreateCardPaymentRequest);
    expect(paymentIntent).toBe(aPaymentIntent);
  });

  it("fail if create card payment fails", async () => {
    when(paymentService.createCardPayment(anything())).thenThrow(new Error("Something failed"));

    await expectThrows(async () => {
      await createCardPayment().execute(aCreateCardPaymentRequest);
    }, CreatePaymentError);
  });

  beforeEach(() => {
    paymentService = mock<PaymentService>();
  });

  function createCardPayment(): CreateCardPayment {
    return new CreateCardPayment(instance(paymentService));
  }

  let paymentService: PaymentService;
  const aCreateCardPaymentRequest = {
    amount: "5000",
    currency: "usd",
    paymentMethod: "aToken",
  };
});
