import type { Product } from '@repo/product-db';

export type ProductType = Omit<Product, 'images' | 'categorySlug' | 'createdAt' | 'updatedAt'> & {
  images: Record<string, string> | any;
  categorySlug?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export type ProductsType = ProductType[];
