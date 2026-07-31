import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import { usePostHog } from '@posthog/react';
import useCartStore from '../../store/useCartStore.js';
import Button from '../../components/ui/Button.jsx';

export default function CartDrawer({ isOpen, onClose }) {
  const posthog = usePostHog();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-ink/40 z-[70]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-bone z-[80] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-mist">
              <h2 className="font-display text-2xl">Your Bag</h2>
              <button onClick={onClose} aria-label="Close cart">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <p className="text-stone text-sm mt-12 text-center">Your bag is empty.</p>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((item) => (
                    <li
                      key={`${item.productId}-${item.variantId}`}
                      className="flex gap-4 border-b border-mist pb-6"
                    >
                      <div className="w-20 h-28 bg-sand flex-shrink-0 overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-body text-sm">{item.name}</p>
                          {item.color && (
                            <p className="text-xs text-stone mt-1">
                              {item.color} {item.size && `· ${item.size}`}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 border border-mist px-2 py-1">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(item.productId, item.variantId, item.quantity - 1)
                              }
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(item.productId, item.variantId, item.quantity + 1)
                              }
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-stone hover:text-ink self-start"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-mist">
                <div className="flex justify-between text-sm mb-4">
                  <span className="uppercase tracking-widest2 text-xs text-stone">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    posthog?.capture('checkout_clicked', {
                      item_count: items.reduce((sum, i) => sum + i.quantity, 0),
                      subtotal,
                    })
                  }
                >
                  Checkout
                </Button>
                <p className="text-[11px] text-stone text-center mt-3">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
