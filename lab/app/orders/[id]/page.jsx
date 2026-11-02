'use client';

import { use, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/supabase-browser';

export default function OrderDetail({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/api/orders/${id}`).then(async (res) => {
      if (!res.ok) return setError(`Could not load order (${res.status})`);
      setOrder(await res.json());
    });
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="muted">Loading...</p>;

  return (
    <>
      <h1>Order #{order.id}</h1>
      <div className="card">
        <p>Status: <strong>{order.status}</strong></p>
        <p>Total: RM {(order.amount_cents / 100).toFixed(2)}</p>
        <p>Ship to: {order.ship_address}</p>
      </div>
    </>
  );
}
