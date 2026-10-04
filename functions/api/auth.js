// Cloudflare Pages Function: step 1 of logging in to the editor.
// Sends you to GitHub to confirm it's you. Needs two secrets set in
// Cloudflare Pages → Settings → Variables and Secrets:
//   GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response('Editor login is not set up yet: add GITHUB_CLIENT_ID in Cloudflare Pages settings.', { status: 500 });
  }
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const scope = url.searchParams.get('scope') || 'repo,user';

  const github = new URL('https://github.com/login/oauth/authorize');
  github.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  github.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  github.searchParams.set('scope', scope);
  github.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: github.toString(),
      'Set-Cookie': `decap_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
