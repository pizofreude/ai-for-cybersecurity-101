// JSON response helper shared by every API route.
// CORS is open so any frontend (mobile app, partner site, localhost tools) can call the API.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
};

export function json(body, init = {}) {
  return Response.json(body, { ...init, headers: { ...corsHeaders, ...init.headers } });
}
