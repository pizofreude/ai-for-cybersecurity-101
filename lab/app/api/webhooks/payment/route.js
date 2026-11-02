import { createHmac, timingSafeEqual } from 'node:crypto';
import { json } from '@/lib/http';
import { getServiceClient } from '@/lib/supabase-server';

const TOLERANCE_SECONDS = 300;
const ALLOWED_STATUSES = new Set(['paid', 'failed', 'refunded']);

// X-LabPay-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with LAB_WEBHOOK_SECRET>
// Same scheme as Stripe: the timestamp is signed too, so an old request cannot be replayed later.
function verifySignature(header, rawBody) {
  const parts = Object.fromEntries((header ?? '').split(',').map((part) => part.split('=')));
  const timestamp = Number(parts.t);
  if (!parts.v1 || !Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false;
  const expected = createHmac('sha256', process.env.LAB_WEBHOOK_SECRET).update(`${timestamp}.${rawBody}`).digest();
  const given = Buffer.from(parts.v1, 'hex');
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// POST /api/webhooks/payment - LabPay calls this after a customer pays.
export async function POST(request) {
  // Verify against the exact bytes LabPay signed, before parsing anything.
  const rawBody = await request.text();
  if (!verifySignature(request.headers.get('x-labpay-signature'), rawBody)) {
    return json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (!event.order_id || !ALLOWED_STATUSES.has(event.status)) return json({ error: 'Unsupported event' }, { status: 400 });

  const { data, error } = await getServiceClient()
    .from('orders')
    .update({ status: event.status })
    .eq('id', event.order_id)
    .select('id, status');

  if (error) return json({ error: error.message }, { status: 400 });
  if (!data.length) return json({ error: 'Order not found' }, { status: 404 });
  return json({ received: true, order: data[0] });
}
