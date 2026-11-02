// JSON response helper shared by every API route.
// The API serves this app only, so it sends no CORS headers: browsers block other origins by default.
// If a second frontend needs access, list its exact origin in ALLOWED_ORIGINS (comma-separated).
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean);

export function json(body, init = {}, request = null) {
  const headers = { ...init.headers };
  const origin = request?.headers.get('origin');
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return Response.json(body, { ...init, headers });
}
