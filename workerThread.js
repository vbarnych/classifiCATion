'use strict';

const worker = require('worker_threads');

const App = require('./lib/app.js');
const app = new App(worker);

app.on('started', () => {
  console.log(`Started on thread ${worker.threadId}`);
});

worker.parentPort.on('message', async (message) => {
  if (message.name === 'stop') {
    if (app.closed) return;
    console.log(`Graceful shutdown on thread ${worker.threadId}`);
    await app.shutdown();
    process.exit(0);
  }
});
