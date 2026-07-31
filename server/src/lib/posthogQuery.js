import axios from 'axios';

// Wraps PostHog's Query API for server-side analytics reads.
// Requires a personal API key (phx_...) with query:read scope - the public
// project token (phc_...) used for event capture cannot read data back.
const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const POSTHOG_APP_HOST = process.env.POSTHOG_APP_HOST ?? 'https://us.posthog.com';

export const isPosthogQueryConfigured = Boolean(POSTHOG_PERSONAL_API_KEY && POSTHOG_PROJECT_ID);

// Runs a HogQL query against the PostHog Query API and returns { columns, results }
export async function runHogQL(query, name = 'dashboard query') {
  if (!isPosthogQueryConfigured) {
    throw new Error('PostHog personal API key / project id not configured');
  }

  const { data } = await axios.post(
    `${POSTHOG_APP_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`,
    { query: { kind: 'HogQLQuery', query }, name },
    { headers: { Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}` } }
  );

  return { columns: data.columns ?? [], results: data.results ?? [] };
}
