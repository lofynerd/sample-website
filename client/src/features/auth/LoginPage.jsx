import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePostHog } from '@posthog/react';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';
import Turnstile from '../../components/ui/Turnstile.jsx';
import useAuthStore from '../../store/useAuthStore.js';
import useWishlistStore from '../../store/useWishlistStore.js';
import { login as loginRequest } from '../../api/authApi.js';

export default function LoginPage() {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: '', password: '' });
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError('Please complete the verification challenge.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const { token, user } = await loginRequest({ ...form, turnstileToken });
      setSession(token, user);
      posthog?.identify(user.id, { email: user.email, name: user.name });
      posthog?.capture('user_logged_in');
      useWishlistStore.getState().syncAfterLogin();
      navigate(location.state?.from?.pathname ?? '/account', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error ?? 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-transparent border-b border-mist py-3 text-sm focus:outline-none focus:border-ink';
  const labelClass = 'text-xs uppercase tracking-widest2 text-stone block mb-2';

  return (
    <>
      <Helmet>
        <title>Sign In — Maison Delulu</title>
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-md mx-auto pb-32">
        <Reveal className="mb-12">
          <span className="text-xs uppercase tracking-widest2 text-stone">Welcome Back</span>
          <h1 className="font-display text-display mt-6">Sign In</h1>
        </Reveal>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={update('password')}
              className={inputClass}
            />
            <Link to="/forgot-password" className="text-xs text-stone underline mt-2 inline-block">
              Forgot password?
            </Link>
          </div>

          <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button variant="primary" size="lg" type="submit" disabled={submitting}>
            {submitting ? 'Signing In…' : 'Sign In'}
          </Button>

          <p className="text-sm text-stone text-center">
            New here?{' '}
            <Link to="/register" className="text-ink underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
