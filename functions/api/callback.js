// Cloudflare Pages Function: step 2 of logging in to the editor.
// GitHub sends you back here; we swap the one-time code for a login token
// and hand it to the editor window that opened this pop-up.
const page = (status, payload) => {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  // JSON-encode again so the message is a safe JavaScript string, and stop "</script>" breaking out.
  const safe = JSON.stringify(message).replace(/</g, '\\u003c');
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><title>Signing in…</title></head><body>
<p style="font-family:system-ui;padding:24px">${status === 'success' ? 'Signed in — you can close this window.' : 'Sign-in failed. Close this window and try again.'}</p>
<script>
(function () {
  var message = ${safe};
  function receive(e) {
    if (e.origin !== window.location.origin) return;
    window.opener.postMessage(message, e.origin);
    window.removeEventListener('message', receive, false);
  }
  window.addEventListener('message', receive, false);
  if (window.opener) window.opener.postMessage('authorizing:github', window.location.origin);
})();
</script></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Set-Cookie': 'decap_oauth_state=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Lax' } },
  );
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const saved = /(?:^|;\s*)decap_oauth_state=([^;]+)/.exec(cookie)?.[1];

  if (!code || !state || !saved || state !== saved) {
    return page('error', { message: 'Login expired or was interrupted. Please try again.' });
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'padkos-decap-oauth' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) {
    return page('error', { message: data.error_description || 'GitHub did not return a login token.' });
  }
  return page('success', { token: data.access_token, provider: 'github' });
}
