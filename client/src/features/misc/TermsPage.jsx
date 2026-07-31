import SimplePage from './SimplePage.jsx';

export default function TermsPage() {
  return (
    <SimplePage
      eyebrow="Legal"
      title="Terms of Service"
      intro="By using this site and placing an order, you agree to the following terms."
      sections={[
        {
          heading: 'Orders',
          body: 'All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order.',
        },
        {
          heading: 'Pricing',
          body: 'Prices are listed in USD and are subject to change without notice. Prices at the time of order confirmation are final.',
        },
        {
          heading: 'Intellectual Property',
          body: 'All content on this site, including images, text, and design, is the property of Maison Delulu and may not be reproduced without permission.',
        },
        {
          heading: 'Limitation of Liability',
          body: 'This is a demo storefront built for portfolio purposes. No real transactions or payments are processed.',
        },
      ]}
    />
  );
}
