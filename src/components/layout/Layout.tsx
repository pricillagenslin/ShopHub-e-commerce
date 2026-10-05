import { useState } from 'react';
import { AppBar, Badge, Box, Button, Container, Drawer, IconButton, InputBase, List, ListItemButton, ListItemText, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Menu, Search, Favorite, ShoppingCart, Person } from '@mui/icons-material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';

const nav = [['Home', '/'], ['All products', '/products'], ['Electronics', '/products?category=Electronics'], ['Jewellery', '/products?category=Jewellery'], ['Men', "/products?category=Men's Fashion"], ['Women', "/products?category=Women's Fashion"]];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useAppSelector((s) => s.wishlist.ids.length);
  const user = useAppSelector((s) => s.auth.user);
  const search = (e: React.FormEvent) => { e.preventDefault(); navigate(`/products?q=${encodeURIComponent(q)}`); };
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
        <Container maxWidth="xl"><Toolbar disableGutters sx={{ gap: 2 }}>
          {mobile && <IconButton onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></IconButton>}
          <Typography variant="h5" component={Link} to="/" sx={{ fontWeight: 800, color: 'primary.main', textDecoration: 'none' }}>Shop<Box component="span" sx={{ color: 'secondary.main' }}>Hub</Box></Typography>
          {!mobile && <Box sx={{ display: 'flex', flexGrow: 1 }}>{nav.slice(0, 6).map(([l, to]) => <Button key={l} component={Link} to={to} sx={{ color: 'text.primary' }}>{l}</Button>)}</Box>}
          <Box component="form" onSubmit={search} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f3f3f6', borderRadius: 2, px: 1.5, flexGrow: mobile ? 1 : 0 }}>
            <InputBase placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} sx={{ width: mobile ? '100%' : 200 }} inputProps={{ 'aria-label': 'Search' }} />
            <IconButton type="submit" size="small" aria-label="Search"><Search /></IconButton>
          </Box>
          <IconButton component={Link} to="/wishlist" aria-label="Wishlist"><Badge badgeContent={wishCount} color="secondary"><Favorite /></Badge></IconButton>
          <IconButton component={Link} to="/cart" aria-label="Cart"><Badge badgeContent={cartCount} color="secondary"><ShoppingCart /></Badge></IconButton>
          {user ? <Button startIcon={<Person />} onClick={() => dispatch(logout())}>Log out</Button> : <Button component={Link} to="/login" variant="outlined" size="small">Log in</Button>}
        </Toolbar></Container>
      </AppBar>
      <Drawer open={open} onClose={() => setOpen(false)}><List sx={{ width: 240 }}>{nav.map(([l, to]) => <ListItemButton key={l} component={Link} to={to} onClick={() => setOpen(false)}><ListItemText primary={l} /></ListItemButton>)}</List></Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}><Outlet /></Box>
      <Box sx={{ bgcolor: '#0f0f1e', color: '#fff', py: 4, textAlign: 'center' }}><Typography variant="body2" sx={{ opacity: 0.7 }}>© {new Date().getFullYear()} ShopHub. All rights reserved.</Typography></Box>
    </Box>
  );
}
