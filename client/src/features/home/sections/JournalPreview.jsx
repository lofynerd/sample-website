import { Link } from 'react-router-dom';
import Reveal from '../../../components/ui/Reveal.jsx';
import Button from '../../../components/ui/Button.jsx';

const ARTICLES = [
  {
    slug: 'the-case-for-slowness',
    title: 'The Case for Slowness',
    category: 'Philosophy',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'a-visit-to-the-tannery',
    title: 'A Visit to the Tannery',
    category: 'Craft',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'notes-on-restraint',
    title: 'Notes on Restraint',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function JournalPreview() {
  return (
    <section className="bg-sand py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <Reveal>
            <span className="text-xs uppercase tracking-widest2 text-stone">The Journal</span>
            <h2 className="font-display text-display mt-6">Field Notes</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Button as={Link} to="/journal" variant="text">
              Read the journal
            </Button>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {ARTICLES.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.1}>
              <Link to={`/journal/${article.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden mb-5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs uppercase tracking-widest2 text-stone">
                  {article.category}
                </span>
                <h3 className="font-display text-xl mt-2">{article.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
