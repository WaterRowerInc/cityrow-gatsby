import swell from "swell-js";

export class EcommerceClient {
  private readonly storeId: string;
  private readonly publicKey: string;
  ecommerceApi: any;

  constructor(storeId, publicKey) {
    this.storeId = storeId;
    this.publicKey = publicKey;
    this.ecommerceApi = swell;
    this.ecommerceApi.init(this.storeId, this.publicKey, { useCamelCase: true });
  }
}
