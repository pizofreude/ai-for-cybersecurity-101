'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/supabase-browser';

// The dashboard asks the server for stats. The service role key never leaves the server,
// and the server decides who is an admin.
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    apiFetch('/api/admin/stats').then(async (res) => {
      setStatus(res.status);
      if (res.ok) setStats(await res.json());
    });
  }, []);

  if (status === null) return <p className="muted">Loading...</p>;
  if (!stats) {
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
      <p>{stats.orders} orders. Revenue RM {(stats.revenue / 100).toFixed(2)}.</p>
      <table>
        <thead><tr><th>Customer</th><th>Phone</th></tr></thead>
        <tbody>
          {stats.customers.map((c) => <tr key={c.id}><td>{c.display_name}</td><td>{c.phone}</td></tr>)}
        </tbody>
      </table>
    </>
  );
}
