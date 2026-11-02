import { json } from '@/lib/http';
import { getServiceClient, getUser } from '@/lib/supabase-server';

// POST /api/comments - add a product review as the signed-in user.
export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: 'Sign in first' }, { status: 401 });

  const { product_id: productId, body } = await request.json();
  if (!productId || !body) return json({ error: 'product_id and body are required' }, { status: 400 });

  const supabase = getServiceClient();
  const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle();
  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      product_id: productId,
      author_id: user.id,
      author_name: profile?.display_name ?? user.email,
      body: String(body),
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, { status: 400 });
  return json(comment, { status: 201 });
}
