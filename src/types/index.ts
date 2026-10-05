export interface Category { id: number; name: string; image: string; itemCount: number; color: string }
export interface Product { id: number; name: string; price: number; originalPrice?: number; image: string; category: string; rating: number; stock: number; description: string; isNew?: boolean; discount?: number }
export interface User { id: number; name: string; email: string; password: string }
export interface CartItem { product: Product; quantity: number }
export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';
