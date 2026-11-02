'use client';

import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function Notes() {
  const [user, setUser] = useState(undefined);
  const [notes, setNotes] = useState([]);

  async function load(currentUser) {
    // Show only the signed-in user's notes.
    const { data } = await getBrowserClient()
      .from('notes')
      .select('*')
      .eq('owner_id', currentUser.id)
      .order('id', { ascending: false });
    setNotes(data ?? []);
  }

  useEffect(() => {
    getBrowserClient().auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) load(currentUser);
    });
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await getBrowserClient().from('notes').insert({
      owner_id: user.id,
      title: form.get('title'),
      body: form.get('body'),
      is_public: form.get('is_public') === 'on',
      created_at: new Date().toISOString(),
    });
    event.currentTarget?.reset();
    load(user);
  }

  if (user === undefined) return <p className="muted">Loading...</p>;
  if (!user) return <p>Sign in to see your notes.</p>;

  return (
    <>
      <h1>My notes</h1>
      <form onSubmit={onSubmit} className="stack">
        <input name="title" placeholder="Title" required />
        <textarea name="body" placeholder="Write something" rows={3} required />
        <label className="check"><input type="checkbox" name="is_public" /> Public</label>
        <button type="submit">Save note</button>
      </form>
      {notes.map((note) => (
        <div key={note.id} className="card">
          <strong>{note.title}</strong> {note.is_public && <span className="muted">(public)</span>}
          <p>{note.body}</p>
        </div>
      ))}
    </>
  );
}
