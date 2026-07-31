import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';
import { ARTICLES } from './mockArticles.js';

export default function JournalPage() {
  return (
    <>
      <Helmet>
        <title>Journal — Maison Delulu</title>
        <meta name="description" content="Field notes on craft, philosophy, and design from Maison Delulu." />
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-7xl mx-auto">
        <Reveal className="mb-16 max-w-2xl">
          <span className="text-xs uppercase tracking-widest2 text-stone">The Journal</span>
          <h1 className="font-display text-display mt-6">Field Notes</h1>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-16 pb-32">
          {ARTICLES.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.08}>
              <Link to={`/journal/${article.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden mb-5">
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
                <h2 className="font-display text-2xl mt-2 mb-2">{article.title}</h2>
                <p className="text-stone text-sm leading-relaxed">{article.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
