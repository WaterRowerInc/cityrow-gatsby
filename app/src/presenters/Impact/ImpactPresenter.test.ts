import { anything, instance, mock, verify, when } from "ts-mockito";
import { ImpactPresenter, ImpactView } from "./ImpactPresenter";
import { orderFixtures } from "../../core/domain/orders/testing/OrderFixtures";
import { parsePriceWithCurrencyToNumber } from "../../utils/formatUtils";
import { OrderVM } from "../../builderComponents/PurchaseConfirmation/OrderVM";
import { GetUser } from "../../core/useCases/GetUser/GetUser";

describe("ImpactPresenter should", () => {
  it("no call identify impact user if the presenter starts with no running identify = true", async () => {
    await presenter.start(true);

    verify(view.identifyImpactUser(anything(), anything())).never();
  });

  it("identify Impact User on start", async () => {
    when(getUser.execute()).thenResolve(aUser);

    await presenter.start();

    verify(view.identifyImpactUser(aUser.pk, aUser.email)).called();
  });

  it("Identify empty user on start if get user fails", async () => {
    when(getUser.execute()).thenThrow(new Error("an Error"));

    await presenter.start();

    verify(view.identifyImpactUser("", "")).called();
  });

  it("Retrieve conversionOrder on getTrackConversionOrder", async () => {
    when(getUser.execute()).thenResolve(aUser);

    const conversionOrder = await presenter.getTrackConversionOrder(anOrderVM);

    expect(conversionOrder).toStrictEqual({
      currencyCode: anOrderVM.currency,
      customerCountry: "US",
      customerEmail: aUser.email,
      customerId: aUser.pk,
      customerStatus: "",
      items: anOrderVM.items.map((item) => ({
        category: "Fitness",
        discount: item.discountEach,
        name: item.name,
        quantity: item.quantity,
        subTotal: parsePriceWithCurrencyToNumber(item.originalPrice),
        sku: item.product.sku,
        totalDiscount: item.discount,
      })),
      orderDiscount: parsePriceWithCurrencyToNumber(anOrderVM.discounts),
      orderId: anOrderVM.id,
      orderPromoCode: anOrderVM.coupon,
      orderShippingCost: anOrderVM.shipmentTotal,
      orderTax: parsePriceWithCurrencyToNumber(anOrderVM.taxes),
      promotionalCode: anOrderVM.coupon,
      subTotal: parsePriceWithCurrencyToNumber(anOrderVM.subTotal),
    });
  });

  it("Retrieve conversionOrder with order customerId an no email if get user fails on getTrackConversionOrder", async () => {
    when(getUser.execute()).thenThrow(new Error("anError"));

    const conversionOrder = await presenter.getTrackConversionOrder(anOrderVM);

    expect(conversionOrder).toStrictEqual({
      currencyCode: anOrderVM.currency,
      customerCountry: "US",
      customerEmail: "",
      customerId: anOrderVM.accountId,
      customerStatus: "",
      items: anOrderVM.items.map((item) => ({
        category: "Fitness",
        discount: item.discountEach,
        name: item.name,
        quantity: item.quantity,
        subTotal: parsePriceWithCurrencyToNumber(item.originalPrice),
        sku: item.product.sku,
        totalDiscount: item.discount,
      })),
      orderDiscount: parsePriceWithCurrencyToNumber(anOrderVM.discounts),
      orderId: anOrderVM.id,
      orderPromoCode: anOrderVM.coupon,
      orderShippingCost: anOrderVM.shipmentTotal,
      orderTax: parsePriceWithCurrencyToNumber(anOrderVM.taxes),
      promotionalCode: anOrderVM.coupon,
      subTotal: parsePriceWithCurrencyToNumber(anOrderVM.subTotal),
    });
  });

  beforeEach(() => {
    view = mock<ImpactView>();
    getUser = mock<GetUser>();
    presenter = createPresenter();
  });

  function createPresenter(): ImpactPresenter {
    return new ImpactPresenter(instance(view), instance(getUser));
  }

  let presenter: ImpactPresenter;
  let view: ImpactView;
  let getUser: GetUser;
  const aUser = { pk: "somePk", email: "someEmail@test.com", firstName: "aFirstName", lastName: "aLastName" };
  const anOrder = orderFixtures.anOrder;
  const anOrderVM: OrderVM = {
    ...anOrder,
    delivery: "$150",
    discounts: "$75.50",
    items: [
      {
        discount: 75.5,
        discountEach: 75.5,
        hasSalePrice: false,
        name: "someName",
        options: [{ id: "optionId", value: "someValue" }],
        originalPrice: "$150",
        quantity: 1,
        product: {
          id: "someProductId",
          name: "aProduct",
          isSubscription: false,
          options: [
            {
              attributeId: "anAttributeId",
              values: [
                {
                  name: "someName",
                  paymentPlanId: "somePaymentPlanId",
                },
              ],
            },
          ],
          sku: "someSku",
        },
        price: "$150",
      },
    ],
    subTotal: "$180",
    taxes: "$25.25",
    total: "$325.70",
  };
});
