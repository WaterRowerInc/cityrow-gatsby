import { orderFixtures } from "../../core/domain/orders/testing/OrderFixtures";
import { GetOrder } from "../../core/useCases/GetOrder/GetOrder";
import { PurchaseConfirmationPresenter, PurchaseConfirmationView } from "./PurchaseConfirmationPresenter";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { NotExpectedError } from "../../core/domain/orders/NotExpectedError";
import { Order } from "../../core/domain/orders/Order";

describe("PurchaseConfirmationPresenter should", () => {
  it("show loader before fetching the order on navigation", async () => {
    await presenter.start();

    verify(view.showLoader()).calledBefore(getOrder.execute());
  });

  it("fetch the last placed order", async () => {
    when(getOrder.execute()).thenResolve(anOrder);
    await presenter.start();

    verify(getOrder.execute()).called();
  });

  it("show delivery info if order contains anything else than a subscription", async () => {
    when(getOrder.execute()).thenResolve(anOrder);
    await presenter.start();

    verify(getOrder.execute()).called();
    verify(view.showDeliveryInfo()).calledAfter(getOrder.execute());
  });

  it("not show delivery info if order contains only a subscription", async () => {
    when(getOrder.execute()).thenResolve(anOrderWithJustSubscription);
    await presenter.start();

    verify(getOrder.execute()).called();
    verify(view.showDeliveryInfo()).never();
  });

  it("show order not found and hide loader if fetch order fails", async () => {
    when(getOrder.execute()).thenThrow(new NotExpectedError("Not Expected Error"));

    await presenter.start();

    verify(view.showErrorMessage(anything())).called();
    verify(view.hideLoader()).calledAfter(view.showErrorMessage(anything()));
  });

  it("update view state after order is fetched with value received", async () => {
    when(getOrder.execute()).thenResolve(anOrder);

    await presenter.start();

    verify(view.showOrder(anything())).calledAfter(getOrder.execute());
  });

  it("hide loader after fetching the order", async () => {
    when(getOrder.execute()).thenResolve(anOrder);

    await presenter.start();

    verify(view.hideLoader()).calledAfter(getOrder.execute());
  });

  beforeEach(() => {
    view = mock<PurchaseConfirmationView>();
    getOrder = mock<GetOrder>();
    presenter = createPresenter();
  });

  function createPresenter(): PurchaseConfirmationPresenter {
    return new PurchaseConfirmationPresenter(instance(view), instance(getOrder));
  }

  let view: PurchaseConfirmationView;
  let presenter: PurchaseConfirmationPresenter;
  let getOrder: GetOrder;
  const anOrder = orderFixtures.anOrder;
  const anOrderWithJustSubscription: Order = orderFixtures.anOrderWithSubscription;
});
