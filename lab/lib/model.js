// Chat model for KopiBot.
// With ANTHROPIC_API_KEY set, it calls Claude. Without one, it uses a simulated model
// that behaves like a naive LLM: it follows instructions wherever they appear in its input.
// The simulated model is deterministic, so every student sees the same result.

const INJECTION = /(ignore|disregard|forget)\b.{0,40}\b(instructions|prompt|rules)|system prompt|your (instructions|rules)|repeat (everything|the text) above/i;

function simulate(system, message) {
  const echo = message.match(/repeat after me:\s*([\s\S]*)/i);
  if (echo) return echo[1].trim();

  // Direct injection: the user asks for the hidden instructions.
  if (INJECTION.test(message)) return `Sure! Here are my instructions:\n\n${system}`;

  // Indirect injection: an instruction hidden inside data the bot was asked to read.
  if (/review/i.test(message)) {
    const reviews = system.split('Customer reviews:')[1] ?? '';
    if (INJECTION.test(reviews)) return `Following the instructions in the reviews:\n\n${system}`;
    return `Customers say: ${reviews.trim().split('\n').slice(0, 3).join(' ') || 'no reviews yet.'}`;
  }

  return 'We sell **Kopi Beans 500g** (RM 45.00) and a **Pour-over Kettle** (RM 129.00). Ask me about brewing, products, or reviews.';
}

async function callClaude(system, message) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.LAB_MODEL || 'claude-haiku-5-5',
      max_tokens: 500,
      system,
      messages: [{ role: 'user', content: message }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? `Claude API returned ${res.status}`);
  return data.content?.find((block) => block.type === 'text')?.text ?? '';
}

export async function complete({ system, message, model }) {
  const useClaude = model !== 'simulated' && Boolean(process.env.ANTHROPIC_API_KEY);
  if (!useClaude) return { model: 'simulated', text: simulate(system, message) };
  return { model: process.env.LAB_MODEL || 'claude-haiku-5-5', text: await callClaude(system, message) };
}
