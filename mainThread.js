'use strict';

//const { Worker } = require('worker_threads');

const PORTS_NUMBER = 1;

//const workers = [];
const { Worker } = require('worker_threads');
const path = require('path');

const Config = require('./lib/config.js');

const PATH = process.cwd();
const CFG_PATH = path.join(PATH, 'config');

(async () => {
  const config = await new Config(CFG_PATH);
  const { units } = config;
  const count = PORTS_NUMBER;
  const workers = new Array(count);

  const start = id => {
    const worker = new Worker('./workerThread.js');
    workers[id] = worker;
    worker.on('exit', code => {
      if (code !== 0) start(id);
    });
  };

  for (let id = 0; id < count; id++) start(id);


  process.on('SIGINT', async () => {
  console.log('Got exit signal');
  for (let i = 0; i < PORTS_NUMBER; ++i)
  {
    workers[i].postMessage({ name: 'stop' });
  }
});

})();
