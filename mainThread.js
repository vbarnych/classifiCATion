'use strict';

const { Worker } = require('worker_threads');

const PORTS_NUMBER = 2;

const workers = [];
for (let i = 0; i < PORTS_NUMBER; ++i)
{
  const worker = new Worker('./workerThread.js');
  workers.push(worker);
}

process.on('SIGINT', async () => {
  console.log('Got exit signal');
  for (let i = 0; i < PORTS_NUMBER; ++i)
  {
    workers[i].postMessage({ name: 'stop' });
  }
});
