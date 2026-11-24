
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import net from 'node:net';

const automationDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const root = path.resolve(automationDir, '..', '..', '..');
const serverDir = path.join(root, 'server');
const clientDir = path.join(root, 'client');

const requireServer = createRequire(
  pathToFileURL(path.join(serverDir, 'package.json'))
);

const { MongoMemoryServer } = requireServer('mongodb-memory-server');

const mode = process.argv[2] || 'ui';

if (!['ui', 'bdd'].includes(mode)) {
  throw new Error('Use: node scripts/isolated-runner.mjs ui|bdd');
}

let mongo;
let backend;
let frontend;
let interrupted = false;

const isWin = process.platform === 'win32';

// Start an application service.
function spawnService(command, args, cwd, env) {
  const child = spawn(command, args, {
    cwd,
    env,
    stdio: 'inherit',
    shell: false,
    windowsHide: true,
  });

  child.on('error', (error) => {
    console.error(`Service startup error: ${error.message}`);
  });

  return child;
}

// Wait for the backend API to become ready.
async function waitForHealth() {
  const deadline = Date.now() + 90000;

  while (Date.now() < deadline) {
    if (
      backend.exitCode !== null ||
      backend.signalCode !== null ||
      frontend.exitCode !== null ||
      frontend.signalCode !== null
    ) {
      throw new Error(
        'One of the app servers exited before becoming ready'
      );
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/health',
        { signal: AbortSignal.timeout(2000) }
      );

      if (response.ok) return;
    } catch {
      // Retry until the deadline.
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  throw new Error('Backend health endpoint did not become ready');
}

// Wait for the frontend application.
async function waitForFrontend() {
  const deadline = Date.now() + 60000;

  while (Date.now() < deadline) {
    if (
      frontend.exitCode !== null ||
      frontend.signalCode !== null
    ) {
      throw new Error('Vite frontend exited before becoming ready');
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:4000/login',
        { signal: AbortSignal.timeout(2000) }
      );

      if (response.ok) return;
    } catch {
      // Retry until the deadline.
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  throw new Error('Vite frontend did not become ready');
}

// Execute Selenium or Cucumber tests.
function runTests() {
  const script = mode === 'ui' ? 'ui:raw' : 'bdd:raw';
  const command = isWin ? 'npm.cmd' : 'npm';
  const tag = process.argv[3];

  if (
    tag &&
    (mode !== 'bdd' || !/^@M3-BDD0[1-8]$/.test(tag))
  ) {
    throw new Error('Use a scenario tag such as @M3-BDD01');
  }

  return new Promise((resolve, reject) => {
    const args = [
      'run',
      script,
      ...(tag ? ['--', '--tags', tag] : []),
    ];

    const child = spawn(command, args, {
      cwd: automationDir,
      env: {
        ...process.env,
        M3_TEST_MODE: 'isolated',
        M3_BASE_URL: 'http://127.0.0.1:4000',
      },
      stdio: 'inherit',
      shell: isWin,
    });

    child.once('error', reject);

    child.once('close', (code) => {
      resolve(code ?? 1);
    });
  });
}

// Wait for a child process to terminate.
async function waitForProcessClose(child, timeoutMs = 5000) {
  if (!child) return true;

  if (
    child.exitCode !== null ||
    child.signalCode !== null
  ) {
    return true;
  }

  return new Promise((resolve) => {
    let finished = false;

    const finish = (closed) => {
      if (finished) return;
      finished = true;

      clearTimeout(timer);
      child.removeListener('close', onClose);
      child.removeListener('error', onError);

      resolve(closed);
    };

    const onClose = () => finish(true);
    const onError = () => finish(true);

    child.once('close', onClose);
    child.once('error', onError);

    const timer = setTimeout(() => {
      finish(false);
    }, timeoutMs);
  });
}

// Stop services and wait for their termination.
async function stopProcess(child) {
  if (!child) return;

  if (
    child.exitCode !== null ||
    child.signalCode !== null
  ) {
    return;
  }

  if (isWin) {
    await new Promise((resolve) => {
      const taskkill = spawn(
        'taskkill',
        ['/PID', String(child.pid), '/T', '/F'],
        { stdio: 'ignore' }
      );

      taskkill.once('close', resolve);
      taskkill.once('error', resolve);
    });

    await waitForProcessClose(child, 5000);
  } else {
    child.kill('SIGTERM');

    const closed = await waitForProcessClose(child, 5000);

    if (!closed) {
      console.warn(
        `Process ${child.pid} did not stop. Sending SIGKILL.`
      );

      child.kill('SIGKILL');
      await waitForProcessClose(child, 3000);
    }
  }
}

process.on('SIGINT', () => {
  interrupted = true;
});

let outcome = 1;

try {
  // Prevent connections to an already-running application.
  // This protects the shared MongoDB Atlas database.
  for (const [port, label] of [
    [5000, 'backend'],
    [4000, 'frontend'],
  ]) {
    const occupied = await new Promise((resolve) => {
      const socket = net.createConnection({
        host: '127.0.0.1',
        port,
      });

      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.once('error', () => resolve(false));

      socket.setTimeout(1500, () => {
        socket.destroy();
        resolve(false);
      });
    });

    if (occupied) {
      throw new Error(
        `${label} port ${port} is already in use. Stop npm run dev first.`
      );
    }
  }

  // Start a temporary MongoDB database.
  mongo = await MongoMemoryServer.create({
    instance: {
      dbName: 'ecocycle_m3_isolated',
    },
  });

  const uri = mongo.getUri('ecocycle_m3_isolated');

  const env = {
    ...process.env,
    MONGODB_URI: uri,
    PORT: '5000',
    CLIENT_ORIGIN:
      'http://127.0.0.1:4000,http://127.0.0.1:5173',
    NODE_ENV: 'development',
    DNS_SERVERS: 'system',
    M3_TEST_MODE: 'isolated',
  };

  // Start backend directly using Node.js.
  backend = spawnService(
    process.execPath,
    ['src/server.js'],
    serverDir,
    env
  );

  // FIX: Start Vite directly instead of through npm.
  // This avoids leaving an npm/Vite child process running.
  const viteEntry = path.join(
    clientDir,
    'node_modules',
    'vite',
    'bin',
    'vite.js'
  );

  frontend = spawnService(
    process.execPath,
    [
      viteEntry,
      '--host',
      '127.0.0.1',
      '--strictPort',
    ],
    clientDir,
    env
  );

  await waitForHealth();
  await waitForFrontend();

  if (interrupted) {
    throw new Error('Interrupted before test execution');
  }

  console.log(
    'Temporary MongoDB and both app servers are ready. Executing tests.'
  );

  outcome = await runTests();

} catch (error) {
  console.error(`QA runner failed: ${error.message}`);

} finally {
  // Stop both application servers.
  await stopProcess(frontend);
  await stopProcess(backend);

  // Stop temporary MongoDB.
  if (mongo) {
    await mongo.stop();
  }

  console.log(
    'Isolated test environment shut down; temporary records discarded.'
  );
}

process.exitCode = outcome;
