import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';
const load = (): CartItem[] => { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; } };
const slice = createSlice({
  name: 'cart', initialState: { items: load() },
  reducers: {
    addToCart(s, a: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = a.payload;
      const it = s.items.find((i) => i.product.id === product.id);
      if (it) it.quantity = Math.min(product.stock, it.quantity + quantity);
      else if (product.stock > 0) s.items.push({ product, quantity: Math.min(product.stock, quantity) });
    },
    setQuantity(s, a: PayloadAction<{ id: number; quantity: number }>) {
      const it = s.items.find((i) => i.product.id === a.payload.id);
      if (!it) return;
      if (a.payload.quantity <= 0) s.items = s.items.filter((i) => i !== it);
      else it.quantity = Math.min(it.product.stock, a.payload.quantity);
    },
    removeFromCart(s, a: PayloadAction<number>) { s.items = s.items.filter((i) => i.product.id !== a.payload); },
    clearCart(s) { s.items = []; },
  },
});
export const { addToCart, setQuantity, removeFromCart, clearCart } = slice.actions;
export default slice.reducer;
