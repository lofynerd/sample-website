import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';
import { verifyEmail } from '../../api/authApi.js';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <>
      <Helmet>
        <title>Verify Email — Maison Delulu</title>
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-md mx-auto pb-32 text-center">
        <Reveal>
          <span className="text-xs uppercase tracking-widest2 text-stone">Account</span>
          <h1 className="font-display text-display mt-6 mb-6">Email Verification</h1>
        </Reveal>

        {status === 'verifying' && <p className="text-stone">Verifying your email…</p>}
        {status === 'success' && (
          <p className="text-stone">
            Your email is verified.{' '}
            <Link to="/account" className="underline text-ink">
              Go to your account
            </Link>
            .
          </p>
        )}
        {status === 'error' && (
          <p className="text-stone">
            This verification link is invalid or has expired.{' '}
            <Link to="/account" className="underline text-ink">
              Return to your account
            </Link>
            .
          </p>
        )}
      </div>
    </>
  );
}
