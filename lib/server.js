'use strict';

const { http, path, worker, url } = require('./libs.js');


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

  httpError(statusCode) {
    if (this.res.writableEnded) return;
    this.res.writeHead(statusCode, {
      'Content-Type': 'text/plain'
    });
    this.res.end(`HTTP ${statusCode}:\t${http.STATUS_CODES[statusCode]}`);
  }

  sendStatic() {
    const fileName = this.req.url === '/' ? '/index.html' : this.req.url;
    console.log(fileName);
    let fileExt = path.extname(fileName).substring(1);
    console.dir(fileExt);

    let ques = fileName.length;
    if (fileExt[4] === '?') {
      const args = url.parse(this.req.url, true).query;
      console.dir(args);
      ques = fileName.indexOf('?');
      fileExt = fileExt.substring(0,4)
    }
    const mimeType = MIME_TYPES[fileExt];
    this.res.writeHead(200, {
       'Content-Type': mimeType
    });
    const lastSlash = fileName.lastIndexOf('/');
    let key = fileName
                .substring(lastSlash)
                .substring(0, ques);
    console.log(key);
    const data = this.app.cache.get(key);
    if (data) {
      this.res.end(data);
    }
    else this.httpError(404);
  }


  async api() {
    const { req, res } = this;
    const { url } = req;
    const methodName = url.substring(METHOD_OFFSET);

    const session = await this.app.sessions.restore(req);
    console.dir(session);
    if (!session && methodName !== 'signIn') {
      console.log(`Forbidden ${url}`);
      this.httpError(403);
      return;
    }

    const args = await parseRequest(req);
    const sandbox = session ? session.sandbox : undefined;
    const context = session ? session.context : {};
    const token = session ? session.token : undefined;
    console.log('token start '+token+' token finish');

    try {
      const execMethod = this.app.runScript(methodName, sandbox);

      if (methodName.substring(1) === 'saveGrade') {
        const userId = await this.app.sessions.getUserId(token);
        console.log(userId);
        args.userId = userId.userid;
      }
      console.dir(args)
      const result1 = await execMethod({});
      const result = await result1(args);

      if (methodName.substring(1) === 'signIn') {
        const session = this.app.sessions.start(req, result.userId);
        res.setHeader('Set-Cookie', session.cookie);
      }
      else if (methodName.substring(1) === 'getCatIds' && session) {
        session.data = result.catIds;
      }

      console.dir(result);
      res.end(JSON.stringify(result));
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
    } else client.httpError(res, 403);
  } else client.sendStatic();
};


class Server {
  constructor(config, application) {
    this.config = config;
    this.application = application;
    const { ports, host } = config;
    const { threadId } = worker;
    const port = ports[threadId - 1];
    const handler = listener(application);
    this.server = http.createServer( {application}, handler );
    this.server.listen(port, host);
  }
}

module.exports = Server;
