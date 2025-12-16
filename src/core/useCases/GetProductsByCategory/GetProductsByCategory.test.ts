import { anything, instance, mock, verify, when } from "ts-mockito";
import { ProductService } from "../../domain/products/ProductService";
import { GetProductsByCategory } from "./GetProductsByCategory";

describe("GetProductsByCategory should", () => {
  it("get a list of products by category", async () => {
    when(productService.findPhysicalProductsByCategory("aCategory")).thenResolve(anything());

    await getProductsByCategory().execute("aCategory");

    verify(productService.findPhysicalProductsByCategory("aCategory")).called();
  });

  beforeEach(() => {
    productService = mock<ProductService>();
  });

  function getProductsByCategory(): GetProductsByCategory {
    return new GetProductsByCategory(instance(productService));
  }

  let productService: ProductService;
});
