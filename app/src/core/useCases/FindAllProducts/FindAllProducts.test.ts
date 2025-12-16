import { anything, instance, mock, verify, when } from "ts-mockito";
import { ProductService } from "../../domain/products/ProductService";
import { FindAllProducts } from "./FindAllProducts";

describe("FindAllProducts should", () => {
  it("get all products", async () => {
    when(productService.findAllProducts()).thenResolve(anything());

    await getAllProducts().execute();

    verify(productService.findAllProducts()).called();
  });

  beforeEach(() => {
    productService = mock<ProductService>();
  });

  function getAllProducts(): FindAllProducts {
    return new FindAllProducts(instance(productService));
  }

  let productService: ProductService;
});
