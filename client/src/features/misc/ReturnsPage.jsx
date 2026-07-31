import SimplePage from './SimplePage.jsx';

export default function ReturnsPage() {
  return (
    <SimplePage
      eyebrow="Support"
      title="Returns"
      intro="We want every piece to earn its place in your wardrobe. If it doesn't, here's how to return it."
      sections={[
        {
          heading: 'Return Window',
          body: 'Items may be returned within 30 days of delivery, unworn, unwashed, and with original tags attached.',
        },
        {
          heading: 'How to Start a Return',
          body: [
            'Email hello@maisondelulu.com with your order number',
            'We will send a prepaid return label within 24 hours',
            'Refunds are issued to the original payment method within 5–7 business days of receipt',
          ],
        },
        {
          heading: 'Final Sale Items',
          body: 'Items marked as final sale, and gift cards, are not eligible for return or exchange.',
        },
        {
          heading: 'Exchanges',
          body: 'For a different size or color, we recommend placing a new order and returning the original — this is the fastest way to secure the item you want.',
        },
      ]}
    />
  );
}
