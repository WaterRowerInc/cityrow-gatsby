import { anything, instance, mock, verify, when } from "ts-mockito";
import { productFixtures } from "./../../core/domain/products/testing/ProductFixtures";
import { GetBundleProducts } from "./../../core/useCases/GetBundleProducts/GetBundleProducts";
import { GetProductsByCategory } from "./../../core/useCases/GetProductsByCategory/GetProductsByCategory";
import { AccessoryPresenter, AccessoryView } from "./AccessoryPresenter";

describe("Accessory Presenter should", () => {
  it("show a loader on start ", async () => {
    when(getProductsByCategory.execute(anything())).thenResolve([aProduct]);
    when(getBundleProducts.execute()).thenResolve([aProduct]);

    presenter.start();

    verify(view.showLoader()).called();
  });

  it("show the checkout button if the page was redirected from the product detail page", async () => {
    when(getProductsByCategory.execute(anything())).thenResolve([aProduct]);
    when(getBundleProducts.execute()).thenResolve([aProduct]);

    await presenter.start("?referrer=pdp");

    verify(view.showCheckoutButton()).called();
  });

  it("not show the checkout button if the page has no PDP as referrer", async () => {
    when(getProductsByCategory.execute(anything())).thenResolve([aProduct]);
    when(getBundleProducts.execute()).thenResolve([aProduct]);

    await presenter.start();

    verify(view.showCheckoutButton()).never();
  });

  beforeEach(() => {
    view = mock<AccessoryView>();
    getProductsByCategory = mock<GetProductsByCategory>();
    getBundleProducts = mock<GetBundleProducts>();
    presenter = createPresenter();
  });

  function createPresenter(): AccessoryPresenter {
    return new AccessoryPresenter(instance(view), instance(getProductsByCategory), instance(getBundleProducts));
  }

  let presenter: AccessoryPresenter;
  let view: AccessoryView;
  let getProductsByCategory: GetProductsByCategory;
  let getBundleProducts: GetBundleProducts;

  const aProduct = productFixtures.aProduct;
});
