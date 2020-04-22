const EventEmitter = require('events');
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const Config = require('./config.js');
const Server = require('./server.js');

const APP_PATH = process.cwd();


class App extends EventEmitter {
  constructor(worker) {
    super();
    this.closed = false;
    this.worker = worker;
    this.api = new Map();
    this.cache = new Map();
    this.path = APP_PATH;
    const configPath = path.join(APP_PATH, 'config');
    this.configured = new Config(configPath);
    this.sandbox = null;
    this.server = null;
    this.configured.on('uploaded', () => {
        const { units } = this.configured;
        this.server = new Server(units.server, this);
      });
    }
    async shutdown() {
    this.closed = true;
  };
}

module.exports = App;
