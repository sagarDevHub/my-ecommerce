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

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, 'Card holder name is required!'),
  cardNumber: z
    .string()
    .min(1, 'Card number is required!')
    .regex(/^\d{16}$/, 'Card number must be exactly 16 digits!'),
  expirationDate: z
    .string()
    .min(1, 'Expiration date is required!')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format!'),
  cvv: z
    .string()
    .min(1, 'CVV is required!')
    .regex(/^\d{3}$/, 'CVV must be exactly 3 digits!'),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
};
