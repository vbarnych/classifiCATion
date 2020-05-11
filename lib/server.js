'use strict';

const http = require('http');
const path = require('path');



const MIME_TYPES = {
  jpg: 'image/jpeg',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const METHOD_OFFSET = '/api'.length;


const parseRequest = async request => new Promise((resolve, reject) => {
  const buffer = [];
  request.on('data', chunk => {
    buffer.push(chunk);
  }).on('end', async () => {
    const data = buffer.join('');
    resolve(JSON.parse(data));
  });
});


class Client {
  constructor(req, res, app) {
    this.req = req;
    this.res = res;
    this.app = app;
  }

  throwError(statusCode) {
    if (this.res.writableEnded) return;
    this.res.writeHead(statusCode, {
      'Content-Type': 'text/plain'
    });
    this.res.end(`HTTP ${statusCode}:\t${http.STATUS_CODES[statusCode]}`);
  }

  sendStatic() {
    const { url } = this.req;
    const fileName = url === '/' ? '\\homepage.html' : url;
    const fileExt = path.extname(fileName).substring(1);
    const mimeType = MIME_TYPES[fileExt];
    this.res.writeHead(200, {
       'Content-Type': mimeType
    });

    console.log(fileName);

    const lastSlash = fileName.lastIndexOf('/');
    console.log(lastSlash);
    let key = fileName.substring(lastSlash);
    key = `\\${key.substring(1)}`;
    console.log(key);
    const data = this.app.cache.get(key);
    if (data)
    {
      this.res.end(data);
    }
    else this.throwError(404);
  }


  async api() {
    const { req, res } = this;
    const { url } = req;
    const methodName = url.substring(METHOD_OFFSET);

    const session = this.app.sessions.restore(req);

    const args = await parseRequest(req);
    const sandbox = session ? session.sandbox : undefined;
    const context = session ? session.context : {};
    //console.dir(session);
    //console.dir(sandbox);
    console.dir(context);

    try {
      const proc = this.app.runScript(methodName, sandbox);
    //console.dir(method);
      console.dir(args)
      const result = await proc(this.app.database);
      if (methodName === 'signIn') {
        const session = this.app.sessions.start(req);
      //  res.setHeader('Set-Cookie', session.cookie);
      }
      console.dir(result)

      res.end(JSON.stringify(await result(args)));
    } catch (err) {
      console.log(err);
    }
  }
}

const listener = (app) => (req, res) => {
  const client = new Client(req, res, app);
  const { method, url } = req;
  console.log(`${method}    ${url}`);
  if (url.startsWith('/api/'))
  {
    if (method === 'POST')
    {
      client.api();
    } else client.throwError(res, 403);
  } else client.sendStatic();
};



class Server {
  constructor(config, application) {
    this.config = config;
    this.application = application;
    const { ports, host } = config;
    const { threadId } = application.worker;
    const port = ports[threadId - 1];
    const handler = listener(application);
    this.server = http.createServer( {application}, handler );
    this.server.listen(port, host);
  }
}

module.exports = Server;
