import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';

const AMOUNTS = [100, 250, 500, 1000];

export default function GiftCardsPage() {
  return (
    <>
      <Helmet>
        <title>Gift Cards — Maison Delulu</title>
        <meta name="description" content="Give the gift of Maison Delulu." />
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-3xl mx-auto pb-32 text-center">
        <Reveal>
          <span className="text-xs uppercase tracking-widest2 text-stone">Gift Cards</span>
          <h1 className="font-display text-display mt-6 mb-6">Give the House</h1>
          <p className="text-stone leading-relaxed max-w-xl mx-auto mb-12">
            Digital gift cards are delivered by email and never expire. Available in the
            following denominations.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto mb-12">
            {AMOUNTS.map((amount) => (
              <div
                key={amount}
                className="border border-mist py-8 font-display text-2xl hover:border-ink transition-colors cursor-pointer"
              >
                ${amount}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-stone text-sm mb-6">
            Gift cards are a demo feature on this site — purchasing isn't enabled. Explore the
            collection in the meantime.
          </p>
          <Button as={Link} to="/collections" variant="ghost">
            Browse Collections
          </Button>
        </Reveal>
      </div>
    </>
  );
}
