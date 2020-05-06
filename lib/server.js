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


const parseRequest = async request => new Promise(resolve, reject => {
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
    this.externalContext = context;
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
    const fileName = url === '/' ? '/homepage.html' : url;
    const fileExt = path.extname(fileName).substring(1);
    const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
    this.res.writeHead(200, {
       'Content-Type': mimeType
    });

    console.log(fileName);

    const keys = (this.externalContext.cache).keys;
    console.log(keys)
    const data = this.externalContext.cache.get(fileName);
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

    const session = this.externalContext.sessions.restore(req);
    const sandbox = session ? session.sandbox : undefined;

    const parsedRequest = await parseRequest(req);
  }
}

const handler = (clientContext) => (req, res) => {
  const client = new Client(req, res, clientContext);
  const { method, url } = req;
  console.log(`${method}  ${url}`);
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
