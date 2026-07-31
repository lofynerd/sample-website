import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePostHog } from '@posthog/react';
import Reveal from '../../components/ui/Reveal.jsx';
import { getProducts } from '../../api/productsApi.js';

const TITLES = {
  Outerwear: 'Ready-to-Wear',
  Dresses: 'Ready-to-Wear',
  Trousers: 'Ready-to-Wear',
  Bags: 'Accessories',
};

export default function CollectionsPage() {
  const posthog = usePostHog();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts(category ? { category } : {})
      .then(setProducts)
      .catch((err) => posthog?.captureException(err))
      .finally(() => setLoading(false));
  }, [category, posthog]);

  const title = category ? TITLES[category.split(',')[0]] ?? 'Collections' : 'The Full Range';

  return (
    <>
      <Helmet>
        <title>{title} — Maison Delulu</title>
        <meta name="description" content="Explore the full Maison Delulu collection." />
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-7xl mx-auto">
        <Reveal className="mb-16 max-w-2xl">
          <span className="text-xs uppercase tracking-widest2 text-stone">
            {category ? 'Filtered' : 'All Collections'}
          </span>
          <h1 className="font-display text-display mt-6">{title}</h1>
        </Reveal>

        {loading ? (
          <p className="text-stone text-sm pb-32">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-stone text-sm pb-32">No pieces found in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14 pb-32">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={(i % 6) * 0.06}>
                <Link to={`/product/${product.slug}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden bg-sand mb-4 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-wide text-stone">
                    {product.category}
                  </span>
                  <h3 className="font-body text-sm mt-1">{product.name}</h3>
                  <p className="text-sm text-stone mt-1">${product.price.toFixed(2)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
