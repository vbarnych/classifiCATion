'use strict';

const BASE = '/api/';

const loadMethods = methods => {
  const api = {};
  for (const method of methods)
  {
  api[method] = (args = {}) =>
  new Promise((resolve, reject) => {
    const url = BASE + method;
    console.log(url, args);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args),
    }).then(res => {
      const { status } = res;
      resolve(res.json());
      });
    });
  }
  return api;
};
