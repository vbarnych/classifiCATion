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
      resolve(res.json());
      });
    });
  }
  return api;
};

const api = loadMethods([
  'signIn',
  'getFullname',
]);

const login = async () => {

  let user = {
                login : document.getElementById("logLoginInput").value,
                password : document.getElementById("logPasswordInput").value
            };

  console.dir(user);
  const id = await api.signIn(user);
  console.dir(id);
  const output1 = document.getElementById('output1');
  output1.innerHTML = 'HTTP POST /api/signIn<br>' + JSON.stringify(id);

  const data = await api.getFullname();
  const output2 = document.getElementById('output2');
  output2.innerHTML = 'HTTP POST /api/fetFullname<br>' + JSON.stringify(data);
}

login();
