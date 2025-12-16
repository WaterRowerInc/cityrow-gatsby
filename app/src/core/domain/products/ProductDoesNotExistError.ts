import { DomainError } from "../errors/DomainError";

export class ProductDoesNotExistError extends DomainError {
  constructor(slug: string) {
    super(`There is no active product in the ecommerce API for the configured slug in builder: ${slug}`);
  }
}
