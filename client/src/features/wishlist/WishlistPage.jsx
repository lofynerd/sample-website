import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Share2 } from 'lucide-react';
import { usePostHog } from '@posthog/react';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';
import useWishlistStore from '../../store/useWishlistStore.js';
import { FEATURED_PRODUCTS } from '../product/mockProducts.js';

export default function WishlistPage() {
  const posthog = usePostHog();
  const { productIds, toggle } = useWishlistStore();
  const items = FEATURED_PRODUCTS.filter((p) => productIds.includes(p.id));

  const handleShare = () => {
    posthog?.capture('wishlist_shared', { item_count: items.length });
    if (navigator.share) {
      navigator.share({ title: 'My Maison Delulu Wishlist', url: window.location.href });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Helmet>
        <title>Wishlist — Maison Delulu</title>
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-7xl mx-auto pb-32">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <Reveal>
            <span className="text-xs uppercase tracking-widest2 text-stone">Saved</span>
            <h1 className="font-display text-display mt-6">Your Wishlist</h1>
          </Reveal>
          {items.length > 0 && (
            <Reveal delay={0.1}>
              <Button variant="text" onClick={handleShare}>
                <Share2 size={14} className="inline mr-2" />
                Share
              </Button>
            </Reveal>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-stone mb-8">Nothing saved yet.</p>
            <Button as={Link} to="/collections" variant="ghost">
              Browse Collections
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
            {items.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 0.08}>
                <div className="group relative">
                  <Link to={`/product/${product.slug}`} className="block">
                    <div className="aspect-[3/4] overflow-hidden bg-sand mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-body text-sm">{product.name}</h3>
                    <p className="text-sm text-stone mt-1">${product.price.toFixed(2)}</p>
                  </Link>
                  <button
                    onClick={() => toggle(product)}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-bone/90 flex items-center justify-center"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
