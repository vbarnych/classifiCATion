'use strict';

const http = require('http');
// const Client = ...
// const Session = ...

const routing = {
  '/': async () => '<h1>some information about service</h1><hr>',
  '/login': async client => {
    Session.start(client);
    return `Session token is: ${client.token}`;
  },
  '/logout': async client => {
    const result = `Session destroyed: ${client.token}`;
    Session.delete(client);
    return result;
  },
  '/registration': async client => {
    // ...
  },
  '/api/home': async client => {
    // ...
  },
  '/api/mycats': async client => {
    // ...
  },
};

const types = {
  object: JSON.stringify,
  string: s => s,
  number: n => n.toString(),
};

http.createServer(async (req, res) => {
  const client = await Client.getInstance(req, res);
  const { url } = req;
  const handler = routing[url];
  if (!handler) {
    res.statusCode = 404;
    res.end('Not found 404');
    return;
  }
  handler(client).then(data => {
    const type = typeof data;
    const serializer = types[type];
    const result = serializer(data);
    client.sendCookie();
    res.end(result);
  }, err => {
    res.statusCode = 500;
    res.end('Internal Server Error 500');
    console.log(err);
  });

  res.on('finish', () => {
    if (client.session) client.session.save();
  });

}).listen(8000);
