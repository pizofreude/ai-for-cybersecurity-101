// Minimal HS256 JWT, the format Supabase uses for anon, service_role, and user tokens.
import { createHmac, timingSafeEqual } from 'node:crypto';

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

export function sign(payload, secret) {
  const head = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}`;
  const sig = createHmac('sha256', secret).update(head).digest('base64url');
  return `${head}.${sig}`;
}

export function verify(token, secret) {
  const parts = String(token ?? '').split('.');
  if (parts.length !== 3) return null;
  const expected = createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest();
  const given = Buffer.from(parts[2], 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  } catch {
    return null;
  }
  if (payload.exp && payload.exp < Date.now() / 1000) return null;
  return payload;
}

export function decode(token) {
  try {
    return JSON.parse(Buffer.from(String(token).split('.')[1], 'base64url').toString());
  } catch {
    return null;
  }
}
