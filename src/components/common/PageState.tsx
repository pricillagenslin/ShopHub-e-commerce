import { Alert, Box, CircularProgress, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
export const Loading = () => <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="secondary" /></Box>;
export const ErrorState = ({ message }: { message?: string }) => <Alert severity="error" sx={{ my: 4 }}>{message ?? 'Something went wrong. Please try again.'}</Alert>;
export const EmptyState = ({ title, hint, cta = 'Browse products' }: { title: string; hint?: string; cta?: string }) => (
  <Box sx={{ textAlign: 'center', py: 10 }}>
    <Typography variant="h5" fontWeight={700}>{title}</Typography>
    {hint && <Typography color="text.secondary" sx={{ mt: 1 }}>{hint}</Typography>}
    <Button component={Link} to="/products" variant="contained" color="secondary" sx={{ mt: 3 }}>{cta}</Button>
  </Box>
);
