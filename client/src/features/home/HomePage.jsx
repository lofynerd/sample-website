import { Helmet } from 'react-helmet-async';
import Hero from './sections/Hero.jsx';
import Manifesto from './sections/Manifesto.jsx';
import Craftsmanship from './sections/Craftsmanship.jsx';
import Materials from './sections/Materials.jsx';
import FeaturedCollection from './sections/FeaturedCollection.jsx';
import EditorialCampaign from './sections/EditorialCampaign.jsx';
import BehindTheScenes from './sections/BehindTheScenes.jsx';
import JournalPreview from './sections/JournalPreview.jsx';
import InstagramGallery from './sections/InstagramGallery.jsx';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Maison Delulu — For the Delusionally Ambitious</title>
        <meta
          name="description"
          content="Maison Delulu is an independent luxury fashion house. Explore our collections, journal, and the craftsmanship behind every piece."
        />
        <meta property="og:title" content="Maison Delulu — For the Delusionally Ambitious" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="For the delusionally ambitious." />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://maisondelulu.example.com/" />
      </Helmet>

      <Hero />
      <Manifesto />
      <Craftsmanship />
      <Materials />
      <FeaturedCollection />
      <EditorialCampaign />
      <BehindTheScenes />
      <JournalPreview />
      <InstagramGallery />
    </>
  );
}
