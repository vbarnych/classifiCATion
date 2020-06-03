'use strict';

const api = {};
const libs = [
  'worker_threads', 'os', 'v8', 'vm', 'path', 'url',
  'querystring', 'timers', 'events', 'stream', 'fs',
  'crypto', 'dns', 'net', 'http', 'https',
];

for (const lib of libs) api[lib] = Object.freeze(require(lib));
api.worker = api['worker_threads'];
api.fsp = api.fs.promises;

module.exports = Object.freeze(api);
