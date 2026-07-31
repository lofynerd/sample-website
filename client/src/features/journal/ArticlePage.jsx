import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';
import { getArticleBySlug } from './mockArticles.js';
import NotFoundPage from '../misc/NotFoundPage.jsx';

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) return <NotFoundPage />;

  return (
    <>
      <Helmet>
        <title>{article.title} — Maison Delulu Journal</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:type" content="article" />
      </Helmet>

      <article className="pt-32 md:pt-40 pb-32">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center mb-12">
          <Reveal>
            <span className="text-xs uppercase tracking-widest2 text-stone">
              {article.category}
            </span>
            <h1 className="font-display text-display mt-6 text-balance">{article.title}</h1>
            <time className="text-xs text-stone uppercase tracking-wide block mt-6">
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </Reveal>
        </div>

        <Reveal className="max-w-5xl mx-auto px-6 md:px-10 mb-16" y={16}>
          <div className="aspect-[16/9] overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </Reveal>

        <div className="max-w-2xl mx-auto px-6 md:px-10">
          {article.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-stone leading-relaxed mb-6 text-lg font-display">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </article>
    </>
  );
}
