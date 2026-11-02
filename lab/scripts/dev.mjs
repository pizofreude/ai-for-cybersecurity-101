// Starts the Supabase emulator, waits for it, then starts Next.js. Both bind to 127.0.0.1 only.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { dbPath, labRoot } from '../emulator/db.mjs';

if (!existsSync(path.join(labRoot, '.env.local')) || !existsSync(dbPath)) {
  spawnSync(process.execPath, ['scripts/reset.mjs'], { cwd: labRoot, stdio: 'inherit' });
}

const children = [];

function start(args) {
  const child = spawn(process.execPath, args, { cwd: labRoot, stdio: 'inherit' });
  children.push(child);
  child.on('exit', (code) => {
    for (const other of children) if (other !== child) other.kill();
    process.exit(code ?? 0);
  });
  return child;
}

async function waitForEmulator() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const res = await fetch('http://127.0.0.1:54321/health');
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('Supabase emulator did not start on 127.0.0.1:54321. Is another process using the port?');
}

process.on('SIGINT', () => children.forEach((child) => child.kill()));

start(['--disable-warning=ExperimentalWarning', 'emulator/server.mjs']);
await waitForEmulator();
start([path.join(labRoot, 'node_modules', 'next', 'dist', 'bin', 'next'), 'dev', '-H', '127.0.0.1', '-p', '3000']);
