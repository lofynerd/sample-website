import { Helmet } from 'react-helmet-async';
import Reveal from '../../components/ui/Reveal.jsx';

// Generic editorial content page: title + eyebrow + a list of section blocks
export default function SimplePage({ eyebrow, title, intro, sections = [] }) {
  return (
    <>
      <Helmet>
        <title>{title} — Maison Delulu</title>
        {intro && <meta name="description" content={intro} />}
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-3xl mx-auto pb-32">
        <Reveal className="mb-16">
          <span className="text-xs uppercase tracking-widest2 text-stone">{eyebrow}</span>
          <h1 className="font-display text-display mt-6">{title}</h1>
          {intro && <p className="text-stone mt-6 leading-relaxed">{intro}</p>}
        </Reveal>

        <div className="flex flex-col">
          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 0.06}>
              <div className="py-8 border-t border-mist">
                <h2 className="font-display text-xl mb-3">{section.heading}</h2>
                {Array.isArray(section.body) ? (
                  <ul className="text-stone text-sm leading-relaxed space-y-2 list-disc pl-5">
                    {section.body.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone text-sm leading-relaxed">{section.body}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
