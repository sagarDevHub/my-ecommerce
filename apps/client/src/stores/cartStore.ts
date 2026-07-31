import { CartItemType, CartStoreActionsType, CartStoreStateType } from '@repo/types';
import { create } from 'zustand';

type CartStore = CartStoreStateType & CartStoreActionsType;

const useCartStore = create<CartStore>(set => ({
  cart: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [],
  hasHydrated: true,

  addToCart: product => {
    set(state => {
      const existingIndex = state.cart.findIndex(
        p =>
          p.id === product.id &&
          p.selectedSize === product.selectedSize &&
          p.selectedColor === product.selectedColor
      );
      let newCart: CartItemType[];
      if (existingIndex !== -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex]!.quantity += product.quantity || 1;
        newCart = updatedCart;
      } else {
        newCart = [...state.cart, { ...product, quantity: product.quantity || 1 }];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
      return { cart: newCart };
    });
  },

  removeFromCart: product => {
    set(state => {
      const newCart = state.cart.filter(
        p =>
          !(
            p.id === product.id &&
            p.selectedSize === product.selectedSize &&
            p.selectedColor === product.selectedColor
          )
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
      return { cart: newCart };
    });
  },

  updateQuantity: (id, size, color, quantity) => {
    set(state => {
      const newCart = state.cart
        .map(p => {
          if (p.id === id && p.selectedSize === size && p.selectedColor === color) {
            return quantity > 0 ? { ...p, quantity } : null;
          }
          return p;
        })
        .filter(Boolean) as CartItemType[];

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
      return { cart: newCart };
    });
  },

  updateVariant: (item, newSize, newColor) => {
    set(state => {
      const newCart = [...state.cart];

      const oldIndex = newCart.findIndex(
        p =>
          p.id === item.id &&
          p.selectedSize === item.selectedSize &&
          p.selectedColor === item.selectedColor
      );

      if (oldIndex === -1) return { cart: state.cart };

      const targetQuantity = item.quantity;
      newCart.splice(oldIndex, 1);

      const existingVariantIndex = newCart.findIndex(
        p => p.id === item.id && p.selectedSize === newSize && p.selectedColor === newColor
      );

      if (existingVariantIndex !== -1) {
        newCart[existingVariantIndex]!.quantity += targetQuantity;
      } else {
        newCart.splice(oldIndex, 0, {
          ...item,
          selectedSize: newSize,
          selectedColor: newColor,
        });
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
      return { cart: newCart };
    });
  },

  clearCart: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
    set({ cart: [] });
  },
}));

export default useCartStore;
