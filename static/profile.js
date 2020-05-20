'use strict';

const BASE = '/api/';
const MIN = 1;
const MAX = 60;

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
  'getCatInfo',
]);

const recommendCats = async () => {
  let cats = new Array(10);
  for (let i = 0; i < 10; ++i)
    cats[i] = getRandom(MIN, MAX);
};

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getCat = async () => {
  let catId = 3;
  const id = await api.getCatInfo(catId);
  console.dir(id);
}

getCat();
