import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from '../features/home/HomePage.jsx';
import ProductPage from '../features/product/ProductPage.jsx';
import CollectionsPage from '../features/product/CollectionsPage.jsx';
import JournalPage from '../features/journal/JournalPage.jsx';
import ArticlePage from '../features/journal/ArticlePage.jsx';
import CraftsmanshipPage from '../features/misc/CraftsmanshipPage.jsx';
import AboutPage from '../features/misc/AboutPage.jsx';
import ArchitecturePage from '../features/misc/ArchitecturePage.jsx';
import WishlistPage from '../features/wishlist/WishlistPage.jsx';
import CheckoutPage from '../features/checkout/CheckoutPage.jsx';
import NotFoundPage from '../features/misc/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/:slug" element={<ArticlePage />} />
        <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
