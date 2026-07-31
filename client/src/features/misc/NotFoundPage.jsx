import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — Maison Delulu</title>
      </Helmet>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <span className="text-xs uppercase tracking-widest2 text-stone mb-6">404</span>
        <h1 className="font-display text-display mb-6">This Page Doesn't Exist</h1>
        <p className="text-stone text-sm max-w-sm mb-10">
          The page you're looking for may have been moved, renamed, or never existed.
        </p>
        <Button as={Link} to="/" variant="ghost">
          Return Home
        </Button>
      </div>
    </>
  );
}
