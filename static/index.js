'use strict';

const BASE = '/api/';
const BLOCKS_NUM = 10;
const AWS = 'https://catsstorage.s3.eu-central-1.amazonaws.com/'
let catsIds = [];

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
  'getCatIds'
]);

const recommendCats = async () => {
  let cats = [];
  for (let i = 0; i < 10; ++i)
    cats[i] = getRandom(MIN, MAX);
};

const getCatsIds = async () => {
  const data = await api.getCatIds();
  console.log(data.catsIds);
  return data.catsIds;
}

const scenario = async () => {
  let catId = 7;
  const id = await api.getCatInfo(catId);
  console.log(id);
  catsIds = await getCatsIds();
  setTimeout(() => {
    callback();
  }, 10)
}

const callback = () => {
  for (let i = 0; i <= 10; i++) {
    const link = AWS + `${catsIds[i]}.jpg`;
    document.getElementById(`catDiv${i+1}`).children[0].href = `catpage.html?catId=${catsIds[i]}`;
    document.getElementById("catDiv" + (i+1))
        .lastChild
        .lastChild
        .src = link
  }
}

scenario();
