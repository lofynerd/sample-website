import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../../../components/ui/Reveal.jsx';

const STEPS = [
  {
    id: 1,
    title: 'Sourcing',
    description:
      'We travel to the source. Every fiber is selected in person, from mills we have partnered with for over a decade.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Pattern',
    description:
      'Each silhouette is drafted and re-drafted by hand before a single cut is made, often dozens of times.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Construction',
    description:
      'Our ateliers favor slow construction techniques — hand-finished seams, bound edges, no shortcuts.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Inspection',
    description:
      'Every finished garment is inspected under natural light before it is permitted to carry our name.',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function Craftsmanship() {
  const [active, setActive] = useState(STEPS[0].id);
  const activeStep = STEPS.find((s) => s.id === active);

  return (
    <section className="bg-ink text-bone py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <span className="text-xs uppercase tracking-widest2 text-bone/50">
            The Process
          </span>
          <h2 className="font-display text-display mt-6 mb-16 max-w-2xl">
            Craftsmanship is a series of decisions, repeated correctly.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-bone/5">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStep.id}
                src={activeStep.image}
                alt={`${activeStep.title} stage of the manufacturing process`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </AnimatePresence>
          </div>

          <div className="flex flex-col">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActive(step.id)}
                className={`text-left py-6 border-t border-bone/15 transition-colors duration-300 ${
                  active === step.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
                aria-current={active === step.id}
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-body text-bone/50">0{step.id}</span>
                  <h3 className="font-display text-2xl">{step.title}</h3>
                </div>
                <AnimatePresence>
                  {active === step.id && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="text-bone/70 text-sm mt-3 max-w-md overflow-hidden"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
