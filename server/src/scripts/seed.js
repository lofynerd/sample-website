import 'dotenv/config';
import { connectDB } from '../lib/db.js';
import Product from '../models/Product.js';
import Article from '../models/Article.js';

// One-off script to load starter catalog + journal content into MongoDB
// Run with: npm run seed --workspace=server

const PRODUCTS = [
  {
    slug: 'the-wool-overcoat',
    name: 'The Wool Overcoat',
    price: 890,
    collection: 'aw26-essentials',
    category: 'Outerwear',
    description:
      'A single-breasted overcoat cut from double-faced Tasmanian wool. Structured through the shoulder, softened everywhere else.',
    story:
      'Drafted over eleven fittings, this coat began as a study in negative space — how little seaming could hold a silhouette this clean. The result is a coat with almost no visible construction, just quiet, considered mass.',
    materials: ['100% Tasmanian merino wool', 'Cupro lining', 'Horn buttons'],
    care: ['Dry clean only', 'Store on a wide hanger', 'Steam to refresh, do not iron directly'],
    colors: [
      {
        id: 'ink',
        name: 'Ink',
        swatch: '#0b0b0b',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'clay',
        name: 'Clay',
        swatch: '#a89685',
        image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1600&auto=format&fit=crop',
    ],
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'silk-column-dress',
    name: 'Silk Column Dress',
    price: 640,
    collection: 'aw26-essentials',
    category: 'Dresses',
    description:
      'A bias-cut column dress in mulberry silk charmeuse. Falls straight from the shoulder with no visible closures.',
    story:
      'The pattern is a single continuous panel, cut on the bias so the silk moves independently of the body beneath it. No darts, no seams at the waist — just fabric finding its own line.',
    materials: ['100% mulberry silk charmeuse', 'French seams throughout'],
    care: ['Dry clean only', 'Store flat or on a padded hanger'],
    colors: [
      {
        id: 'bone',
        name: 'Bone',
        swatch: '#f7f5f2',
        image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'ink',
        name: 'Ink',
        swatch: '#0b0b0b',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1600&auto=format&fit=crop',
    ],
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'structured-leather-tote',
    name: 'Structured Leather Tote',
    price: 1250,
    collection: 'aw26-accessories',
    category: 'Bags',
    description:
      'A rigid-frame tote in vegetable-tanned Tuscan leather. Ages into a deeper patina with use.',
    story:
      'Made in a single atelier outside Florence that has tanned leather with the same vegetable process for four generations. Every hide is inspected under natural light before cutting.',
    materials: ['Vegetable-tanned full-grain leather', 'Solid brass hardware', 'Suede lining'],
    care: ['Wipe with a dry cloth', 'Avoid prolonged direct sunlight', 'Condition leather twice yearly'],
    colors: [
      {
        id: 'cognac',
        name: 'Cognac',
        swatch: '#a56b3b',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'ink',
        name: 'Ink',
        swatch: '#0b0b0b',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1600&auto=format&fit=crop',
    ],
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'tailored-wool-trouser',
    name: 'Tailored Wool Trouser',
    price: 420,
    collection: 'aw26-essentials',
    category: 'Trousers',
    description:
      'A high-rise wool trouser with a wide, uninterrupted leg. Cut to sit at the natural waist.',
    story:
      'We removed every visible seam we could. What remains is a single fold at the front, pressed to fall the same way every time it is worn.',
    materials: ['98% wool, 2% elastane', 'Half-lined through the seat and thigh'],
    care: ['Dry clean recommended', 'Steam to remove creases'],
    colors: [
      {
        id: 'stone',
        name: 'Stone',
        swatch: '#6b6560',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'ink',
        name: 'Ink',
        swatch: '#0b0b0b',
        image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1600&auto=format&fit=crop',
    ],
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'cashmere-crewneck-sweater',
    name: 'Cashmere Crewneck Sweater',
    price: 380,
    collection: 'aw26-essentials',
    category: 'Knitwear',
    description:
      'A relaxed crewneck knit from two-ply Mongolian cashmere. Cut with dropped shoulders for an easy, unstructured fit.',
    story:
      'We chose two-ply yarn over a heavier gauge for one reason: it drapes rather than insulates like a blanket. The result softens with every wash instead of pilling.',
    materials: ['100% Mongolian cashmere', 'Ribbed cuffs and hem'],
    care: ['Hand wash cold or dry clean', 'Dry flat', 'Store folded, never on a hanger'],
    colors: [
      {
        id: 'oatmeal',
        name: 'Oatmeal',
        swatch: '#d8c9ad',
        image: 'https://images.unsplash.com/photo-1614251055880-ee96e4803393?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'ink',
        name: 'Ink',
        swatch: '#0b0b0b',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1614251055880-ee96e4803393?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1600&auto=format&fit=crop',
    ],
    image: 'https://images.unsplash.com/photo-1614251055880-ee96e4803393?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'poplin-shirt-dress',
    name: 'Poplin Shirt Dress',
    price: 480,
    collection: 'aw26-essentials',
    category: 'Dresses',
    description:
      'An oversized shirt dress in crisp cotton poplin, worn open over knitwear or belted alone.',
    story:
      'Modeled on a vintage workwear pattern we found in a Lyon flea market, resized and reproportioned twice before we were satisfied with the drop of the collar.',
    materials: ['100% cotton poplin', 'Mother-of-pearl buttons'],
    care: ['Machine wash cold', 'Line dry', 'Iron on medium heat'],
    colors: [
      {
        id: 'bone',
        name: 'Bone',
        swatch: '#f7f5f2',
        image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'stone',
        name: 'Stone',
        swatch: '#6b6560',
        image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1600&auto=format&fit=crop',
    ],
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'grain-leather-belt',
    name: 'Full-Grain Leather Belt',
    price: 190,
    collection: 'aw26-accessories',
    category: 'Bags',
    description:
      'A 3.5cm belt in vegetable-tanned full-grain leather with a solid brass buckle.',
    story:
      'Cut from the same hides as our tote, so the leather ages at the same rate and develops a matching patina over years of wear.',
    materials: ['Vegetable-tanned full-grain leather', 'Solid brass buckle'],
    care: ['Wipe with a dry cloth', 'Condition twice yearly'],
    colors: [
      {
        id: 'cognac',
        name: 'Cognac',
        swatch: '#a56b3b',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['85cm', '90cm', '95cm', '100cm'],
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1600&auto=format&fit=crop'],
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'merino-wide-leg-trouser',
    name: 'Merino Wide-Leg Trouser',
    price: 450,
    collection: 'aw26-essentials',
    category: 'Trousers',
    description:
      'A fluid, wide-leg trouser in featherweight merino, cut with a deep pleat for movement.',
    story:
      'Where our tailored trouser is architectural, this one is meant to move. The pleat opens with each stride instead of resisting it.',
    materials: ['100% merino wool', 'Fully lined'],
    care: ['Dry clean recommended'],
    colors: [
      {
        id: 'clay',
        name: 'Clay',
        swatch: '#a89685',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'ink',
        name: 'Ink',
        swatch: '#0b0b0b',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1600&auto=format&fit=crop',
    ],
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'shearling-collar-jacket',
    name: 'Shearling-Collar Jacket',
    price: 1450,
    collection: 'aw26-outerwear',
    category: 'Outerwear',
    description:
      'A cropped wool jacket with a detachable shearling collar, built for the coldest months.',
    story:
      'The collar snaps off entirely for warmer transitional weather, meaning this is designed as two garments rather than one fixed silhouette.',
    materials: ['Wool-blend shell', 'Genuine shearling collar (detachable)', 'Quilted lining'],
    care: ['Dry clean shell only', 'Spot clean shearling', 'Store collar separately in a breathable bag'],
    colors: [
      {
        id: 'ink',
        name: 'Ink',
        swatch: '#0b0b0b',
        image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1600&auto=format&fit=crop'],
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1200&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1200&auto=format&fit=crop',
  },
];

const ARTICLES = [
  {
    slug: 'the-case-for-slowness',
    title: 'The Case for Slowness',
    category: 'Philosophy',
    date: new Date('2026-03-02'),
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'In an industry built on speed, we asked what happens when a house refuses to rush.',
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
    date: new Date('2026-02-14'),
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
    date: new Date('2026-01-20'),
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
    date: new Date('2026-04-05'),
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1600&auto=format&fit=crop',
    excerpt: "Behind the season's campaign, shot at dawn on location.",
    body: [
      "This season's campaign explores the tension between structure and ease — tailoring loosened just enough to breathe.",
      'We shot at first light, before the wind picked up, to capture fabric in its most honest state: still, but never static.',
    ],
  },
];

async function seed() {
  await connectDB();

  for (const product of PRODUCTS) {
    await Product.findOneAndUpdate({ slug: product.slug }, product, { upsert: true });
  }
  console.log(`Seeded ${PRODUCTS.length} products`);

  for (const article of ARTICLES) {
    await Article.findOneAndUpdate({ slug: article.slug }, article, { upsert: true });
  }
  console.log(`Seeded ${ARTICLES.length} articles`);

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
