import { anything, instance, mock, verify, when } from "ts-mockito";
import { Product } from "../../core/domain/products/Product";
import { GetProductsByCategory } from "../../core/useCases/GetProductsByCategory/GetProductsByCategory";
import { productFixtures } from "./../../core/domain/products/testing/ProductFixtures";
import { ApparelPresenter, ApparelView } from "./ApparelPresenter";

describe("ApparelPresenter should", () => {
  it("show loader when starts loading the apparels", async () => {
    when(getProductsByCategory.execute("apparel")).thenResolve(apparelProducts);

    await presenter.start();

    verify(view.showLoader()).called();
  });

  it("get products from ecommerce service, inside apparel category", async () => {
    when(getProductsByCategory.execute("apparel")).thenResolve(apparelProducts);

    await presenter.start();

    verify(getProductsByCategory.execute("apparel")).calledAfter(view.showLoader());
    verify(view.showProducts(anything())).calledBefore(view.hideLoader());
  });

  it("hide loader after getting the apparel products", async () => {
    when(getProductsByCategory.execute("apparel")).thenResolve(apparelProducts);

    await presenter.start();

    verify(view.hideLoader()).calledAfter(view.showProducts(anything()));
  });

  beforeEach(() => {
    view = mock<ApparelView>();
    getProductsByCategory = mock<GetProductsByCategory>();
    presenter = createPresenter();
  });

  function createPresenter(): ApparelPresenter {
    return new ApparelPresenter(instance(view), instance(getProductsByCategory));
  }

  let view: ApparelView;
  let presenter: ApparelPresenter;
  let getProductsByCategory: GetProductsByCategory;

  const apparelProducts: Product[] = [productFixtures.aProductWithVariants, productFixtures.aProductWithVariants];
});
