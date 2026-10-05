import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import theme from './theme';
import AppRoutes from './routes';
import GlobalLoginPrompt from './components/common/GlobalLoginPrompt';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
          <GlobalLoginPrompt />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}