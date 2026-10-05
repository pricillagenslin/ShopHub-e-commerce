import { createTheme } from '@mui/material';
export default createTheme({
  palette: { primary: { main: '#1a1a2e' }, secondary: { main: '#e94560' }, background: { default: '#f7f7fa' } },
  shape: { borderRadius: 8 },
  typography: { fontFamily: 'Inter, Roboto, sans-serif', button: { textTransform: 'none', fontWeight: 600 } },
});
