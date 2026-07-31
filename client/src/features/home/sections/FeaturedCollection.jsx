import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import Reveal from '../../../components/ui/Reveal.jsx';
import Button from '../../../components/ui/Button.jsx';
import { getProducts } from '../../../api/productsApi.js';

export default function FeaturedCollection() {
  const posthog = usePostHog();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts({ limit: 4 })
      .then(setProducts)
      .catch((err) => posthog?.captureException(err));
  }, [posthog]);

  if (products.length === 0) return null;

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
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.08}>
              <Link
                to={`/product/${product.slug}`}
                className="group block"
                onClick={() =>
                  posthog?.capture('product_clicked', {
                    product_id: product.id,
                    product_name: product.name,
                    price: product.price,
                    position: i,
                    // group analytics: attribute this event to the collection group
                    $groups: { collection: product.collection },
                  })
                }
              >
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
