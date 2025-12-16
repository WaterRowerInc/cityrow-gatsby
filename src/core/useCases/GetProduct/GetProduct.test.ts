import { anything, instance, mock, verify, when } from "ts-mockito";
import { ProductService } from "../../domain/products/ProductService";
import { GetProduct } from "./GetProduct";

describe("GetProduct should", () => {
  it("get a product by slug or code", async () => {
    when(productService.getFromSlugOrId("aCode")).thenResolve(anything());

    await getProductBySlugOrCode().execute("aCode");

    verify(productService.getFromSlugOrId("aCode")).called();
  });

  beforeEach(() => {
    productService = mock<ProductService>();
  });

  function getProductBySlugOrCode(): GetProduct {
    return new GetProduct(instance(productService));
  }

  let productService: ProductService;
});
