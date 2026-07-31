import Reveal from '../../../components/ui/Reveal.jsx';

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
];

export default function InstagramGallery() {
  return (
    <section className="bg-bone py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest2 text-stone">@maisondelulu</span>
          <h2 className="font-display text-display mt-6">Worn, Not Staged</h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {GALLERY_IMAGES.map((src, i) => (
            <Reveal key={src} delay={(i % 6) * 0.05} y={16}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden group"
                aria-label="View on Instagram"
              >
                <img
                  src={src}
                  alt="Community styling of Maison Delulu pieces"
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
                  loading="lazy"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
