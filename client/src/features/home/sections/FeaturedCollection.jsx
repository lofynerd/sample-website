import { Link } from 'react-router-dom';
import Reveal from '../../../components/ui/Reveal.jsx';
import Button from '../../../components/ui/Button.jsx';
import { FEATURED_PRODUCTS } from '../../product/mockProducts.js';

export default function FeaturedCollection() {
  return (
    <section className="bg-bone py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <Reveal>
            <span className="text-xs uppercase tracking-widest2 text-stone">
              Featured Collection
            </span>
            <h2 className="font-display text-display mt-6 text-balance">
              The Essentials, Reconsidered
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Button as={Link} to="/collections" variant="text">
              View all pieces
            </Button>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
          {FEATURED_PRODUCTS.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.08}>
              <Link to={`/product/${product.slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-sand mb-4 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                    loading="lazy"
                  />
                  {product.hoverImage && (
                    <img
                      src={product.hoverImage}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  )}
                </div>
                <h3 className="font-body text-sm">{product.name}</h3>
                <p className="text-sm text-stone mt-1">${product.price.toFixed(2)}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
