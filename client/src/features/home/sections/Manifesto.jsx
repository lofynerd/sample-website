import Reveal from '../../../components/ui/Reveal.jsx';

export default function Manifesto() {
  return (
    <section className="bg-bone py-32 md:py-48 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <span className="text-xs uppercase tracking-widest2 text-stone">Our Philosophy</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-display mt-8 text-balance">
            We do not chase trends.
            <br />
            We refine what already works.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-stone max-w-xl mx-auto mt-10 leading-relaxed">
            Every piece begins with a question: will this still matter in ten years? If the
            answer is uncertain, we do not make it. This is not minimalism for its own sake —
            it is a discipline against excess, a commitment to material honesty, and a quiet
            rebellion against the disposable.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
