import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { hideLoginPrompt } from '../../redux/slices/uiSlice';
import LoginPrompt from './LoginPrompt';

export default function GlobalLoginPrompt() {
  const open = useAppSelector((s) => s.ui.loginPromptOpen);
  const message = useAppSelector((s) => s.ui.loginPromptMessage);
  const dispatch = useAppDispatch();
  return (
    <LoginPrompt
      open={open}
      message={message}
      onClose={() => dispatch(hideLoginPrompt())}
    />
  );
}