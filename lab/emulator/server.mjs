// Local Supabase emulator for the lab. Binds to 127.0.0.1:54321, the Supabase CLI default port.
// It speaks the subset of the Supabase wire format the lab uses:
//   /auth/v1/token, /auth/v1/user, /auth/v1/logout   (GoTrue)
//   /rest/v1/<table>                                   (PostgREST)
//   /pg/query                                          (stands in for a direct Postgres connection, service_role only)
import http from 'node:http';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { loadEnv, openDb } from './db.mjs';
import { sign, verify } from './jwt.mjs';
import { hiddenTables, policies } from './policies.mjs';

loadEnv();
const SECRET = process.env.SUPABASE_JWT_SECRET;
const HOST = '127.0.0.1';
const PORT = 54321;
const db = openDb();

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, prefer, accept, accept-profile, content-profile, x-client-info, range',
};

function send(res, status, body) {
  if (body === undefined) {
    res.writeHead(status, cors);
    return res.end();
  }
  res.writeHead(status, { ...cors, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

// ---------- auth ----------

function bearer(req) {
  const header = req.headers.authorization ?? '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

function authContext(req) {
  if (!verify(req.headers.apikey, SECRET)) return null;
  const claims = verify(bearer(req) ?? req.headers.apikey, SECRET);
  if (!claims || claims.typ === 'refresh') return null;
  return { role: claims.role, uid: claims.role === 'authenticated' ? claims.sub : null };
}

function userJson(row) {
  return {
    id: row.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: row.email,
    email_confirmed_at: row.created_at,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    created_at: row.created_at,
    updated_at: row.created_at,
  };
}

function session(row) {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: sign({ sub: row.id, email: row.email, role: 'authenticated', aud: 'authenticated', iat: now, exp: now + 3600 }, SECRET),
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: sign({ sub: row.id, typ: 'refresh', iat: now, exp: now + 7 * 24 * 3600 }, SECRET),
    user: userJson(row),
  };
}

function passwordMatches(password, stored) {
  const [, salt, hash] = stored.split('$');
  return timingSafeEqual(scryptSync(String(password), salt, 32), Buffer.from(hash, 'hex'));
}

async function handleAuth(req, res, url) {
  if (!verify(req.headers.apikey, SECRET)) return send(res, 401, { message: 'Invalid API key' });

  if (url.pathname === '/auth/v1/token' && req.method === 'POST') {
    const body = await readJson(req);
    const grant = url.searchParams.get('grant_type');
    let row;
    if (grant === 'password') {
      row = db.prepare('SELECT * FROM users WHERE email = ?').get(String(body.email ?? '').toLowerCase());
      if (!row || !passwordMatches(body.password ?? '', row.password_hash)) {
        return send(res, 400, { code: 'invalid_credentials', error: 'invalid_grant', error_description: 'Invalid login credentials', msg: 'Invalid login credentials' });
      }
    } else if (grant === 'refresh_token') {
      const claims = verify(body.refresh_token, SECRET);
      if (!claims || claims.typ !== 'refresh') return send(res, 400, { error: 'invalid_grant', msg: 'Invalid Refresh Token' });
      row = db.prepare('SELECT * FROM users WHERE id = ?').get(claims.sub);
    }
    if (!row) return send(res, 400, { error: 'unsupported_grant_type', msg: 'Unsupported grant type' });
    return send(res, 200, session(row));
  }

  if (url.pathname === '/auth/v1/user' && req.method === 'GET') {
    const claims = verify(bearer(req), SECRET);
    if (!claims || claims.role !== 'authenticated') return send(res, 401, { code: 401, msg: 'Invalid JWT', error_code: 'bad_jwt' });
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(claims.sub);
    if (!row) return send(res, 404, { msg: 'User not found' });
    return send(res, 200, userJson(row));
  }

  if (url.pathname === '/auth/v1/logout' && req.method === 'POST') return send(res, 204);

  return send(res, 404, { msg: 'Not found' });
}

// ---------- REST (PostgREST subset) ----------

const ops = { eq: '=', neq: '!=', gt: '>', gte: '>=', lt: '<', lte: '<=', like: 'LIKE', ilike: 'LIKE' };
const reserved = new Set(['select', 'order', 'limit', 'offset', 'columns', 'on_conflict']);

function restError(status, code, message) {
  return Object.assign(new Error(message), { status, body: { code, message, details: null, hint: null } });
}

function columnsOf(table) {
  if (hiddenTables.has(table) || !/^[a-z_]+$/.test(table)) return null;
  const cols = db.prepare(`PRAGMA table_info("${table}")`).all().map((c) => c.name);
  return cols.length ? cols : null;
}

function checkColumn(cols, table, col) {
  if (!cols.includes(col)) throw restError(400, '42703', `column ${table}.${col} does not exist`);
}

function toSql(value) {
  if (value === 'true' || value === true) return 1;
  if (value === 'false' || value === false) return 0;
  return value;
}

function fromDb(row) {
  const out = {};
  for (const [key, value] of Object.entries(row)) out[key] = key.startsWith('is_') ? Boolean(value) : value;
  return out;
}

function whereClause(url, cols, table) {
  const clauses = [];
  const params = [];
  for (const [key, raw] of url.searchParams) {
    if (reserved.has(key)) continue;
    checkColumn(cols, table, key);
    const dot = raw.indexOf('.');
    const op = raw.slice(0, dot);
    const value = raw.slice(dot + 1);
    if (op === 'is') {
      clauses.push(`"${key}" IS ${value === 'null' ? 'NULL' : value === 'true' ? '1' : '0'}`);
    } else if (op === 'in') {
      const list = value.replace(/^\(|\)$/g, '').split(',').map((v) => toSql(v.replace(/^"|"$/g, '')));
      clauses.push(`"${key}" IN (${list.map(() => '?').join(', ')})`);
      params.push(...list);
    } else if (ops[op]) {
      clauses.push(`"${key}" ${ops[op]} ?`);
      params.push(op.endsWith('like') ? value.replaceAll('*', '%') : toSql(value));
    } else {
      throw restError(400, 'PGRST100', `unknown operator ${op}`);
    }
  }
  return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

function orderClause(url, cols, table) {
  const order = url.searchParams.get('order');
  if (!order) return '';
  const parts = order.split(',').map((term) => {
    const [col, dir] = term.split('.');
    checkColumn(cols, table, col);
    return `"${col}" ${dir === 'desc' ? 'DESC' : 'ASC'}`;
  });
  return `ORDER BY ${parts.join(', ')}`;
}

function project(rows, url, cols, table) {
  const select = (url.searchParams.get('select') ?? '*').replace(/\s/g, '');
  if (select === '*') return rows;
  const wanted = select.split(',');
  for (const col of wanted) checkColumn(cols, table, col);
  return rows.map((row) => Object.fromEntries(wanted.map((col) => [col, row[col]])));
}

function allowed(table, op, row, auth) {
  if (auth.role === 'service_role') return true;
  const policy = policies[table];
  if (!policy) return false;
  if (!policy.rls) return true;
  return typeof policy[op] === 'function' ? Boolean(policy[op](row, auth)) : false;
}

function respondRows(req, res, status, rows) {
  if ((req.headers.accept ?? '').includes('vnd.pgrst.object')) {
    if (rows.length !== 1) {
      return send(res, 406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: `The result contains ${rows.length} rows`, hint: null });
    }
    return send(res, status, rows[0]);
  }
  return send(res, status, rows);
}

function writableValues(row, keys) {
  return keys.map((key) => toSql(row[key]));
}

async function handleRest(req, res, url, auth) {
  const table = url.pathname.slice('/rest/v1/'.length);
  const cols = columnsOf(table);
  if (!cols) return send(res, 404, { code: 'PGRST205', message: `Could not find the table 'public.${table}' in the schema cache`, details: null, hint: null });
  const returning = (req.headers.prefer ?? '').includes('return=representation');

  if (req.method === 'GET') {
    const where = whereClause(url, cols, table);
    const rows = db.prepare(`SELECT * FROM "${table}" ${where.sql} ${orderClause(url, cols, table)}`).all(...where.params)
      .map(fromDb)
      .filter((row) => allowed(table, 'select', row, auth));
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : rows.length;
    return respondRows(req, res, 200, project(rows.slice(offset, offset + limit), url, cols, table));
  }

  if (req.method === 'POST') {
    const body = await readJson(req);
    const inserted = [];
    for (const row of Array.isArray(body) ? body : [body]) {
      const keys = Object.keys(row);
      keys.forEach((key) => checkColumn(cols, table, key));
      if (!allowed(table, 'insert', row, auth)) throw restError(403, '42501', `new row violates row-level security policy for table "${table}"`);
      const sql = `INSERT INTO "${table}" (${keys.map((k) => `"${k}"`).join(', ')}) VALUES (${keys.map(() => '?').join(', ')}) RETURNING *`;
      inserted.push(fromDb(db.prepare(sql).get(...writableValues(row, keys))));
    }
    if (!returning) return send(res, 201);
    return respondRows(req, res, 201, project(inserted, url, cols, table));
  }

  if (req.method === 'PATCH' || req.method === 'DELETE') {
    const op = req.method === 'PATCH' ? 'update' : 'delete';
    const body = op === 'update' ? await readJson(req) : {};
    const keys = Object.keys(body);
    keys.forEach((key) => checkColumn(cols, table, key));
    const where = whereClause(url, cols, table);
    const targets = db.prepare(`SELECT rowid AS _rowid, * FROM "${table}" ${where.sql}`).all(...where.params)
      .filter(({ _rowid, ...row }) => allowed(table, op, fromDb(row), auth));
    const changed = targets.map(({ _rowid }) => {
      const sql = op === 'update'
        ? `UPDATE "${table}" SET ${keys.map((k) => `"${k}" = ?`).join(', ')} WHERE rowid = ? RETURNING *`
        : `DELETE FROM "${table}" WHERE rowid = ? RETURNING *`;
      return fromDb(db.prepare(sql).get(...writableValues(body, keys), _rowid));
    });
    if (!returning) return send(res, 204);
    return respondRows(req, res, 200, project(changed, url, cols, table));
  }

  return send(res, 405, { message: 'Method not allowed' });
}

// ---------- direct SQL (stands in for a Postgres connection string) ----------

async function handleQuery(req, res, auth) {
  if (auth.role !== 'service_role') return send(res, 403, { message: 'service_role key required' });
  const { sql, params = [] } = await readJson(req);
  try {
    const statement = db.prepare(String(sql));
    if (/^\s*(select|with)\b/i.test(sql) || /\breturning\b/i.test(sql)) return send(res, 200, { rows: statement.all(...params) });
    const result = statement.run(...params);
    return send(res, 200, { rows: [], changes: Number(result.changes) });
  } catch (error) {
    return send(res, 400, { message: error.message });
  }
}

// ---------- server ----------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  try {
    if (req.method === 'OPTIONS') return send(res, 204);
    if (url.pathname === '/health') return send(res, 200, { ok: true });
    if (url.pathname.startsWith('/auth/v1/')) return await handleAuth(req, res, url);
    const auth = authContext(req);
    if (!auth) return send(res, 401, { message: 'Invalid API key or JWT' });
    if (url.pathname.startsWith('/rest/v1/')) return await handleRest(req, res, url, auth);
    if (url.pathname === '/pg/query' && req.method === 'POST') return await handleQuery(req, res, auth);
    return send(res, 404, { message: 'Not found' });
  } catch (error) {
    if (error.status) return send(res, error.status, error.body);
    console.error(error);
    return send(res, 500, { message: 'Emulator error' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Supabase emulator listening on http://${HOST}:${PORT}`);
});
