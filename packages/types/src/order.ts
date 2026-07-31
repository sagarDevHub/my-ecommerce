import type { Order } from '@repo/order-db';
import type { CartItemType } from './cart';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OrderType = Omit<Order, 'products'> & {
  products: CartItemType[];
};
