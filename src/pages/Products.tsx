import { useEffect, useMemo, useState } from 'react';
import { Container, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Slider, Stack, Typography, Rating } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { EmptyState, ErrorState, Loading } from '../components/common/PageState';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCategories, fetchProducts } from '../redux/slices/productSlice';

const PER_PAGE = 8;   // 👈 was 6, now 8 = 2 clean rows of 4

export default function Products() {
  const d = useAppDispatch();
  const { items, categories, status, error } = useAppSelector((s) => s.products);
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') ?? '').toLowerCase();
  const category = params.get('category') ?? '';
  const [sort, setSort] = useState('featured');
  const [price, setPrice] = useState<number[]>([0, 1500]);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => { if (status === 'idle') { d(fetchProducts()); d(fetchCategories()); } }, [d, status]);
  useEffect(() => setPage(1), [q, category, sort, price, minRating]);

  const list = useMemo(() => {
    const r = items.filter((p) => p.name.toLowerCase().includes(q) && (!category || p.category === category) && p.price >= price[0] && p.price <= price[1] && p.rating >= minRating);
    if (sort === 'low') r.sort((a, b) => a.price - b.price);
    if (sort === 'high') r.sort((a, b) => b.price - a.price);
    if (sort === 'rating') r.sort((a, b) => b.rating - a.rating);
    return r;
  }, [items, q, category, price, minRating, sort]);

  const setCat = (v: string) => {
    const n = new URLSearchParams(params);
    v ? n.set('category', v) : n.delete('category');
    setParams(n);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        {category || 'All products'}
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }} alignItems={{ md: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select label="Category" value={category} onChange={(e) => setCat(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort by</InputLabel>
          <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="low">Price: low to high</MenuItem>
            <MenuItem value="high">Price: high to low</MenuItem>
            <MenuItem value="rating">Top rated</MenuItem>
          </Select>
        </FormControl>
        <Stack sx={{ width: 220, px: 1 }}>
          <Typography variant="caption">Price: ${price[0]} - ${price[1]}</Typography>
          <Slider value={price} min={0} max={1500} step={10} onChange={(_, v) => setPrice(v as number[])} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption">Min rating</Typography>
          <Rating value={minRating} onChange={(_, v) => setMinRating(v ?? 0)} />
        </Stack>
      </Stack>

      {status === 'loading' && <Loading />}
      {status === 'failed' && <ErrorState message={error} />}
      {status === 'succeeded' && list.length === 0 && (
        <EmptyState title="No products found" hint="Try changing your search or filters." cta="Clear filters" />
      )}

      {/* ✅ 4 per row on md+ / 3 on sm / 2 on xs */}
      <Grid container spacing={3}>
        {list.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => (
          <Grid item xs={6} sm={4} md={3} lg={3} xl={3} key={p.id}>
            <ProductCard product={p} />
          </Grid>
        ))}
      </Grid>

      {list.length > PER_PAGE && (
        <Stack alignItems="center" sx={{ mt: 5 }}>
          <Pagination count={Math.ceil(list.length / PER_PAGE)} page={page} onChange={(_, v) => setPage(v)} />
        </Stack>
      )}
    </Container>
  );
}