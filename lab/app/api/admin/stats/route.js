import { json } from '@/lib/http';
import { getServiceClient, getUser } from '@/lib/supabase-server';

// GET /api/admin/stats - store stats for admins only.
// The admin check runs on the server, against the database, not in the browser.
export async function GET(request) {
  const user = await getUser(request);
  if (!user) return json({ error: 'Sign in first' }, { status: 401 });

  const supabase = getServiceClient();
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
  if (!profile?.is_admin) return json({ error: 'Admins only' }, { status: 403 });

  const [{ data: customers }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('id, display_name, phone'),
    supabase.from('orders').select('status, amount_cents'),
  ]);
  return json({
    customers: customers ?? [],
    orders: orders?.length ?? 0,
    revenue: (orders ?? []).filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount_cents, 0),
  });
}
