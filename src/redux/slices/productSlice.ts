import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProducts, getCategories } from '../../services/productService';
import { Product, Category, Status } from '../../types';
export const fetchProducts = createAsyncThunk('products/fetch', getProducts);
export const fetchCategories = createAsyncThunk('products/categories', getCategories);
interface S { items: Product[]; categories: Category[]; status: Status; error?: string }
const slice = createSlice({
  name: 'products', initialState: { items: [], categories: [], status: 'idle' } as S, reducers: {},
  extraReducers: (b) => b
    .addCase(fetchProducts.pending, (s) => { s.status = 'loading'; })
    .addCase(fetchProducts.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload; })
    .addCase(fetchProducts.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; })
    .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload; }),
});
export default slice.reducer;
