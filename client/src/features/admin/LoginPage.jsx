import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAdminAuthStore from '../../store/useAdminAuthStore.js';
import { login } from '../../api/adminApi.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setToken = useAdminAuthStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const token = await login(username, password);
      setToken(token);
      navigate(location.state?.from?.pathname ?? '/admin', { replace: true });
    } catch {
      setError('Invalid username or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — Maison Delulu</title>
      </Helmet>
      <div className="min-h-screen bg-[#0e0e0f] text-[#e5e5e5] flex items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-display text-2xl text-center mb-8">Maison Delulu Admin</h1>

          <label className="block text-xs uppercase tracking-widest2 text-white/50 mb-2">
            Username
          </label>
          <input
            type="text"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm mb-5 focus:outline-none focus:border-white/40"
          />

          <label className="block text-xs uppercase tracking-widest2 text-white/50 mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm mb-6 focus:outline-none focus:border-white/40"
          />

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-ink py-3 text-xs uppercase tracking-widest2 hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </>
  );
}
