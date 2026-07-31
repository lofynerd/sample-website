import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';
import { resetPassword } from '../../api/authApi.js';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error ?? 'This reset link is invalid or has expired.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-md mx-auto pb-32 text-center">
        <p className="text-stone">
          This link is missing a reset token.{' '}
          <Link to="/forgot-password" className="underline text-ink">
            Request a new one
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password — Maison Delulu</title>
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-md mx-auto pb-32">
        <Reveal className="mb-12">
          <span className="text-xs uppercase tracking-widest2 text-stone">Account Recovery</span>
          <h1 className="font-display text-display mt-6">Set a New Password</h1>
        </Reveal>

        {done ? (
          <p className="text-stone">Password updated. Redirecting you to sign in…</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-transparent border-b border-mist py-3 text-sm focus:outline-none focus:border-ink"
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <Button variant="primary" size="lg" type="submit" disabled={submitting}>
              {submitting ? 'Updating…' : 'Update Password'}
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
