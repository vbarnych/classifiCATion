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
  'registration',
]);

const registr = async () => {

  let user = {
      login : document.getElementById("regLoginInput").value,
      password : document.getElementById("regPasswordInput").value,
      fullname : document.getElementById("regNameInput").value
  };

  console.dir(user);

  const id = await api.registration(user);
  console.dir(id);
  const output1 = document.getElementById('output1');
  output1.innerHTML = 'HTTP POST /api/registration<br>' + JSON.stringify(id);
}

registr();
