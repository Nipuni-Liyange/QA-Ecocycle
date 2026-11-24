
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import net from 'node:net';
import { tmpdir } from 'node:os';

const automationDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const root = path.resolve(automationDir, '..', '..', '..');
const serverDir = path.join(root, 'server');
const clientDir = path.join(root, 'client');
const postmanDir = path.join(root, 'qa', 'member1', 'postman');
const collectionPath = path.join(
  postmanDir,
  'EcoCycle-Functional.postman_collection.json'
);
const reportPath = path.join(
  tmpdir(),
  `ecocycle-ci-newman-${randomUUID()}.json`
);
const newmanBaseUrl = 'http://127.0.0.1:5000';

const requireServer = createRequire(
  pathToFileURL(path.join(serverDir, 'package.json'))
);
const requirePostman = createRequire(
  pathToFileURL(path.join(postmanDir, 'package.json'))
);

const { MongoMemoryServer } = requireServer('mongodb-memory-server');

const mode = process.argv[2] || 'ui';

if (!['ui', 'bdd', 'newman'].includes(mode)) {
  throw new Error('Use: node scripts/isolated-runner.mjs ui|bdd|newman');
}

let mongo;
let backend;
let frontend;
let newmanCollection;
let interrupted = false;

const isWin = process.platform === 'win32';

// Pin every collection request to the isolated local backend.
function prepareNewmanCollection() {
  const collection = JSON.parse(
    readFileSync(collectionPath, 'utf8')
  );
  const baseUrl = Array.isArray(collection.variable)
    ? collection.variable.find((variable) => variable.key === 'baseUrl')
    : null;

  if (!baseUrl) {
    throw new Error('Newman collection is missing its baseUrl variable');
  }

  baseUrl.value = newmanBaseUrl;

  function inspectCollection(value) {
    if (Array.isArray(value)) {
      value.forEach(inspectCollection);
      return;
    }

    if (!value || typeof value !== 'object') return;

    if (value.request) {
      const requestUrl = value.request.url;
      const rawUrl =
        typeof requestUrl === 'string' ? requestUrl : requestUrl?.raw;

      if (
        typeof rawUrl !== 'string' ||
        !rawUrl.startsWith('{{baseUrl}}/')
      ) {
        throw new Error(
          'Newman collection contains a request outside the local baseUrl'
        );
      }

      const resolvedUrl = new URL(
        rawUrl.replace('{{baseUrl}}', newmanBaseUrl)
      );

      if (resolvedUrl.origin !== newmanBaseUrl) {
        throw new Error(
          'Newman collection contains a request outside the local baseUrl'
        );
      }

      value.request.url = rawUrl.replace(
        '{{baseUrl}}',
        newmanBaseUrl
      );
    }

    if (value.script && Array.isArray(value.script.exec)) {
      const script = value.script.exec.join('\n');

      if (
        /\bbaseUrl\b|\bpm\.request\.url\b|\bpm\.sendRequest\b|\bpm\.execution\.runRequest\b|\bfetch\s*\(|\bXMLHttpRequest\b/i.test(
          script
        )
      ) {
        throw new Error(
          'Newman collection scripts must not override request URLs or send independent network requests'
        );
      }
    }

    Object.values(value).forEach(inspectCollection);
  }

  inspectCollection(collection);
  return collection;
}

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
      (frontend &&
        (frontend.exitCode !== null || frontend.signalCode !== null))
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

// Execute Member 1's API collection with the locally installed Newman package.
function runNewmanTests(collection) {
  const newman = requirePostman('newman');
  console.log(`Newman JSON report: ${reportPath}`);

  return new Promise((resolve, reject) => {
    newman.run(
      {
        collection,
        reporters: ['cli', 'json'],
        reporter: {
          json: {
            export: reportPath,
          },
        },
        ignoreRedirects: true,
        workingDir: postmanDir,
      },
      (error, summary) => {
        if (error) {
          reject(error);
          return;
        }

        if (!summary || !summary.run) {
          reject(new Error('Newman completed without a run summary'));
          return;
        }

        resolve(
          summary.run.error || summary.run.failures.length > 0 ? 1 : 0
        );
      }
    );
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
  if (mode === 'newman') {
    newmanCollection = prepareNewmanCollection();
  }

  // Prevent connections to an already-running application.
  // This protects the shared MongoDB Atlas database.
  const portsToCheck =
    mode === 'newman'
      ? [[5000, 'backend']]
      : [
          [5000, 'backend'],
          [4000, 'frontend'],
        ];

  for (const [port, label] of portsToCheck) {
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

  if (mode !== 'newman') {
    // Start Vite directly instead of through npm to avoid orphaning its process.
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
  }

  await waitForHealth();
  if (mode !== 'newman') {
    await waitForFrontend();
  }

  if (interrupted) {
    throw new Error('Interrupted before test execution');
  }

  console.log(
    mode === 'newman'
      ? 'Temporary MongoDB and backend are ready. Executing Newman tests.'
      : 'Temporary MongoDB and both app servers are ready. Executing tests.'
  );

  outcome =
    mode === 'newman'
      ? await runNewmanTests(newmanCollection)
      : await runTests();

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
