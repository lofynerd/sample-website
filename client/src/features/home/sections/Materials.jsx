import Reveal from '../../../components/ui/Reveal.jsx';

const MATERIALS = [
  {
    name: 'Mulberry Silk',
    origin: 'Suzhou, China',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Merino Wool',
    origin: 'Tasmania, Australia',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Vegetable-Tanned Leather',
    origin: 'Tuscany, Italy',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function Materials() {
  return (
    <section className="bg-sand py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-16 max-w-2xl">
          <span className="text-xs uppercase tracking-widest2 text-stone">Materials</span>
          <h2 className="font-display text-display mt-6 text-balance">
            Traced to their origin. Chosen for their integrity.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {MATERIALS.map((material, i) => (
            <Reveal key={material.name} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden bg-mist mb-5">
                  <img
                    src={material.image}
                    alt={`Close-up texture of ${material.name}`}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-display text-xl">{material.name}</h3>
                <p className="text-xs text-stone uppercase tracking-wide mt-1">
                  {material.origin}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
