import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';
import { forgotPassword } from '../../api/authApi.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(email);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password — Maison Delulu</title>
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-md mx-auto pb-32">
        <Reveal className="mb-12">
          <span className="text-xs uppercase tracking-widest2 text-stone">Account Recovery</span>
          <h1 className="font-display text-display mt-6">Reset Password</h1>
          <p className="text-stone mt-6 leading-relaxed">
            Enter your email and we'll send a link to reset your password.
          </p>
        </Reveal>

        {submitted ? (
          <p className="text-stone">
            If an account exists for that email, a reset link is on its way.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent border-b border-mist py-3 text-sm focus:outline-none focus:border-ink"
            />
            <Button variant="primary" size="lg" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
