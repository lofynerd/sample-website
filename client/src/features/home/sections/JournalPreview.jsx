import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import Reveal from '../../../components/ui/Reveal.jsx';
import Button from '../../../components/ui/Button.jsx';
import { getArticles } from '../../../api/journalApi.js';

export default function JournalPreview() {
  const posthog = usePostHog();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles({ limit: 3 })
      .then(setArticles)
      .catch((err) => posthog?.captureException(err));
  }, [posthog]);

  if (articles.length === 0) return null;

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
          {articles.map((article, i) => (
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
