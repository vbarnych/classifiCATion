'use strict';

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


class App extends events.EventEmitter {
  constructor(worker) {
    super();
    this.closed = false;
    this.api = new Map();
    this.cache = new Map();
    this.path = APP_PATH;
    this.namespaces = ['database'];

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
    const keys = async () => [...this.api.keys()];
    const context = Object.freeze({});
    const app = { Crypto, api: { keys }, context };
    for (const name of this.namespaces) app[name] = this[name];
    const sandbox = {
      module: {},
       app, Buffer, Libs
    };
    sandbox.global = sandbox;
    return vm.createContext(sandbox);
  }

  sandboxInject(namespaces) {
    const names = Object.keys(namespaces);
    for (const name of names) this[name] = Object.freeze(namespaces[name]);
    this.namespaces.push(...names);
  }

  async isolateScript(fileName) {
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
    if (!script) throw new Error('Script is not found');
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
      const filePath = path.join(API_PATH, fileName);
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
        key = `/${key.substring(1)}`;
        console.log(key);
      this.cache.set(key, staticFile);
    }
    catch (e) {
      console.dir(e.stack);
    }
  }
}

module.exports = App;
