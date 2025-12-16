import { instance, mock, verify, when } from "ts-mockito";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { CreateKlarnaSession } from "./CreateKlarnaSession";
import { PaymentService } from "../../domain/payment/PaymentService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { klarnaSessionFixtures } from "../../domain/payment/testing/KlarnaSessionFixtures";

describe("CreateKlarnaSession should", () => {
  it("create a klarna session and retrieve it", async () => {
    when(paymentService.createKlarnaSession(aKlarnaSessionRequest)).thenResolve(aKlarnaSession);

    const klarnaSession = await createKlarnaSession().execute(aKlarnaSessionRequest);

    verify(paymentService.createKlarnaSession(aKlarnaSessionRequest)).called();
    expect(klarnaSession).toBe(aKlarnaSession);
  });

  it("fail if get cart fails", async () => {
    when(paymentService.createKlarnaSession(aKlarnaSessionRequest)).thenThrow(
      new NotExpectedError("Not Expected Error")
    );

    await expectThrows(async () => {
      await createKlarnaSession().execute(aKlarnaSessionRequest);
    }, NotExpectedError);
  });

  beforeEach(() => {
    paymentService = mock<PaymentService>();
  });

  const createKlarnaSession = (): CreateKlarnaSession => new CreateKlarnaSession(instance(paymentService));

  let paymentService: PaymentService;
  const aKlarnaSession = klarnaSessionFixtures.aKlarnaSession;
  const aKlarnaSessionRequest = klarnaSessionFixtures.aKlarnaSessionRequest;
});
