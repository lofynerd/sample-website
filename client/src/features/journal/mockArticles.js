// Temporary mock journal data, will be replaced by GET /api/v1/journal
export const ARTICLES = [
  {
    slug: 'the-case-for-slowness',
    title: 'The Case for Slowness',
    category: 'Philosophy',
    date: '2026-03-02',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'In an industry built on speed, we asked what happens when a house refuses to rush.',
    body: [
      'Every season, the pressure to move faster grows. Faster production cycles, faster delivery, faster obsolescence. We have chosen the opposite direction.',
      'Slowness is not inefficiency. It is a discipline — one that asks whether a garment deserves to exist before asking how quickly it can be made.',
      'When you slow down enough, you notice things: the grain of a fabric, the weight of a seam, the way a silhouette holds its shape after the hundredth wear. These are the details that speed erases.',
    ],
  },
  {
    slug: 'a-visit-to-the-tannery',
    title: 'A Visit to the Tannery',
    category: 'Craft',
    date: '2026-02-14',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'Inside the fourth-generation Tuscan tannery behind our leather goods.',
    body: [
      'The tannery sits outside Florence, unchanged in process for over eighty years. Vegetable tanning takes weeks, not days — a slow chemical conversation between hide and bark extract.',
      'We spent three days there, watching hides move through pits that have not changed position since the 1940s. Every batch is inspected under the same north-facing window.',
    ],
  },
  {
    slug: 'notes-on-restraint',
    title: 'Notes on Restraint',
    category: 'Design',
    date: '2026-01-20',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'Why we remove more than we add, and what that costs us.',
    body: [
      'Restraint is often mistaken for absence. It is not. Every seam we remove from a garment is a decision, usually a harder one than adding it back would have been.',
      'The easiest silhouette to design is a complicated one — it hides mistakes. The hardest is a plain one, because it has nowhere to hide.',
    ],
  },
  {
    slug: 'stillness-in-motion',
    title: 'Stillness, in Motion',
    category: 'Campaign',
    date: '2026-04-05',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1600&auto=format&fit=crop',
    excerpt: "Behind the season's campaign, shot at dawn on location.",
    body: [
      "This season's campaign explores the tension between structure and ease — tailoring loosened just enough to breathe.",
      'We shot at first light, before the wind picked up, to capture fabric in its most honest state: still, but never static.',
    ],
  },
];

export function getArticleBySlug(slug) {
  return ARTICLES.find((a) => a.slug === slug);
}
