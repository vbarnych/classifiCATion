'use strict';

const http = require('http');
const path = require('path');



const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};


const clients = new Map();

class Client {
  constructor(req, res, context) {
    this.req = req;
    this.res = res;
    this.context = context;
  }

  throwError(statusCode) {
    this.res.writeHead(statusCode, {
      'Content-Type': 'text/plain'
    });
    this.res.end(`HTTP ${statusCode}:\t${http.STATUS_CODES[status]}`);
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
      // TODO: client.post();
    } else client.error(res, 403);
  } else client.static();
};



class Server {
  constructor(config, application) {
    this.config = config;
    this.application = application;
    const { ports, host } = config;
    const { threadId } = app.worker;
    const port = ports[threadId - 1];
    server = http.createServer( handler(application) );
    this.server.listen(port, host);
  }
}

module.exports = Server;
