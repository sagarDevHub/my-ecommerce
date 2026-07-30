import { z } from 'zod';

export type ProductType = {
  id: string | number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;
};

export type ProductsType = ProductType[];

export type CartItemType = ProductType & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
  name: z.string().min(1, 'Name is required!'),
  email: z.string().min(1, 'Email is required!').email('Invalid email address!'),
  phone: z
    .string()
    .min(1, 'Phone number is required!')
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits!'),
  address: z.string().min(1, 'Address is required!'),
  city: z.string().min(1, 'City is required!'),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  updateQuantity: (id: string | number, size: string, color: string, quantity: number) => void;
  updateVariant: (item: CartItemType, newSize: string, newColor: string) => void; // 👈 Added for size/color switching
  clearCart: () => void;
};
