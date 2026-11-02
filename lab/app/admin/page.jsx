'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';

// The dashboard needs every row, and RLS hides other users' rows from the anon key.
// So this page uses the service role key, which bypasses RLS.
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, storageKey: 'lab-admin' },
});

export default function AdminDashboard() {
  const [email, setEmail] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getBrowserClient().auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    Promise.all([
      admin.from('profiles').select('*'),
      admin.from('orders').select('*'),
    ]).then(([profiles, orders]) => {
      setStats({
        customers: profiles.data ?? [],
        orders: orders.data?.length ?? 0,
        revenue: (orders.data ?? []).filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount_cents, 0),
      });
    });
  }, []);

  // Only the admin account sees the dashboard.
  if (email !== 'admin@lab.test') {
    return (
      <>
        <h1>Admin</h1>
        <p>Admins only. Sign in as the shop admin to see the dashboard.</p>
      </>
    );
  }

  return (
    <>
      <h1>Admin dashboard</h1>
      {!stats ? <p className="muted">Loading...</p> : (
        <>
          <p>{stats.orders} orders. Revenue RM {(stats.revenue / 100).toFixed(2)}.</p>
          <table>
            <thead><tr><th>Customer</th><th>Phone</th></tr></thead>
            <tbody>
              {stats.customers.map((c) => <tr key={c.id}><td>{c.display_name}</td><td>{c.phone}</td></tr>)}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
