import swell from "swell-js";
import { Product, ProductOption, ProductOptionValues, Variant } from "../../domain/products/Product";
import { ProductService } from "../../domain/products/ProductService";
import { EcommerceClient } from "./EcommerceClient";
import { ProductDoesNotExistError } from "../../domain/products/ProductDoesNotExistError";

export class EcommerceProductService implements ProductService {
  private readonly ecommerceClient: EcommerceClient;

  constructor(ecommerceClient: EcommerceClient) {
    this.ecommerceClient = ecommerceClient;
  }

  findPhysicalProductsByCategory = async (category: string): Promise<Product[]> => {
    const response = await swell.products.list({ category, bundle: false, expand: ["variants"] });
    return response.results.map((product) => this.jsonToProduct(product));
  };

  findAllProducts = async (): Promise<Product[]> => {
    const response = await swell.products.list({});
    return response.results.map((product) => this.jsonToProduct(product));
  };

  findBundleProducts = async (): Promise<Product[]> => {
    const response = await swell.products.list({ bundle: true, sort: "price" });
    return response.results.map((product) => this.jsonToProduct(product));
  };

  getFromSlugOrId = async (slug: string): Promise<Product> => {
    const response = await swell.products.get(slug, { expand: "categories" });
    if (!response) throw new ProductDoesNotExistError(slug);
    const product = this.jsonToProduct(response);
    return this.addStripePlanToProductOptionValues(product);
  };

  private jsonToProduct = (productJson): Product => ({
    hideAddMultiple: productJson?.attributes?.hideAddMultiple?.value?.toLowerCase() === "true",
    acceptsMultipleVariants: productJson?.attributes?.acceptsMultipleVariants?.value?.toLowerCase() === "true",
    bundleItems:
      productJson?.bundleItems?.map((item) => ({
        ...this.jsonToProduct(item.product),
        quantity: item.quantity,
      })) || [],
    canBuyWithoutStock: productJson?.stockPurchasable,
    categories: productJson?.categories?.map((category) => category.name.toLowerCase()) || [],
    crossSellProducts: productJson?.crossSells?.map((crossSell) => crossSell.productId) || [],
    description: productJson?.description,
    id: productJson?.id,
    promoCode: productJson?.attributes?.promoCode?.value,
    hasSubscriptionPackage: productJson?.attributes?.hasSubscriptionPackage?.value?.toLowerCase() === "true",
    images: productJson?.images?.map((image) => image.file.url) || [],
    isSubscription: productJson?.attributes?.isSubscription?.value?.toLowerCase() === "true",
    mainCrossSellProductId: productJson?.content?.mainCrossSellProductId,
    name: productJson?.name,
    options: productJson?.options?.map((option) => this.jsonToOptions(option)) || [],
    priceWithoutSale: productJson?.origPrice,
    price: productJson?.price,
    priceClarification: productJson?.priceClarification,
    relatedProducts: productJson?.content?.relatedProductsIds || [],
    sku: productJson?.sku,
    slug: productJson?.slug,
    specs: productJson?.content?.specs,
    stock: productJson?.stockLevel || 0,
    stockTracking: productJson?.stockTracking,
    subscriptions: productJson?.content?.subscriptionsIds || [],
    subtitle: productJson?.attributes?.subtitle?.value || "",
    upSellProducts: productJson?.upSells?.map((crossSell) => crossSell.productId) || [],
    variants: productJson?.variants?.results.map((variant) => this.jsonToVariants(variant)) || [],
  });

  private jsonToOptions = ({ attributeId, name, values, selectValues }): ProductOption => ({
    attributeId: attributeId,
    name: name,
    values: (selectValues || values).map((option) => this.jsonToOptionValues(option)) || [],
  });

  private jsonToOptionValues = ({
    id,
    name,
    description,
    price,
    subscriptionInterval,
    subscriptionTrialDays,
    stripePlansId,
  }): ProductOptionValues => ({
    id,
    name,
    description,
    price,
    subscriptionInterval,
    subscriptionTrialDays,
    stripePlanId: stripePlansId,
  });

  private jsonToVariants = ({
    id,
    name,
    optionValueIds,
    images,
    stockLevel,
    price,
    origPrice,
    description,
  }): Variant => ({
    id,
    name,
    optionsIds: optionValueIds,
    images: images?.map((image) => image.file.url) || [],
    stock: stockLevel,
    price,
    priceWithoutSale: origPrice,
    description,
  });

  private addStripePlanToProductOptionValues = async (product: Product): Promise<Product> => {
    const productOptionValueHasStripePlan = !!product.options.find((option) =>
      option.values.find((value) => !!value.stripePlanId)
    );
    if (!productOptionValueHasStripePlan) return product;
    const ecommerceStripePlans = await swell.content.get("stripe-plan");
    const newOptionValues = this.getNewOptionValuesFromEcommerceStripePlans(product, ecommerceStripePlans);
    return { ...product, options: [{ ...product.options[0], values: newOptionValues }] };
  };

  private getNewOptionValuesFromEcommerceStripePlans = (
    product: Product,
    ecommerceStripePlans: any
  ): ProductOptionValues[] => {
    return product.options[0].values.map((value) => {
      if (!value.stripePlanId) return value;
      const stripeId = ecommerceStripePlans.results.find(
        (ecommerceStripePlan) => ecommerceStripePlan.id === value.stripePlanId
      )?.stripeId;
      return { ...value, stripePlanId: stripeId };
    });
  };
}
