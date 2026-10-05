import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Rating, Stack, Typography } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { BsCart, BsCartCheckFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { money } from '../../utils/format';
import useRequireAuth from '../../redux/useRequireAuth';

export default function ProductCard({ product: p }: { product: Product }) {
  const dispatch = useAppDispatch();
  const liked = useAppSelector((s) => s.wishlist.ids.includes(p.id));
  const inCart = useAppSelector((s) => s.cart.items.some((i) => i.product.id === p.id));
  const out = p.stock === 0;

  const { requireAuth } = useRequireAuth();

  const handleAddToCart = () =>
    requireAuth(() => dispatch(addToCart({ product: p })));

  const handleToggleWishlist = () =>
    requireAuth(() => dispatch(toggleWishlist(p.id)));

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'transparent',
        borderRadius: 0,
        p: 0,
        width: '100%',
        height: '100%',
        '&:hover .product-img': { transform: 'scale(1.04)' },
        '&:hover .product-title': { textDecoration: 'underline', textUnderlineOffset: '4px' },
        '&:hover .wishlist-btn': { opacity: 1, transform: 'translateY(0)' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          bgcolor: 'grey.100',
          aspectRatio: '4 / 5',
        }}
      >
        <Link to={`/products/${p.id}`} style={{ display: 'block', height: '100%' }}>
          <CardMedia
            component="img"
            image={p.image}
            alt={p.name}
            className="product-img"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform .8s cubic-bezier(.2,.7,.2,1)',
            }}
          />
        </Link>

        <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 6, left: 6 }}>
          {p.isNew && (
            <Chip label="New" size="small"
              sx={{ bgcolor: 'common.black', color: 'common.white', fontWeight: 600, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', height: 20, borderRadius: 999, px: 0.75 }} />
          )}
          {p.discount && (
            <Chip label={`−${p.discount}%`} size="small"
              sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 700, fontSize: 10, height: 20, borderRadius: 999, px: 0.75 }} />
          )}
          {out && (
            <Chip label="Sold out" size="small"
              sx={{ bgcolor: 'background.paper', color: 'text.primary', fontWeight: 600, fontSize: 10, letterSpacing: 0.3, textTransform: 'uppercase', height: 20, borderRadius: 999, px: 0.75, opacity: 0.9 }} />
          )}
        </Stack>

        <IconButton
          className="wishlist-btn"
          aria-label="Toggle wishlist"
          size="small"
          onClick={handleToggleWishlist}   // 👈 guarded
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            bgcolor: 'background.paper',
            backdropFilter: 'blur(8px)',
            width: 28,
            height: 28,
            opacity: liked ? 1 : 0,
            transform: liked ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity .25s ease, transform .25s ease, background-color .2s ease',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          {liked ? <Favorite sx={{ fontSize: 15 }} color="secondary" /> : <FavoriteBorder sx={{ fontSize: 15 }} />}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, px: 0.25, pt: 0.75, pb: 0.25 }}>
        <Typography sx={{ fontSize: 10, fontWeight: 500, color: 'text.secondary', letterSpacing: 0.3, mb: 0.25 }}>
          {p.category}
        </Typography>

        <Typography
          className="product-title"
          component={Link}
          to={`/products/${p.id}`}
          color="inherit"
          fontWeight={600}
          sx={{
            mb: 0.25,
            fontSize: '0.875rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textDecoration: 'none',
            transition: 'text-decoration .15s ease',
          }}
        >
          {p.name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.25 }}>
          <Rating value={p.rating} precision={0.1} size="small" readOnly sx={{ fontSize: 12 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {p.rating.toFixed(1)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="baseline">
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
            {money(p.price)}
          </Typography>
          {p.originalPrice && (
            <Typography variant="body2" color="text.disabled" sx={{ textDecoration: 'line-through', fontSize: '0.75rem' }}>
              {money(p.originalPrice)}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 0.25, pt: 0.5, pb: 0.25 }}>
        <Button
          fullWidth
          size="small"
          variant={inCart ? 'contained' : 'outlined'}
          color={inCart ? 'success' : 'primary'}
          disabled={out}
          onClick={handleAddToCart}   // 👈 guarded
          startIcon={
            inCart
              ? <BsCartCheckFill style={{ fontSize: 15 }} />
              : <BsCart style={{ fontSize: 15 }} />
          }
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            borderRadius: 999,
            py: 0.6,
            minHeight: 0,
            justifyContent: 'center',
            borderColor: 'divider',
            color: inCart ? 'success.contrastText' : 'text.primary',
            bgcolor: inCart ? 'success.main' : 'transparent',
            transition: 'background-color .3s ease, color .3s ease, border-color .3s ease',
            '& .MuiButton-startIcon': { mr: 0.75 },
            '&:hover': {
              borderColor: inCart ? 'success.dark' : 'text.primary',
              bgcolor: inCart ? 'success.dark' : 'text.primary',
              color: inCart ? 'success.contrastText' : 'background.paper',
            },
            '&.Mui-disabled': { borderColor: 'divider', color: 'text.disabled' },
          }}
        >
          {out ? 'Sold out' : inCart ? 'In cart' : 'Add to cart'}
        </Button>
      </CardActions>
    </Card>
  );
}