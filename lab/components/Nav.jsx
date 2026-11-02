'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';

const links = [
  { href: '/', label: 'Home' },
  { href: '/notes', label: 'My notes' },
  { href: '/orders', label: 'My orders' },
  { href: '/admin', label: 'Admin' },
];

export default function Nav() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const supabase = getBrowserClient();
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await getBrowserClient().auth.signOut();
    window.location.href = '/';
  }

  return (
    <nav className="nav">
      <strong className="brand">LabShop</strong>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>{link.label}</Link>
      ))}
      <span className="spacer" />
      {email ? (
        <>
          <span className="muted">{email}</span>
          <button type="button" onClick={signOut}>Sign out</button>
        </>
      ) : (
        <Link href="/login">Sign in</Link>
      )}
    </nav>
  );
}
