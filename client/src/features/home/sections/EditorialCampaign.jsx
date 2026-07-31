import { Link } from 'react-router-dom';
import Reveal from '../../../components/ui/Reveal.jsx';
import Button from '../../../components/ui/Button.jsx';

export default function EditorialCampaign() {
  return (
    <section className="bg-bone px-6 md:px-10 py-32">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 md:col-start-1 relative aspect-[4/5] md:aspect-[16/10] overflow-hidden">
          <Reveal y={0} className="w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2000&auto=format&fit=crop"
              alt="Editorial campaign photograph from the current season lookbook"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>

        <div className="md:col-span-4 md:col-start-9 flex flex-col gap-6">
          <Reveal>
            <span className="text-xs uppercase tracking-widest2 text-stone">
              Campaign — No. 07
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-display text-balance">
              Stillness, in Motion
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-stone leading-relaxed">
              Shot on location at dawn, this season's campaign explores the tension between
              structure and ease — tailoring loosened just enough to breathe.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Button as={Link} to="/journal/stillness-in-motion" variant="text">
              Read the story
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
