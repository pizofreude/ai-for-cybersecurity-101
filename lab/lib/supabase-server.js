import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Server-side client with the service_role key. It bypasses row-level security,
// so every route that uses it must do its own authorisation.
export function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Returns the signed-in user for an API request, or null.
export async function getUser(request) {
  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith('Bearer ')) return null;
  const { data, error } = await getServiceClient().auth.getUser(header.slice(7));
  return error ? null : data.user;
}

// Runs raw SQL over the database connection, as a server would with a Postgres connection string.
export async function sql(text, params = []) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql: text, params }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message);
  return body.rows;
}
