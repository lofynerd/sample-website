import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import Button from '../ui/Button.jsx';
import apiClient from '../../api/client.js';

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: ['New Arrivals', 'Ready-to-Wear', 'Accessories', 'Gift Cards'],
  },
  {
    title: 'House',
    links: ['About', 'Craftsmanship', 'Sustainability', 'Careers'],
  },
  {
    title: 'Support',
    links: ['Contact', 'Shipping', 'Returns', 'Size Guide'],
  },
];

export default function Footer() {
  const posthog = usePostHog();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    // No stable auth ID for guests yet, so email is used as the distinct ID fallback (unique, user-provided)
    posthog?.identify(email, { email, newsletter_subscriber: true });
    try {
      await apiClient.post('/newsletter/subscribe', { email });
      posthog?.capture('newsletter_subscribed');
      setSubmitted(true);
    } catch (err) {
      posthog?.captureException(err);
    }
  };

  return (
    <footer className="bg-ink text-bone">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pb-16 border-b border-bone/15">
          <div>
            <h2 className="font-display text-3xl mb-4">Join the House</h2>
            <p className="text-bone/60 text-sm max-w-sm mb-6">
              Be the first to receive our journal, campaign previews, and early access to
              limited collections.
            </p>
            {submitted ? (
              <p className="text-sm">Thank you — you're on the list.</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-0 max-w-md">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 bg-transparent border-b border-bone/40 py-3 text-sm placeholder:text-bone/40 focus:outline-none focus:border-bone"
                />
                <Button variant="light" size="sm" type="submit" className="ml-4">
                  Subscribe
                </Button>
              </form>
            )}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs uppercase tracking-widest2 text-bone/50 mb-4">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link to="#" className="text-sm text-bone/80 hover:text-bone transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-bone/50">
          <p>&copy; {new Date().getFullYear()} Maison Delulu. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-bone transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-bone transition-colors">Terms</Link>
            <Link to="/architecture" className="hover:text-bone transition-colors">Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
