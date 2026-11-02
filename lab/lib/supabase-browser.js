'use client';

import { createClient } from '@supabase/supabase-js';

let client;

// The browser client uses the public anon key. Row-level security decides what it can read.
export function getBrowserClient() {
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return client;
}

// Calls a Next.js API route with the signed-in user's access token.
export async function apiFetch(path, options = {}) {
  const { data } = await getBrowserClient().auth.getSession();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (data.session) headers.Authorization = `Bearer ${data.session.access_token}`;
  return fetch(path, { ...options, headers });
}
