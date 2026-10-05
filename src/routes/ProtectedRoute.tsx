import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAppSelector((s) => s.auth.user);
  const loc = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />;
}
