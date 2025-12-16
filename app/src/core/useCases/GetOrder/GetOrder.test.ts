import { orderFixtures } from "../../domain/orders/testing/OrderFixtures";
import { OrderService } from "../../domain/orders/OrderService";
import { instance, mock, verify, when } from "ts-mockito";
import { GetOrder } from "./GetOrder";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

describe("GetOrder should", () => {
  it("retrieve an Order", async () => {
    when(orderService.getOrder()).thenResolve(anOrder);

    await getOrder().execute();

    verify(orderService.getOrder()).called();
  });

  it("fail if get order fails", async () => {
    when(orderService.getOrder()).thenThrow(new Error("an Error"));

    await expectThrows(async () => {
      await getOrder().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    orderService = mock<OrderService>();
  });

  function getOrder(): GetOrder {
    return new GetOrder(instance(orderService));
  }

  let orderService: OrderService;
  const anOrder = orderFixtures.anOrder;
});
