import { CartStoreActionsType, CartStoreStateType } from '@/types';
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

      let newCart;
      if (existingIndex !== -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex]!.quantity += product.quantity || 1;
        newCart = updatedCart;
      } else {
        newCart = [...state.cart, { ...product, quantity: product.quantity || 1 }];
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }

      return { cart: newCart };
    });
  },

  removeFromCart: product => {
    set(state => {
      const newCart = state.cart.filter(p => p.id !== product.id);
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
