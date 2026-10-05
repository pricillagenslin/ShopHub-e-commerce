import products from '../data/products.json';
import categories from '../data/categories.json';
import { fakeRequest } from './api';
import { Product, Category } from '../types';
export const getProducts = () => fakeRequest(() => products as Product[]);
export const getProductById = (id: number) =>
  fakeRequest(() => { const p = (products as Product[]).find((x) => x.id === id); if (!p) throw new Error('Product not found'); return p; });
export const getCategories = () => fakeRequest(() => categories as Category[]);
