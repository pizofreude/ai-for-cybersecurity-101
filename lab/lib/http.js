// JSON response helper shared by every API route.
export function json(body, init = {}) {
  return Response.json(body, init);
}
