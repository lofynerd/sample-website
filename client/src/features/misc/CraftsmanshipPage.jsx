import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';
import Craftsmanship from '../home/sections/Craftsmanship.jsx';
import Materials from '../home/sections/Materials.jsx';
import BehindTheScenes from '../home/sections/BehindTheScenes.jsx';

export default function CraftsmanshipPage() {
  return (
    <>
      <Helmet>
        <title>Craftsmanship — Maison Delulu</title>
        <meta
          name="description"
          content="An inside look at the manufacturing process, materials, and ateliers behind Maison Delulu."
        />
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-4xl mx-auto text-center mb-8">
        <Reveal>
          <span className="text-xs uppercase tracking-widest2 text-stone">Craftsmanship</span>
          <h1 className="font-display text-display mt-6 text-balance">
            Made Slowly, On Purpose
          </h1>
          <p className="text-stone mt-6 leading-relaxed max-w-xl mx-auto">
            Every piece we make passes through the same hands, the same ateliers, and the same
            standard of inspection — regardless of how long that takes.
          </p>
        </Reveal>
      </div>

      <Craftsmanship />
      <Materials />
      <BehindTheScenes />
    </>
  );
}
