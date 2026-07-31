// Verifies a Cloudflare Turnstile token against the Siteverify API.
// Must only ever be called server-side - the secret key must never reach the client.
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token, remoteip) {
  if (!token) return { success: false, errorCodes: ['missing-input-response'] };

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip,
      }),
    });

    const result = await response.json();
    return { success: Boolean(result.success), errorCodes: result['error-codes'] ?? [] };
  } catch {
    return { success: false, errorCodes: ['internal-error'] };
  }
}
