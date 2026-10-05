import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import AuthPage from '../pages/AuthPage';
import ProtectedRoute from './ProtectedRoute';
import { Container, Typography } from '@mui/material';

// Wrap pages that need a logged-in user with <ProtectedRoute> (checkout, orders, profile go here).
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="register" element={<AuthPage mode="register" />} />
        <Route path="account" element={<ProtectedRoute><Container sx={{ py: 6 }}><Typography variant="h5">Profile coming soon</Typography></Container></ProtectedRoute>} />
        <Route path="*" element={<Container sx={{ py: 10 }}><Typography variant="h5">Page not found</Typography></Container>} />
      </Route>
    </Routes>
  );
}
