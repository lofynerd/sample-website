import SimplePage from './SimplePage.jsx';

export default function ShippingPage() {
  return (
    <SimplePage
      eyebrow="Support"
      title="Shipping"
      intro="Every order is packed by hand and shipped with care, regardless of destination."
      sections={[
        {
          heading: 'Delivery Times',
          body: [
            'Domestic (US): 3–5 business days',
            'International: 7–12 business days',
            'Express options available at checkout',
          ],
        },
        {
          heading: 'Order Tracking',
          body: 'A tracking link is emailed as soon as your order leaves our atelier. You can also find order status in your confirmation email.',
        },
        {
          heading: 'Gift Packaging',
          body: 'Complimentary gift packaging is available at checkout for every order, no minimum required.',
        },
        {
          heading: 'Customs & Duties',
          body: 'International orders may be subject to customs fees, determined by your country. These are the responsibility of the recipient.',
        },
      ]}
    />
  );
}
