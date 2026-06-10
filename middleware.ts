// Vercel Edge Middleware (runs before the SPA rewrite in vercel.json).
// Social crawlers can't run JS, so they'd see empty index.html for /share/:id
// links. Proxy bot user-agents to the backend's OG page, which carries the
// per-share Open Graph tags; real visitors fall through to the SPA.

const BOT_UA =
  /bot|crawler|spider|facebookexternalhit|twitterbot|slackbot|discordbot|telegrambot|whatsapp|linkedinbot|redditbot|pinterest|embedly|quora link preview|vkshare/i;

export default function middleware(request: Request): Promise<Response> | void {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/share\/([a-f0-9]+)\/?$/i);
  if (!match) return;

  const ua = request.headers.get("user-agent") || "";
  if (!BOT_UA.test(ua)) return;

  const backend = (
    process.env.VITE_BACKEND_HOST || "http://localhost:3000"
  ).replace(/\/+$/, "");
  return fetch(`${backend}/api/v1/share/${match[1]}/og`, {
    headers: { "user-agent": ua },
  });
}

export const config = {
  matcher: "/share/:path*",
};
