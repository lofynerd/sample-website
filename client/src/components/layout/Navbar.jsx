import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { usePostHog } from '@posthog/react';
import useCartStore from '../../store/useCartStore.js';
import useAuthStore from '../../store/useAuthStore.js';
import CartDrawer from '../../features/cart/CartDrawer.jsx';

const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Journal', href: '/journal' },
  { label: 'Craftsmanship', href: '/craftsmanship' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const posthog = usePostHog();
  const isLoggedIn = useAuthStore((s) => Boolean(s.token));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, toggleCart, isOpen } = useCartStore((s) => ({
    itemCount: s.items.reduce((sum, i) => sum + i.quantity, 0),
    toggleCart: s.toggleCart,
    isOpen: s.isOpen,
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-luxury ${
          scrolled ? 'bg-bone/90 backdrop-blur-md border-b border-mist' : 'bg-transparent'
        }`}
      >
        <nav
          className="grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 py-5 gap-4"
          aria-label="Primary navigation"
        >
          <div className="flex items-center gap-8 justify-self-start">
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-xs uppercase tracking-widest2 hover:text-accent transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/"
            className="font-display text-lg md:text-2xl tracking-wide uppercase whitespace-nowrap justify-self-center"
          >
            Maison Delulu
          </Link>

          <div className="flex items-center gap-8 justify-self-end">
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.slice(2).map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-xs uppercase tracking-widest2 hover:text-accent transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-5">
              <button
                aria-label="Search"
                className="hidden sm:block hover:text-accent transition-colors"
                onClick={() => posthog?.capture('search_clicked')}
              >
                <Search size={19} strokeWidth={1.5} />
              </button>
              <Link to="/wishlist" aria-label="Wishlist" className="hidden sm:block hover:text-accent transition-colors">
                <Heart size={19} strokeWidth={1.5} />
              </Link>
              <Link
                to={isLoggedIn ? '/account' : '/login'}
                aria-label={isLoggedIn ? 'My account' : 'Sign in'}
                className="hidden sm:block hover:text-accent transition-colors"
              >
                <User size={19} strokeWidth={1.5} />
              </Link>
              <button
                aria-label={`Cart, ${itemCount} items`}
                onClick={() => {
                  if (!isOpen) posthog?.capture('cart_opened', { item_count: itemCount });
                  toggleCart();
                }}
                className="relative hover:text-accent transition-colors"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-ink text-bone text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-bone flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-8 mt-12">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-3xl"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isOpen} onClose={toggleCart} />
    </>
  );
}
