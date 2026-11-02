'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/supabase-browser';

export default function CommentForm({ productId }) {
  const router = useRouter();
  const [error, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const res = await apiFetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, body: new FormData(form).get('body') }),
    });
    if (!res.ok) return setError(res.status === 401 ? 'Sign in to post a review.' : 'Could not post the review.');
    form.reset();
    setError(null);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="stack">
      <textarea name="body" rows={3} placeholder="Write a review. HTML like <b>bold</b> is allowed." required />
      <button type="submit">Post review</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
