import { json } from '@/lib/http';
import { sql } from '@/lib/supabase-server';

// GET /api/search?q=kopi - search listed products by name.
export async function GET(request) {
  const q = new URL(request.url).searchParams.get('q') ?? '';
  try {
    // The search text travels as a parameter, never as part of the SQL string.
    const rows = await sql('SELECT id, name, price_cents FROM products WHERE is_listed = 1 AND name LIKE ? ORDER BY id', [`%${q}%`]);
    return json(rows);
  } catch (error) {
    // Log the detail on the server. The client gets a generic message, not the SQL error.
    console.error('search failed', error);
    return json({ error: 'Search failed' }, { status: 500 });
  }
}
