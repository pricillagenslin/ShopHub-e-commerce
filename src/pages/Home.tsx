import { useEffect, useState } from 'react';
import { Box, Button, Card, CardActionArea, CardMedia, Container, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { Loading, ErrorState } from '../components/common/PageState';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCategories, fetchProducts } from '../redux/slices/productSlice';

interface Slide {
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

const slides: Slide[] = [
  {
    title: 'Discover your',
    highlight: 'perfect style',
    subtitle: 'Electronics, fine jewellery, and fashion for men and women.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
    cta: 'Shop now',
    link: '/products',
  },
  {
    title: 'Elevate your',
    highlight: 'everyday look',
    subtitle: 'Curated essentials that blend comfort, quality, and modern design.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
    cta: 'Explore collection',
    link: '/products',
  },
  {
    title: 'Timeless pieces',
    highlight: 'for every moment',
    subtitle: 'Handpicked jewellery and accessories that make a statement.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
    cta: 'Discover more',
    link: '/products',
  },
];

export default function Home() {
  const d = useAppDispatch();
  const { items, categories, status, error } = useAppSelector((s) => s.products);
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => { d(fetchProducts()); d(fetchCategories()); }, [d]);

  // Auto-advance the carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <>
      {/* ---- Sliding Banner Section ---- */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 420, md: 600 },
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: index === current ? 1 : 0,
              transition: 'opacity 0.9s ease-in-out, transform 0.9s ease-in-out',
              transform: index === current ? 'scale(1)' : 'scale(1.05)',
              backgroundImage: `linear-gradient(135deg, rgba(26,26,46,0.85) 0%, rgba(22,33,62,0.75) 50%, rgba(15,52,96,0.65) 100%), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Container maxWidth="xl">
              <Box
                sx={{
                  maxWidth: 600,
                 marginLeft: '30px',
                  animation: index === current ? 'slideUp 0.8s ease-out forwards' : 'none',
                  '@keyframes slideUp': {
                    '0%': { opacity: 0, transform: 'translateY(40px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, lineHeight: 1.2 }}
                >
                  {slide.title}{' '}
                  <Box component="span" sx={{ color: 'secondary.main' }}>
                    {slide.highlight}
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ my: 3, opacity: 0.9, fontWeight: 400, maxWidth: 520 }}
                >
                  {slide.subtitle}
                </Typography>
                <Button
                  component={Link}
                  to={slide.link}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ px: 4, py: 1.5 }}
                >
                  {slide.cta}
                </Button>
              </Box>
            </Container>
          </Box>
        ))}
 

        {/* ---- Dot Indicators ---- */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1.5,
            zIndex: 2,
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => goTo(index)}
              sx={{
                width: index === current ? 32 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor: index === current ? 'secondary.main' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* ---- Categories ---- */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Shop by category</Typography>
        <Grid container spacing={3}>{categories.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.id}>
            <Card sx={{ borderRadius: 3, position: 'relative', height: 240 }}>
              <CardActionArea component={Link} to={`/products?category=${encodeURIComponent(c.name)}`} sx={{ height: '100%' }}>
                <CardMedia component="img" image={c.image} alt={c.name} sx={{ height: '100%' }} />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,.4)', color: '#fff', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <Typography variant="h6" fontWeight={700}>{c.name}</Typography><Typography variant="body2">{c.itemCount} products</Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>))}
        </Grid>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 8, mb: 3 }}>Featured products</Typography>
        {status === 'loading' && <Loading />}
        {status === 'failed' && <ErrorState message={error} />}
        <Grid container spacing={3}>{items.slice(0, 8).map((p) => <Grid item xs={12} sm={6} md={3} key={p.id}><ProductCard product={p} /></Grid>)}</Grid>
      </Container>
    </>
  );
}