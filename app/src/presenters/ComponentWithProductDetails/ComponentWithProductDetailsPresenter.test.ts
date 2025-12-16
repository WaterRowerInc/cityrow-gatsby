import { anything, instance, mock, verify, when } from "ts-mockito";
import { productFixtures } from "../../core/domain/products/testing/ProductFixtures";
import { GetProduct } from "../../core/useCases/GetProduct/GetProduct";
import {
  ComponentWithProductDetailsPresenter,
  ComponentWithProductDetailsView
} from "./ComponentWithProductDetailsPresenter";

describe("ComponentWithProductDetailsPresenter should", () => {
  it("do nothing if there's no slug", async () => {
    await presenter.start("");

    verify(getProduct.execute(anything())).never();
    verify(view.setProduct(anything())).never();
    verify(view.clearProduct()).never();
  });

  it("set product if there's a valid slug", async () => {
    when(getProduct.execute(anything())).thenResolve(aProduct);

    await presenter.start("aSlug");

    verify(getProduct.execute(anything())).called();
    verify(view.setProduct(anything())).calledAfter(getProduct.execute(anything()));
    verify(view.clearProduct()).never();
  });

  it("clear product if there's an error getting it from service", async () => {
    when(getProduct.execute(anything())).thenThrow(new Error());

    await presenter.start("aSlug");

    verify(getProduct.execute(anything())).called();
    verify(view.setProduct(anything())).never();
    verify(view.clearProduct()).called();
  });

  beforeEach(() => {
    view = mock<ComponentWithProductDetailsView>();
    getProduct = mock<GetProduct>();
    presenter = createPresenter();
  });

  function createPresenter(): ComponentWithProductDetailsPresenter {
    return new ComponentWithProductDetailsPresenter(instance(view), instance(getProduct));
  }

  let view: ComponentWithProductDetailsView;
  let presenter: ComponentWithProductDetailsPresenter;
  let getProduct: GetProduct;
  const aProduct = productFixtures.aProduct;
});
