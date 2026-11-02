import { json } from '@/lib/http';
import { getServiceClient, getUser } from '@/lib/supabase-server';

// GET /api/orders/:id - order detail for the signed-in customer.
export async function GET(request, { params }) {
  const user = await getUser(request);
  if (!user) return json({ error: 'Sign in first' }, { status: 401 });

  const { id } = await params;
  const { data: order } = await getServiceClient()
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // the service client bypasses RLS, so check ownership here
    .maybeSingle();

  if (!order) return json({ error: 'Order not found' }, { status: 404 });
  return json(order);
}
