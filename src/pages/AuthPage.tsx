import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login, register } from '../redux/slices/authSlice';

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useAppSelector((s) => s.auth);
  const d = useAppDispatch();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isLogin && f.name.trim().length < 2) e.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email';
    if (f.password.length < 6) e.password = 'Use at least 6 characters';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const res = await d(
      isLogin ? login({ email: f.email, password: f.password }) : register(f)
    );
    if (res.meta.requestStatus === 'fulfilled') nav(from, { replace: true });
  };

  const goBack = () => {
    if (window.history.length > 1) nav(-1);
    else nav('/');
  };

  const field = (
    k: 'name' | 'email' | 'password',
    label: string,
    type = 'text',
    icon?: React.ReactNode
  ) => (
    <TextField
      label={label}
      type={k === 'password' ? (showPassword ? 'text' : 'password') : type}
      value={f[k]}
      onChange={(e) => setF({ ...f, [k]: e.target.value })}
      error={!!errs[k]}
      helperText={errs[k]}
      fullWidth
      variant="outlined"
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : undefined,
        endAdornment:
          k === 'password' ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((v) => !v)}
                edge="end"
                size="small"
                aria-label="toggle password visibility"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ) : undefined,
      }}
    />
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            p: { xs: 3, sm: 4.5 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 60px -20px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            bgcolor: 'background.paper',
          }}
        >
          {/* Back button */}
          <IconButton
            onClick={goBack}
            aria-label="Go back"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              color: 'text.secondary',
              bgcolor: 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected',
                color: 'text.primary',
              },
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>

          {/* Header */}
          <Stack spacing={0.5} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                mb: 1,
                boxShadow: '0 8px 20px -6px rgba(0,0,0,0.25)',
              }}
            >
              {isLogin ? <LockOutlined /> : <PersonOutline />}
            </Box>
            <Typography variant="h5" fontWeight={800} letterSpacing={-0.3}>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {isLogin
                ? 'Log in to continue shopping with ShopHub'
                : 'Join ShopHub and start your shopping journey'}
            </Typography>
          </Stack>

          {/* Alerts */}
          {isLogin && (
            <Alert
              severity="info"
              variant="outlined"
              sx={{ mb: 2, borderRadius: 2, fontSize: '0.85rem' }}
            >
              Demo: <strong>demo@shophub.com</strong> / <strong>Demo@123</strong>
            </Alert>
          )}
          {error && (
            <Alert severity="error" variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={submit}
            noValidate
            sx={{ display: 'grid', gap: 2 }}
          >
            {!isLogin &&
              field('name', 'Full name', 'text', <PersonOutline fontSize="small" />)}
            {field('email', 'Email', 'email', <EmailOutlined fontSize="small" />)}
            {field('password', 'Password', 'password', <LockOutlined fontSize="small" />)}

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{
                mt: 0.5,
                py: 1.3,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 10px 24px -10px rgba(0,0,0,0.35)',
                '&:hover': {
                  boxShadow: '0 14px 28px -10px rgba(0,0,0,0.45)',
                },
              }}
            >
              {loading ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Footer link */}
          <Typography variant="body2" textAlign="center" color="text.secondary">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <MuiLink
              component={Link}
              to={isLogin ? '/register' : '/login'}
              underline="hover"
              sx={{ fontWeight: 700, color: 'secondary.main' }}
            >
              {isLogin ? 'Create one' : 'Log in'}
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}