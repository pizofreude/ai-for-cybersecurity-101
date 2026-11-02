import { notFound } from 'next/navigation';
import { getServiceClient } from '@/lib/supabase-server';
import CommentForm from './CommentForm';

export const dynamic = 'force-dynamic';

export default async function Product({ params }) {
  const { id } = await params;
  const supabase = getServiceClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', id).eq('is_listed', true).maybeSingle();
  if (!product) notFound();
  const { data: comments } = await supabase.from('comments').select('*').eq('product_id', id).order('id');

  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p><strong>RM {(product.price_cents / 100).toFixed(2)}</strong></p>
      <h2>Reviews</h2>
      {(comments ?? []).map((comment) => (
        <div key={comment.id} className="card">
          <strong>{comment.author_name}</strong>
          {/* Render reviews as HTML so customers can use bold text and links. */}
          <div dangerouslySetInnerHTML={{ __html: comment.body }} />
        </div>
      ))}
      <CommentForm productId={product.id} />
    </>
  );
}
