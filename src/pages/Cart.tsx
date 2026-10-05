import { Box, Button, Container, Divider, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Add, ArrowBack, Delete, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearCart, removeFromCart, setQuantity } from '../redux/slices/cartSlice';
import { EmptyState } from '../components/common/PageState';
import { FREE_SHIPPING_MIN, SHIPPING_FEE, money } from '../utils/format';

export default function Cart() {
  const d = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((s) => s.cart.items);
  if (!items.length) return <Container><EmptyState title="Your cart is empty" hint="Add something you like." /></Container>;
  const original = items.reduce((n, i) => n + (i.product.originalPrice ?? i.product.price) * i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.product.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton aria-label="Go back" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight={800}>Cart</Typography>
        </Stack>
        <Button color="error" onClick={() => d(clearCart())}>Clear cart</Button>
      </Stack>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>{items.map(({ product: p, quantity }) => (
          <Paper key={p.id} sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box component="img" src={p.image} alt={p.name} sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 2 }} />
            <Box sx={{ flexGrow: 1 }}><Typography fontWeight={600}>{p.name}</Typography><Typography color="text.secondary">{money(p.price)}</Typography></Box>
            <IconButton onClick={() => d(setQuantity({ id: p.id, quantity: quantity - 1 }))}><Remove /></IconButton><Typography>{quantity}</Typography>
            <IconButton disabled={quantity >= p.stock} onClick={() => d(setQuantity({ id: p.id, quantity: quantity + 1 }))}><Add /></IconButton>
            <IconButton aria-label="Remove" onClick={() => d(removeFromCart(p.id))}><Delete /></IconButton>
          </Paper>))}
        </Grid>
        <Grid item xs={12} md={4}><Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Order summary</Typography>
          {[['Subtotal', money(original)], ['Discount', `-${money(original - subtotal)}`], ['Shipping', shipping ? money(shipping) : 'Free']].map(([k, v]) => <Stack key={k} direction="row" justifyContent="space-between" sx={{ mb: 1 }}><Typography>{k}</Typography><Typography>{v}</Typography></Stack>)}
          <Divider sx={{ my: 2 }} /><Stack direction="row" justifyContent="space-between"><Typography fontWeight={700}>Total</Typography><Typography fontWeight={700}>{money(subtotal + shipping)}</Typography></Stack>
        </Paper></Grid>
      </Grid>
    </Container>
  );
}