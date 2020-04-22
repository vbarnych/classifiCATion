'use strict';

const EventEmitter = require('events');
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const Config = require('./config.js');
const Server = require('./server.js');

const APP_PATH = process.cwd();
const STATIC_PATH = path.join(APP_PATH, 'static');
const PARSING_TIMEOUT = 3000;
const EXECUTION_TIMEOUT = 7000;
const API_PATH = path.join(APP_PATH, 'api');


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
    this.defaultSandbox = null;
    this.server = null;
    this.configured.on('uploaded', () => {
        const { units } = this.configured;
        this.server = new Server(units.server, this);
      });
  }
  async shutdown() {
    this.closed = true;
  };

  createSandbox() {
    const sandbox = {
      console: console,
      application: this,
      api: { fs, path, crypto, url, stream },
    };
    sandbox.global = sandbox;
    return vm.createContext(sandbox);
  }

  async createScript(fileName) {
    const code = await fsp.readFile(fileName, 'utf8');
    const src = `'use strict';\ncontext => ${code}`;
    try {
      return new vm.Script(src);
    } catch (err) {
      this.logger.error(err.stack);
      return null;
    }
  }

  async isolateScript(fileName) {
    const code = await fs.readFile(fileName, 'utf8');
    const src = `context => ${code}`;
    let script;
    try
    {
      script = new vm.Script(src, { timeout: PARSING_TIMEOUT });
    }
    catch (e)
    {
      console.dir(e);
      console.log('Parsing timeout');
      return null;
    }
  }

  runScript(methodName, sandbox = this.defaultSandbox) {
    const script = this.api.get(methodName);
    if (!script) throw new Error('Not found');
    return script.runInContext(sandbox, { timeout: EXECUTION_TIMEOUT });
  }

  async cacheMethod(fileName) {
    const { method, ext } = path.parse(fileName);
    if (ext !== '.js') return;
    try {
      const method = await app.isolateScript(fileName);
      this.api.set(name, method);
    } catch (e) {
      console.dir(e);
      this.api.delete(name);
    }
  }

  async cacheMethods() {
    const files = await fsp.readdir(API_PATH);
    for (const fileName of files) {
      const filePath = path.join(API_PATH, fileName);
      await this.cacheMethod(filePath);
    }
    fs.watch(API_PATH, (event, fileName) => {
      const filePath = path.join(API_PATH, fileName);
      this.cacheMethod(filePath);
    });
  }
}

module.exports = App;
