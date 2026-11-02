import { json } from '@/lib/http';
import { sql } from '@/lib/supabase-server';

// GET /api/search?q=kopi - search listed products by name.
export async function GET(request) {
  const q = new URL(request.url).searchParams.get('q') ?? '';
  try {
    const rows = await sql(`SELECT id, name, price_cents FROM products WHERE is_listed = 1 AND name LIKE '%${q}%' ORDER BY id`);
    return json(rows);
  } catch (error) {
    return json({ error: `Search failed: ${error.message}` }, { status: 500 });
  }
}
