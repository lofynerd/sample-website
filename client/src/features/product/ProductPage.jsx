import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { usePostHog } from '@posthog/react';
import { getProductBySlug, getRelatedProducts } from '../../api/productsApi.js';
import Button from '../../components/ui/Button.jsx';
import Reveal from '../../components/ui/Reveal.jsx';
import useCartStore from '../../store/useCartStore.js';
import useWishlistStore from '../../store/useWishlistStore.js';
import NotFoundPage from '../misc/NotFoundPage.jsx';

export default function ProductPage() {
  const { slug } = useParams();
  const posthog = usePostHog();
  const addItem = useCartStore((s) => s.addItem);
  const { isWishlisted, toggle } = useWishlistStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getProductBySlug(slug)
      .then(async (data) => {
        if (cancelled) return;
        setProduct(data);
        setSelectedColor(data.colors?.[0] ?? null);
        setActiveImage(0);
        setSelectedSize(null);
        const relatedProducts = await getRelatedProducts(data);
        if (!cancelled) setRelated(relatedProducts);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          posthog?.captureException(err);
        }
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [slug, posthog]);

  if (notFound) return <NotFoundPage />;
  if (loading || !product) return <div className="pt-40 text-center text-stone text-sm">Loading…</div>;

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, {
      id: `${selectedColor?.id}-${selectedSize}`,
      color: selectedColor?.name,
      size: selectedSize,
      price: product.price,
      image: selectedColor?.image ?? product.image,
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.name} — Maison Delulu</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} — Maison Delulu`} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="pt-28 md:pt-32 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/5] bg-sand overflow-hidden mb-4 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={`${product.name}, view ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden border transition-colors ${
                    activeImage === i ? 'border-ink' : 'border-transparent'
                  }`}
                  aria-label={`View image ${i + 1}`}
                  aria-current={activeImage === i}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Sticky purchase panel */}
          <div className="md:sticky md:top-32 md:self-start">
            <span className="text-xs uppercase tracking-widest2 text-stone">
              {product.category}
            </span>
            <h1 className="font-display text-display mt-3 mb-4">{product.name}</h1>
            <p className="text-lg mb-6">${product.price.toFixed(2)}</p>
            <p className="text-stone text-sm leading-relaxed mb-8 max-w-md">
              {product.description}
            </p>

            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest2 text-stone mb-3">
                  Color — {selectedColor?.name}
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color.name}
                      aria-current={selectedColor?.id === color.id}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        selectedColor?.id === color.id
                          ? 'border-ink scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.swatch }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest2 text-stone mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-current={selectedSize === size}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedSize === size
                        ? 'border-ink bg-ink text-bone'
                        : 'border-mist hover:border-ink'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!selectedSize}
                onClick={handleAddToCart}
              >
                {selectedSize ? 'Add to Bag' : 'Select a Size'}
              </Button>
              <button
                onClick={() => toggle(product)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wishlisted}
                className="w-14 h-14 flex items-center justify-center border border-mist hover:border-ink transition-colors flex-shrink-0"
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="text-xs text-stone mb-10">
              Estimated delivery in 3–5 business days. Complimentary gift packaging available at
              checkout.
            </p>

            <details className="border-t border-mist py-4">
              <summary className="text-xs uppercase tracking-widest2 cursor-pointer">
                Materials
              </summary>
              <ul className="text-sm text-stone mt-3 space-y-1">
                {product.materials.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </details>
            <details className="border-t border-mist py-4">
              <summary className="text-xs uppercase tracking-widest2 cursor-pointer">
                Care Guide
              </summary>
              <ul className="text-sm text-stone mt-3 space-y-1">
                {product.care.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </details>
            <details className="border-t border-b border-mist py-4">
              <summary className="text-xs uppercase tracking-widest2 cursor-pointer">
                The Story
              </summary>
              <p className="text-sm text-stone mt-3 leading-relaxed">{product.story}</p>
            </details>
          </div>
        </div>

        {/* Cross-sell */}
        {related.length > 0 && (
          <section className="py-24 md:py-32">
            <Reveal>
              <h2 className="font-display text-title mb-10">You May Also Like</h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {related.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.08}>
                  <Link
                    to={`/product/${item.slug}`}
                    className="group block"
                    onClick={() =>
                      posthog?.capture('related_product_clicked', {
                        product_id: item.id,
                        from_product_id: product.id,
                      })
                    }
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-sand mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-body text-sm">{item.name}</h3>
                    <p className="text-sm text-stone mt-1">${item.price.toFixed(2)}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
