import { instance, mock, verify, when } from "ts-mockito";
import { CartService } from "../../domain/orders/CartService";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { GetShippingOptions } from "./GetShippingOptions";
import { shippingFixtures } from "../../domain/orders/testing/ShippingFixtures";

describe("GetShippingOptions should", () => {
  it("retrieve the Shipping Options", async () => {
    when(cartService.getShippingOptions()).thenResolve(someShippingOptions);

    await getShippingOptions().execute();

    verify(cartService.getShippingOptions()).called();
  });

  it("fail if get shipping options fails", async () => {
    when(cartService.getShippingOptions()).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await getShippingOptions().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    cartService = mock<CartService>();
  });

  function getShippingOptions(): GetShippingOptions {
    return new GetShippingOptions(instance(cartService));
  }

  let cartService: CartService;
  const someShippingOptions = shippingFixtures.someShippingOptions;
});
