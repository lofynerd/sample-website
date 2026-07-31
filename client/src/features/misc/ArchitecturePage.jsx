import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';

const STACK = [
  {
    layer: 'Frontend',
    detail: 'React 18 + Vite, Tailwind CSS, Framer Motion, Zustand for cart/wishlist state.',
  },
  {
    layer: 'Backend',
    detail: 'Node.js + Express, layered into routes, models, and a shared lib for cross-cutting concerns.',
  },
  {
    layer: 'Database',
    detail: 'MongoDB via Mongoose, targeting a dedicated "maison" database.',
  },
  {
    layer: 'Analytics & Observability',
    detail:
      'PostHog for product analytics, web analytics, session replay, error tracking, logs, surveys, and the support widget — instrumented on both frontend and backend.',
  },
  {
    layer: 'Email',
    detail: 'Transactional email (welcome, order receipts) via Nodemailer over Gmail SMTP.',
  },
];

export default function ArchitecturePage() {
  return (
    <>
      <Helmet>
        <title>Architecture — Maison Delulu</title>
        <meta
          name="description"
          content="A look at the technical architecture behind the Maison Delulu digital flagship."
        />
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-3xl mx-auto pb-32">
        <Reveal className="mb-16">
          <span className="text-xs uppercase tracking-widest2 text-stone">Developer Notes</span>
          <h1 className="font-display text-display mt-6">How This Is Built</h1>
          <p className="text-stone mt-6 leading-relaxed">
            This site is a full-stack commerce platform, not a template. Below is a brief map of
            the stack and the reasoning behind it.
          </p>
        </Reveal>

        <div className="flex flex-col">
          {STACK.map((item, i) => (
            <Reveal key={item.layer} delay={i * 0.08}>
              <div className="py-8 border-t border-mist">
                <h2 className="font-display text-xl mb-2">{item.layer}</h2>
                <p className="text-stone text-sm leading-relaxed">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
