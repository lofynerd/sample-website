import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePostHog } from '@posthog/react';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';
import Turnstile from '../../components/ui/Turnstile.jsx';
import useAuthStore from '../../store/useAuthStore.js';
import useWishlistStore from '../../store/useWishlistStore.js';
import { register } from '../../api/authApi.js';

export default function RegisterPage() {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const { token, user } = await register({ ...form, turnstileToken });
      login(token, user);
      posthog?.identify(user.id, { email: user.email, name: user.name });
      posthog?.capture('user_registered');
      useWishlistStore.getState().syncAfterLogin();
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong creating your account.');
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
        <title>Create Account — Maison Delulu</title>
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-md mx-auto pb-32">
        <Reveal className="mb-12">
          <span className="text-xs uppercase tracking-widest2 text-stone">Join the House</span>
          <h1 className="font-display text-display mt-6">Create Account</h1>
        </Reveal>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className={labelClass}>Name</label>
            <input value={form.name} onChange={update('name')} className={inputClass} />
          </div>
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
              minLength={8}
              value={form.password}
              onChange={update('password')}
              className={inputClass}
            />
            <p className="text-xs text-stone mt-2">At least 8 characters.</p>
          </div>

          <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button variant="primary" size="lg" type="submit" disabled={submitting}>
            {submitting ? 'Creating Account…' : 'Create Account'}
          </Button>

          <p className="text-sm text-stone text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-ink underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
