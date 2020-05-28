'use strict';

const http = require('http');
const assert = require('assert').strict;
const { Worker } = require('worker_threads');

const worker = new Worker('../workerThread.js');

const HOST = '127.0.0.1';
const PORT = 8000;
const START_TIMEOUT = 1000;
const TASKS_TIMEOUT = 3000;

const MAIN = { get: '/', status: 302 }
const SIGNIN = {
  post: '/api/signIn',
  data: { login: 'fresco', password: 'fresco' }
}
const REGISTR = {
  post: '/api/registration',
  data: { login: 'login', password: 'password' }
}

console.log('System test started');
setTimeout(async () => {
  worker.postMessage({ name: 'stop' });
}, TEST_TIMEOUT);

worker.on('exit', () => {
  console.log('System test finished');
});


const tasks = [
  MAIN,
  SIGNIN,
  REGISTR
];



const getRequest = task => {
  const request = {
    host: HOST,
    port: PORT,
    agent: false
  };
  if (task.get) {
    request.method = 'GET';
    request.path = task.get;
  } else if (task.post) {
    request.method = 'POST';
    request.path = task.post;
  }
  if (task.data) {
    task.data = JSON.stringify(task.data);
    request.headers = {
      'Content-Type': 'application/json',
      'Content-Length': task.data.length
    };
  }
  return request;
};

setTimeout(() => {
  tasks.forEach(task => {
    const name = task.get || task.post;
    console.log('HTTP request ' + name);
    const request = getRequest(task);
    const req = http.request(request);
    req.on('response', res => {
      const expectedStatus = task.status || 200;
      assert.equal(res.statusCode, expectedStatus);
    });
    req.on('error', err => {
      console.log(err.stack);
      process.exit(1);
    });
    if (task.data) req.write(task.data);
    req.end();
  });
}, TASKS_TIMEOUT);
