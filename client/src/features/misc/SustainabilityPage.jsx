import SimplePage from './SimplePage.jsx';

export default function SustainabilityPage() {
  return (
    <SimplePage
      eyebrow="House"
      title="Sustainability"
      intro="Making less, and making it well, is our starting point for sustainability."
      sections={[
        {
          heading: 'Small Batches',
          body: 'We produce in limited runs tied to actual demand, not seasonal quotas. This means less overproduction and less waste sitting in warehouses.',
        },
        {
          heading: 'Material Sourcing',
          body: 'We work directly with mills and tanneries that meet our standards for responsible sourcing, including vegetable-tanned leather and traceable wool.',
        },
        {
          heading: 'Built to Last',
          body: 'Every garment is designed to be repaired, not replaced. We offer complimentary mending on any piece purchased from us, for life.',
        },
        {
          heading: 'Ongoing Work',
          body: 'We do not claim to be a zero-impact company. This page will be updated as our practices evolve.',
        },
      ]}
    />
  );
}
