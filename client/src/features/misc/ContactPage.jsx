import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePostHog } from '@posthog/react';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';
import apiClient from '../../api/client.js';

export default function ContactPage() {
  const posthog = usePostHog();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.post('/contact', form);
      posthog?.capture('contact_form_submitted');
      setSubmitted(true);
    } catch {
      setError('Something went wrong sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-transparent border-b border-mist py-3 text-sm focus:outline-none focus:border-ink';
  const labelClass = 'text-xs uppercase tracking-widest2 text-stone block mb-2';

  return (
    <>
      <Helmet>
        <title>Contact — Maison Delulu</title>
        <meta name="description" content="Get in touch with Maison Delulu." />
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-xl mx-auto pb-32">
        <Reveal className="mb-12">
          <span className="text-xs uppercase tracking-widest2 text-stone">Contact</span>
          <h1 className="font-display text-display mt-6">Get in Touch</h1>
          <p className="text-stone mt-6 leading-relaxed">
            For order inquiries, sizing questions, or anything else — we typically respond
            within one business day.
          </p>
        </Reveal>

        {submitted ? (
          <p className="text-stone">Thank you for reaching out. We'll be in touch shortly.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className={labelClass}>Name</label>
              <input required value={form.name} onChange={update('name')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={update('message')}
                className={inputClass}
              />
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <Button variant="primary" size="lg" type="submit" disabled={submitting} className="self-start">
              {submitting ? 'Sending…' : 'Send Message'}
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
