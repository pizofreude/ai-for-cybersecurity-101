'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { error: signInError } = await getBrowserClient().auth.signInWithPassword({
      email: form.get('email'),
      password: form.get('password'),
    });
    if (signInError) return setError(signInError.message);
    router.push('/');
  }

  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit} className="stack">
        <label>Email <input name="email" type="email" defaultValue="alice@lab.test" required /></label>
        <label>Password <input name="password" type="password" required /></label>
        <button type="submit">Sign in</button>
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}
