'use client';

import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;
    setMessages((prev) => [...prev, { from: 'you', text: message }]);
    setInput('');
    setBusy(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setBusy(false);
    setMessages((prev) => [...prev, res.ok
      ? { from: `KopiBot (${data.model})`, html: data.reply_html }
      : { from: 'error', text: data.error }]);
  }

  return (
    <>
      <h1>Chat with KopiBot</h1>
      <p className="muted">Without an API key KopiBot runs on a simulated model. Add ANTHROPIC_API_KEY to lab/.env.local to use Claude.</p>
      {messages.map((m, i) => (
        <div key={i} className="card">
          <strong>{m.from}</strong>
          {m.html !== undefined
            ? <p dangerouslySetInnerHTML={{ __html: m.html }} />
            : <p style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>}
        </div>
      ))}
      <form onSubmit={onSubmit} className="stack" style={{ maxWidth: 'none', gridTemplateColumns: '1fr auto' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about products or reviews" />
        <button type="submit" disabled={busy}>{busy ? '...' : 'Send'}</button>
      </form>
    </>
  );
}
