import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const load = (): number[] => { try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; } };
const slice = createSlice({
  name: 'wishlist', initialState: { ids: load() },
  reducers: { toggleWishlist(s, a: PayloadAction<number>) { s.ids = s.ids.includes(a.payload) ? s.ids.filter((i) => i !== a.payload) : [...s.ids, a.payload]; } },
});
export const { toggleWishlist } = slice.actions;
export default slice.reducer;
