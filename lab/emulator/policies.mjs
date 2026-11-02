// Row-level security for the emulator, one entry per table.
// rls: false means the table is fully readable and writable with the public anon key,
// which is what Supabase does when RLS is disabled on a table in the public schema.
// The service_role key bypasses every policy, as in Supabase.
// Each policy names the Supabase SQL it stands for.

export const policies = {
  // create policy "own profile" on profiles for select using (auth.uid() = id);
  profiles: {
    rls: true,
    select: (row, auth) => row.id === auth.uid,
  },

  // create policy "own or public notes" on notes for select using (auth.uid() = owner_id or is_public);
  // create policy "insert own notes" on notes for insert with check (auth.uid() = owner_id);
  // RLS was switched off while debugging "notes not showing up" and never switched back on.
  notes: {
    rls: false,
    select: (row, auth) => row.owner_id === auth.uid || Boolean(row.is_public),
    insert: (row, auth) => row.owner_id === auth.uid,
  },

  // create policy "listed products" on products for select using (is_listed);
  products: {
    rls: true,
    select: (row) => Boolean(row.is_listed),
  },

  // create policy "read comments" on comments for select using (true);
  comments: {
    rls: true,
    select: () => true,
  },

  // create policy "own orders" on orders for select using (auth.uid() = user_id);
  orders: {
    rls: true,
    select: (row, auth) => row.user_id === auth.uid,
  },

  // RLS on with no policy: nobody reads coupons through the API.
  coupons: {
    rls: true,
  },
};

// Tables outside the public schema. Never served by the REST API.
export const hiddenTables = new Set(['users']);
