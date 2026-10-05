import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import { Login as LoginIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginPrompt({ open, onClose, message }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const goLogin = () => {
    onClose();
    navigate('/login', { state: { from: location.pathname } });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1, textAlign: 'center' }}>
        Login required
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: '0.95rem', textAlign: 'center' }}>
          {message ?? 'Please log in to add items to your cart or wishlist.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          color="inherit"
          startIcon={<CloseIcon fontSize="small" />}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={goLogin}
          variant="contained"
          color="secondary"
          startIcon={<LoginIcon fontSize="small" />}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 999, px: 3 }}
        >
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  );
}