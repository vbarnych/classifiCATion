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

const METHOD_OFFSET = '/api/'.length;


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
  constructor(req, res, context) {
    this.req = req;
    this.res = res;
    this.app = context;
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

    try {
      const method = this.app.runScript(methodName, sandbox);
      console.dir(args)
      const result = await method(args);
      if (methodName === 'signIn') {
        const session = this.app.sessions.start(req);
        console.dir(session);
      //  res.setHeader('Set-Cookie', session.cookie);
      }
      console.log(result)
      res.end(JSON.stringify(result));
    } catch (err) {
      console.log(err.stack);
    }
  }
}

const handler = (app) => (req, res) => {
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

    this.server = http.createServer( handler(application) );
    this.server.listen(port, host);
  }
}

module.exports = Server;
