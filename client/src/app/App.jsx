import { Suspense, lazy } from 'react';
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
import ContactPage from '../features/misc/ContactPage.jsx';
import ShippingPage from '../features/misc/ShippingPage.jsx';
import ReturnsPage from '../features/misc/ReturnsPage.jsx';
import SizeGuidePage from '../features/misc/SizeGuidePage.jsx';
import SustainabilityPage from '../features/misc/SustainabilityPage.jsx';
import CareersPage from '../features/misc/CareersPage.jsx';
import GiftCardsPage from '../features/misc/GiftCardsPage.jsx';
import PrivacyPage from '../features/misc/PrivacyPage.jsx';
import TermsPage from '../features/misc/TermsPage.jsx';
import WishlistPage from '../features/wishlist/WishlistPage.jsx';
import CheckoutPage from '../features/checkout/CheckoutPage.jsx';
import NotFoundPage from '../features/misc/NotFoundPage.jsx';
import AuthGuard from '../features/auth/AuthGuard.jsx';
import RegisterPage from '../features/auth/RegisterPage.jsx';
import CustomerLoginPage from '../features/auth/LoginPage.jsx';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../features/auth/ResetPasswordPage.jsx';
import VerifyEmailPage from '../features/auth/VerifyEmailPage.jsx';
import AccountPage from '../features/auth/AccountPage.jsx';

// Admin panel is code-split into its own chunk since storefront visitors never need it
const AdminGuard = lazy(() => import('../features/admin/AdminGuard.jsx'));
const AdminLayout = lazy(() => import('../features/admin/AdminLayout.jsx'));
const AdminLoginPage = lazy(() => import('../features/admin/LoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('../features/admin/pages/DashboardPage.jsx'));
const AdminProductsPage = lazy(() => import('../features/admin/pages/ProductsPage.jsx'));
const AdminJournalPage = lazy(() => import('../features/admin/pages/JournalPage.jsx'));
const AdminOrdersPage = lazy(() => import('../features/admin/pages/OrdersPage.jsx'));
const AdminSubscribersPage = lazy(() => import('../features/admin/pages/SubscribersPage.jsx'));

function AdminFallback() {
  return <div className="min-h-screen bg-[#0e0e0f] text-white/50 flex items-center justify-center text-sm">Loading…</div>;
}

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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/size-guide" element={<SizeGuidePage />} />
        <Route path="/sustainability" element={<SustainabilityPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/account"
          element={
            <AuthGuard>
              <AccountPage />
            </AuthGuard>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminProductsPage />
            </Suspense>
          }
        />
        <Route
          path="journal"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminJournalPage />
            </Suspense>
          }
        />
        <Route
          path="orders"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminOrdersPage />
            </Suspense>
          }
        />
        <Route
          path="subscribers"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminSubscribersPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
