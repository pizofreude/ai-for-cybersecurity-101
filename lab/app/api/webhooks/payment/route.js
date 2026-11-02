import { json } from '@/lib/http';
import { getServiceClient } from '@/lib/supabase-server';

// POST /api/webhooks/payment - LabPay calls this after a customer pays.
// Body: { "order_id": 1001, "status": "paid" }
// LabPay also sends an X-LabPay-Signature header. We can add the check later.
export async function POST(request) {
  const event = await request.json();
  if (!event.order_id || !event.status) return json({ error: 'order_id and status are required' }, { status: 400 });

  const { data, error } = await getServiceClient()
    .from('orders')
    .update({ status: event.status })
    .eq('id', event.order_id)
    .select('id, status');

  if (error) return json({ error: error.message }, { status: 400 });
  if (!data.length) return json({ error: 'Order not found' }, { status: 404 });
  return json({ received: true, order: data[0] });
}
