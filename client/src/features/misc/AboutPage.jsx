import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';
import Manifesto from '../home/sections/Manifesto.jsx';

const TIMELINE = [
  { year: '2016', label: 'Founded in a single room above a fabric mill.' },
  { year: '2019', label: 'First atelier partnership, Tuscany.' },
  { year: '2022', label: 'Opened our first flagship, by appointment only.' },
  { year: '2026', label: 'Digital flagship — the house, reconsidered online.' },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — Maison Delulu</title>
        <meta
          name="description"
          content="Maison Delulu is an independent luxury fashion house, for the delusionally ambitious."
        />
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-4xl mx-auto text-center mb-8">
        <Reveal>
          <span className="text-xs uppercase tracking-widest2 text-stone">About the House</span>
          <h1 className="font-display text-display mt-6 text-balance">
            For the Delusionally Ambitious
          </h1>
          <p className="text-stone mt-6 leading-relaxed max-w-xl mx-auto">
            We believe wanting more than seems reasonable is not a flaw. It's how anything
            worthwhile gets built.
          </p>
        </Reveal>
      </div>

      <Manifesto />

      <section className="bg-sand py-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-16 text-center">
            <span className="text-xs uppercase tracking-widest2 text-stone">Our History</span>
            <h2 className="font-display text-display mt-6">A Decade, Briefly</h2>
          </Reveal>
          <div className="flex flex-col">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.1}>
                <div className="flex gap-8 py-6 border-t border-mist items-baseline">
                  <span className="font-display text-2xl w-20 flex-shrink-0">{item.year}</span>
                  <p className="text-stone">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
