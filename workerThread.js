'use strict';

const tf = require('@tensorflow/tfjs-node');
const { Image } = require("image-js");
global.fetch = require('node-fetch');
const PATH = process.cwd();

const { worker, fsp, path } = require('./lib/libs.js');
const { threadId } = worker;

const App = require('./lib/app.js');
const Config = require('./lib/config.js');
const Database = require('./lib/queryBuilder.js');
const Server = require('./lib/server.js');
const Sessions = require('./lib/sessions.js');
const NeuronNetwork = require('./lib/neuronNetwork.js');

(async () => {
  const configPath = path.join(PATH, 'config');
  const config = await new Config(configPath);
  const { units } = config;
  const app = new App();
  Object.assign(app, { config });
  setTimeout(() => {
    app.database = new Database(units.databaseConfig, app);
    app.server = new Server(units.serverConfig, app);
    app.sessions = Sessions(app);
    //app.neuronNetwork = new NeuronNetwork();
    app.sandboxInject({ sessions: app.sessions });
    app.defaultSandbox = app.createSandbox();
    app.sessions.fillVMPool();
    //app.neuNet();
    console.log(`Application started in worker ${threadId}`);
    (async() => {
      //await app.getPrediction();
    })();
  }, 50);

  worker.parentPort.on('message', async message => {
    if (message.name === 'stop') {
      if (app.closed) return;
      console.log(`Graceful shutdown in worker ${threadId}`);
      await app.shutdown();
      process.exit(0);
    }
  });

  const logError = err => {
    console.dir(err);
  };

  process.on('uncaughtException', logError);
  process.on('warning', logError);
  process.on('unhandledRejection', logError);
})();
