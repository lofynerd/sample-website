import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';
import { FEATURED_PRODUCTS } from './mockProducts.js';

export default function CollectionsPage() {
  return (
    <>
      <Helmet>
        <title>Collections — Maison Delulu</title>
        <meta name="description" content="Explore the full Maison Delulu collection." />
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-7xl mx-auto">
        <Reveal className="mb-16 max-w-2xl">
          <span className="text-xs uppercase tracking-widest2 text-stone">All Collections</span>
          <h1 className="font-display text-display mt-6">The Full Range</h1>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14 pb-32">
          {FEATURED_PRODUCTS.map((product, i) => (
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
      </div>
    </>
  );
}
