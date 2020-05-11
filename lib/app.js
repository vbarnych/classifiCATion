'use strict';

const EventEmitter = require('events');
const Libs = require('./libs.js');
const { crypto, path, events, vm, fs, fsp, url } = Libs;


const Config = require('./config.js');
const Server = require('./server.js');
const Sessions = require('./sessions.js');
const Database = require('./queryBuilder.js');
const Crypto = require('./crypto.js');

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
    this.namespaces = ['database'];
    const configPath = path.join(APP_PATH, 'config');
    this.configured = new Config(configPath);
    this.defaultSandbox = null;
    this.server = null;
    this.database = null;
    this.sessions = Sessions(this);
    this.configured.on('uploaded', () => {
        const { units } = this.configured;
        this.server = new Server(units.serverConfig, this);
        this.sessions.fillVMPool;
        this.database = new Database(units.databaseConfig, this);

        this.defaultSandbox = this.createSandbox();
        this.emit('started');
    });

    this.serveStatic(STATIC_PATH);
    this.cacheMethods();
  }

  async shutdown() {
    this.closed = true;
    // if (!(this.database.closed))
    //{
    //  this.database.close();
    //}
  };

  createSandbox() {
    const sandbox = {
      console: {
        console, EventEmitter,
        setTimeout, setInterval, setImmediate,
      },
      api: Libs,
      app: this,
    };
    sandbox.global = sandbox;
    return vm.createContext(sandbox);
  }

  async isolateScript(fileName) {
    console.log(fileName);
    const code = await fsp.readFile(fileName, 'utf8');
    const src = `'use strict';\ncontext => ${code}`;;
    const options = { filename: fileName, lineOffset: -1 };
    try {
      return new vm.Script(src);
    } catch (err) {
      console.dir(err.stack);
      return null;
    }
  }

  runScript(methodName, sandbox = this.defaultSandbox) {
    const key = `${methodName}.js`;
    const script = this.api.get(key);
    if (!script) throw new Error('Not found');
    return script.runInContext(sandbox, { timeout: EXECUTION_TIMEOUT });
  }

  async cacheMethod(fileName) {
    const { method, ext } = path.parse(fileName);
    if (ext !== '.js') return;
    let key = '';
    const script = await this.isolateScript(fileName);
    if (script)
    {
      const lastSlash = fileName.lastIndexOf('\\');
      key = fileName.substring(lastSlash);
      key = `/${key.substring(1)}`;
      this.api.set(key, script);
    }
    else this.api.delete(key);
  }


  async cacheMethods() {
    const files = await fsp.readdir(API_PATH);

    for (const fileName of files) {
      console.log(fileName);
      const filePath = path.join(API_PATH, fileName);
      console.log(filePath);
      await this.cacheMethod(filePath);
    }
    fs.watch(API_PATH, (event, fileName) => {
      const filePath = path.join(API_PATH, fileName);
      this.cacheMethod(filePath);
    });
  }


  async serveStatic(dirPath) {
    const files = await fsp.readdir(dirPath, { withFileTypes: true });
    for (const fileName of files)
    {
      const filePath = path.join(dirPath, fileName.name);
      if (fileName.isDirectory())
      {
        await this.serveStatic(filePath);
      }
      await this.cacheFile(filePath);
    }

    fs.watch(dirPath, (event, fileName) => {
      const filePath = path.join(dirPath, fileName);
      this.cacheFile(filePath);
    });
  }

  async cacheFile(filePath) {
    let key = filePath.substring(STATIC_PATH.length);
    try {
      const staticFile = await fsp.readFile(filePath, 'utf8');
        const lastSlash = filePath.lastIndexOf('\\');
        let key = filePath.substring(lastSlash);
    //  console.log(key);
      this.cache.set(key, staticFile);
    }
    catch (e) {
      console.dir(e.stack);
    }
  }
}

module.exports = App;
