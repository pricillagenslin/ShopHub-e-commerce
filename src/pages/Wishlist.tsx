import { Container, Grid, Typography } from '@mui/material';
import ProductCard from '../components/product/ProductCard';
import { EmptyState } from '../components/common/PageState';
import { useAppSelector } from '../redux/hooks';
import products from '../data/products.json';
import { Product } from '../types';

export default function Wishlist() {
  const ids = useAppSelector((s) => s.wishlist.ids);
  const list = (products as Product[]).filter((p) => ids.includes(p.id));
  if (!list.length) return <Container><EmptyState title="Your wishlist is empty" hint="Tap the heart on any product to save it." /></Container>;
  return <Container maxWidth="xl" sx={{ py: 5 }}><Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Wishlist</Typography>
    <Grid container spacing={3}>{list.map((p) => <Grid item xs={12} sm={6} md={3} key={p.id}><ProductCard product={p} /></Grid>)}</Grid></Container>;
}
