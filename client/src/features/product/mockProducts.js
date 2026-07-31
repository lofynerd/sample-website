// Temporary mock product data, will be replaced by GET /api/v1/products
export const FEATURED_PRODUCTS = [
  {
    id: 'p1',
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
    id: 'p2',
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
    id: 'p3',
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
    id: 'p4',
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
];

export function getProductBySlug(slug) {
  return FEATURED_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product, limit = 4) {
  return FEATURED_PRODUCTS.filter((p) => p.id !== product.id).slice(0, limit);
}
