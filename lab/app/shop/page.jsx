'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getBrowserClient().from('products').select('*').order('id').then(({ data }) => setProducts(data ?? []));
  }, []);

  async function onSearch(event) {
    event.preventDefault();
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    setProducts(res.ok ? await res.json() : []);
  }

  return (
    <>
      <h1>Shop</h1>
      <form onSubmit={onSearch} className="stack" style={{ maxWidth: 'none', gridTemplateColumns: '1fr auto' }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" />
        <button type="submit">Search</button>
      </form>
      {products.map((product) => (
        <div key={`${product.id}-${product.name}`} className="card">
          <Link href={`/shop/${product.id}`}><strong>{product.name}</strong></Link>
          <span className="muted"> RM {(product.price_cents / 100).toFixed(2)}</span>
        </div>
      ))}
    </>
  );
}
