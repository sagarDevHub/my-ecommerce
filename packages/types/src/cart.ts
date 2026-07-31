import { ProductType } from './product';

export type CartItemType = ProductType & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type CartItemsType = CartItemType[];

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  updateQuantity: (id: string | number, size: string, color: string, quantity: number) => void;
  updateVariant: (item: CartItemType, newSize: string, newColor: string) => void;
  clearCart: () => void;
};
