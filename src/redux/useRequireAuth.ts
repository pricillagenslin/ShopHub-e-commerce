import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/hooks';
import { showLoginPrompt, hideLoginPrompt } from './slices/uiSlice';

/**
 * Returns a `requireAuth(fn)` helper.
 * - If logged in → runs `fn()` and returns true.
 * - If guest     → opens the global login prompt and returns false.
 */
export default function useRequireAuth() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  const requireAuth = useCallback(
    (action: () => void) => {
      if (user) {
        action();
        return true;
      }
      dispatch(showLoginPrompt());
      return false;
    },
    [user, dispatch]
  );

  const closePrompt = useCallback(() => dispatch(hideLoginPrompt()), [dispatch]);

  return { user, isLoggedIn: !!user, requireAuth, closePrompt };
}