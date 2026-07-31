import { Navigate, useLocation } from 'react-router-dom';
import useAdminAuthStore from '../../store/useAdminAuthStore.js';

// Redirects to the admin login page when no session token is present
export default function AdminGuard({ children }) {
  const isAuthenticated = useAdminAuthStore((s) => Boolean(s.token));
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
