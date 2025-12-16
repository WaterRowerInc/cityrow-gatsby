import { anything, instance, mock, verify, when } from "ts-mockito";
import { ProductService } from "../../domain/products/ProductService";
import { GetBundleProducts } from "./GetBundleProducts";

describe("GetBundleProducts should", () => {
  it("get all bundle products", async () => {
    when(productService.findBundleProducts()).thenResolve(anything());

    await getAllBundleProducts().execute();

    verify(productService.findBundleProducts()).called();
  });

  beforeEach(() => {
    productService = mock<ProductService>();
  });

  function getAllBundleProducts(): GetBundleProducts {
    return new GetBundleProducts(instance(productService));
  }

  let productService: ProductService;
});
