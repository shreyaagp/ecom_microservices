/** A purchasable variant of a product (e.g. size / colour combination). */
export interface ProductVariant {
  sku: string;
  name: string;
  attributes: Record<string, string>;
  /** Price in the store's base currency. */
  price: number;
}

/** The canonical contract for a product shared across services. */
export interface ProductContract {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  variants: ProductVariant[];
  /** Average rating (1–5). */
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
