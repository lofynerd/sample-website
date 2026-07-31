import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore.js';

// Redirects to login when no customer session is present
export default function AuthGuard({ children }) {
  const isAuthenticated = useAuthStore((s) => Boolean(s.token));
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
