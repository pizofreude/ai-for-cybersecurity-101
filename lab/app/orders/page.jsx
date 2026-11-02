'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    getBrowserClient()
      .from('orders')
      .select('id, status, amount_cents')
      .order('id')
      .then(({ data }) => setOrders(data ?? []));
  }, []);

  if (!orders) return <p className="muted">Loading...</p>;

  return (
    <>
      <h1>My orders</h1>
      {orders.length === 0 && <p>No orders. Sign in as alice@lab.test.</p>}
      <table>
        <thead><tr><th>Order</th><th>Status</th><th>Total</th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td><Link href={`/orders/${order.id}`}>#{order.id}</Link></td>
              <td>{order.status}</td>
              <td>RM {(order.amount_cents / 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
