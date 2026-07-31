import SimplePage from './SimplePage.jsx';

export default function SizeGuidePage() {
  return (
    <SimplePage
      eyebrow="Support"
      title="Size Guide"
      intro="Our silhouettes are cut for a relaxed, considered fit. When between sizes, we recommend sizing up for outerwear and true to size for tailoring."
      sections={[
        {
          heading: 'Outerwear & Knitwear',
          body: ['XS — Chest 34–35"', 'S — Chest 36–37"', 'M — Chest 38–39"', 'L — Chest 40–42"', 'XL — Chest 43–45"'],
        },
        {
          heading: 'Trousers',
          body: ['XS — Waist 27–28"', 'S — Waist 29–30"', 'M — Waist 31–32"', 'L — Waist 33–35"', 'XL — Waist 36–38"'],
        },
        {
          heading: 'Dresses',
          body: 'Our dresses are cut to fall straight from the shoulder. Size according to your usual ready-to-wear size for the most accurate fit.',
        },
        {
          heading: 'Still Unsure?',
          body: 'Reach out through our Contact page with your measurements and we will recommend a size personally.',
        },
      ]}
    />
  );
}
