import SimplePage from './SimplePage.jsx';

export default function CareersPage() {
  return (
    <SimplePage
      eyebrow="House"
      title="Careers"
      intro="We're a small team by design. We hire rarely, and only for people who care as much about the details as we do."
      sections={[
        {
          heading: 'Open Roles',
          body: 'There are no open positions at this time. We post here first when that changes.',
        },
        {
          heading: 'General Inquiries',
          body: 'If you don\'t see a relevant role but think you would be a strong fit for the house, reach out through our Contact page with a short note about why.',
        },
      ]}
    />
  );
}
