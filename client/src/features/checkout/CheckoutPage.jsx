import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePostHog } from '@posthog/react';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';
import useCartStore from '../../store/useCartStore.js';
import useAuthStore from '../../store/useAuthStore.js';
import apiClient from '../../api/client.js';
import authClient from '../../api/authClient.js';

export default function CheckoutPage() {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const authUser = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => Boolean(s.token));

  const [email, setEmail] = useState(authUser?.email ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || items.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const distinctId = posthog?.get_distinct_id?.() ?? email;
      const client = isLoggedIn ? authClient : apiClient;
      const { data } = await client.post('/orders', {
        distinctId,
        email,
        items,
        subtotal,
        collection: items[0]?.collection,
      });
      posthog?.capture('order_completed', { order_id: data.orderId, subtotal });
      clearCart();
      navigate('/', { state: { orderConfirmed: data.orderId } });
    } catch (err) {
      setError('Something went wrong placing your order. Please try again.');
      posthog?.captureException(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout — Maison Delulu</title>
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-3xl mx-auto pb-32">
        <Reveal className="mb-12">
          <span className="text-xs uppercase tracking-widest2 text-stone">Checkout</span>
          <h1 className="font-display text-display mt-6">
            {isLoggedIn ? 'Checkout' : 'Guest Checkout'}
          </h1>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-stone">Your bag is empty. Add something you'll love first.</p>
        ) : (
          <>
            <div className="mb-10 border-t border-mist">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex justify-between py-4 border-b border-mist text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between py-4 font-display text-lg">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
              <div>
                <label htmlFor="checkout-email" className="text-xs uppercase tracking-widest2 text-stone block mb-2">
                  Email for order confirmation
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent border-b border-mist py-3 text-sm focus:outline-none focus:border-ink"
                />
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}

              <Button variant="primary" size="lg" type="submit" disabled={submitting}>
                {submitting ? 'Placing Order…' : 'Place Order'}
              </Button>
              <p className="text-[11px] text-stone">
                This is a demo checkout. No payment is collected.
              </p>
            </form>
          </>
        )}
      </div>
    </>
  );
}
