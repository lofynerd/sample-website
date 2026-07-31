import SimplePage from './SimplePage.jsx';

export default function PrivacyPage() {
  return (
    <SimplePage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This policy describes what information we collect and how it's used."
      sections={[
        {
          heading: 'Information We Collect',
          body: [
            'Contact details you provide (name, email, shipping address)',
            'Order history and preferences',
            'Website usage data (pages viewed, interactions) via PostHog analytics',
          ],
        },
        {
          heading: 'How We Use It',
          body: 'To fulfill orders, respond to inquiries, send order confirmations and receipts, and understand how the site is used so we can improve it.',
        },
        {
          heading: 'What We Don\'t Do',
          body: 'We do not sell your personal information to third parties.',
        },
        {
          heading: 'Contact',
          body: 'For any privacy-related requests, including data deletion, reach out through our Contact page.',
        },
      ]}
    />
  );
}
