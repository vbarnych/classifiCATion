'use strict';

const BASE = '/api/';

const loadMethods = methods => {
  const api = {};
  for (const method of methods)
  {
  api[method] = (args = {}) =>  new Promise((resolve, reject) => {
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
      if (status !== 200) {
        reject(new Error(`Status Code: ${status}`));
        return;
      }
      resolve(console.log(res.json()));
      });
    });
  }
  return api;
};



const api = loadMethods([
  'registration',
  'signIn',
  'getFullname',
]);

const getProgram = async () => {
  const id = await api.signIn({ login: 'jacquefresco', password: 'thevenusproject' });
  const data = await api.getFullname();
  const output = document.getElementById('output');
  output.innerHTML = 'HTTP POST /api/signIn<br>' + JSON.stringify(id);
};

getProgram();
