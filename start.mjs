import { spawn } from 'node:child_process';
import process from 'node:process';

console.log('🚀 Memulai seluruh layanan UNKLAB HUB...\n');

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';
const nodeCmd = process.execPath;

const services = [
  { name: 'Vite (Frontend)', cmd: npxCmd, args: ['vite'], color: '\x1b[36m' },
  { name: 'Gemini Proxy   ', cmd: nodeCmd, args: ['server.mjs'], color: '\x1b[35m' },
  { name: 'Database (Mock)', cmd: npxCmd, args: ['json-server', '--watch', 'db.json', '--port', '3001'], color: '\x1b[33m' },
];

const children = [];

for (const svc of services) {
  const child = spawn(svc.cmd, svc.args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
    env: process.env,
  });

  child.stdout.on('data', (chunk) => {
    const lines = chunk.toString().trimEnd().split(/\r?\n/);
    for (const line of lines) {
      console.log(`${svc.color}[${svc.name}]\x1b[0m ${line}`);
    }
  });

  child.stderr.on('data', (chunk) => {
    const lines = chunk.toString().trimEnd().split(/\r?\n/);
    for (const line of lines) {
      console.error(`${svc.color}[${svc.name} ERR]\x1b[0m ${line}`);
    }
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${svc.color}[${svc.name}]\x1b[0m proses keluar dengan kode ${code}`);
    }
  });

  children.push(child);
}

function shutdown() {
  console.log('\n🛑 Menghentikan semua layanan...');
  for (const child of children) {
    child.kill('SIGINT');
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
