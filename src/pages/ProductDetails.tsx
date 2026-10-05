import { useEffect, useState } from 'react';
import { Box, Button, Chip, Container, Grid, IconButton, Rating, Stack, Typography } from '@mui/material';
import { Add, ArrowBack, Check, Remove, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import { Product } from '../types';
import { ErrorState, Loading } from '../components/common/PageState';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { money } from '../utils/format';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const [p, setP] = useState<Product>();
  const [similar, setSimilar] = useState<Product[]>([]);
  const [err, setErr] = useState<string>();
  const [qty, setQty] = useState(1);
  const d = useAppDispatch();
  const nav = useNavigate();
  const liked = useAppSelector((s) => (p ? s.wishlist.ids.includes(p.id) : false));
  const inCart = useAppSelector((s) => (p ? s.cart.items.some((i) => i.product.id === p.id) : false));

  useEffect(() => {
    setP(undefined);
    setErr(undefined);
    setSimilar([]);
    getProductById(Number(id)).then(setP).catch((e) => setErr(e.message));
  }, [id]);

  // Load similar products once we know the current product's category
  useEffect(() => {
    if (!p) return;
    getProducts()
      .then((all) =>
        setSimilar(
          all
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 4)
        )
      )
      .catch(() => {});
  }, [p]);

  if (err) return <Container><ErrorState message={err} /></Container>;
  if (!p) return <Loading />;
  const out = p.stock === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <IconButton aria-label="Go back" onClick={() => nav(-1)} sx={{ mb: 2 }}>
        <ArrowBack />
      </IconButton>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={p.image}
            alt={p.name}
            sx={{
              width: '100%',
              height: { xs: 300, sm: 380, md: 460 },
              objectFit: 'cover',
              borderRadius: 3,
              bgcolor: 'grey.100',
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="caption" color="text.secondary">{p.category}</Typography>
          <Typography variant="h4" fontWeight={800}>{p.name}</Typography>
          <Rating value={p.rating} precision={0.1} readOnly sx={{ my: 1 }} />
          <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 1 }}>
            <Typography variant="h4" color="secondary" fontWeight={700}>{money(p.price)}</Typography>
            {p.originalPrice && <Typography sx={{ textDecoration: 'line-through' }} color="text.secondary">{money(p.originalPrice)}</Typography>}
            {p.discount && <Chip label={`-${p.discount}%`} color="success" size="small" />}
          </Stack>
          <Typography sx={{ my: 2 }}>{p.description}</Typography>
          <Typography color={out ? 'error' : 'success.main'} sx={{ mb: 2 }}>{out ? 'Out of stock' : `${p.stock} in stock`}</Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <IconButton onClick={() => setQty(Math.max(1, qty - 1))} disabled={out}><Remove /></IconButton>
            <Typography>{qty}</Typography>
            <IconButton onClick={() => setQty(Math.min(p.stock, qty + 1))} disabled={out}><Add /></IconButton>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              disabled={out || inCart}
              color={inCart ? 'success' : 'primary'}
              startIcon={inCart ? <Check /> : null}
              onClick={() => d(addToCart({ product: p, quantity: qty }))}
              sx={{
                transition: 'background-color .4s ease, color .4s ease, opacity .4s ease',
                opacity: inCart ? 0.9 : 1,
              }}
            >
              {out ? 'Unavailable' : inCart ? 'Added to cart' : 'Add to cart'}
            </Button>
            <Button variant="contained" color="secondary" disabled={out} onClick={() => { d(addToCart({ product: p, quantity: qty })); nav('/cart'); }}>Buy now</Button>
            <IconButton aria-label="Toggle wishlist" onClick={() => d(toggleWishlist(p.id))}>{liked ? <Favorite color="secondary" /> : <FavoriteBorder />}</IconButton>
          </Stack>
        </Grid>
      </Grid>

      {similar.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Similar products</Typography>
          <Grid container spacing={3}>
            {similar.map((sp) => (
              <Grid item key={sp.id} xs={12} sm={6} md={3}>
                <ProductCard product={sp} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}