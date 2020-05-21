'use strict';

const BASE = '/api/';
const BLOCKS_NUM = 10;

let catIds = new Array(10);

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

(function () {
const PICS_PATH = 'C:\\GitLab\\classifiCATion\\static\\cats\\';
  const isInArray = (key, arr) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === key) {
          return true;
        }
      }
    return false;
  }
  console.log(2)

  const tenCats = () => {
    let rv = 0;
    for (let i = 0; i < 10; i++){
      do {
            rv = getRandom(1, 60);
          }
          while (isInArray(rv, catIds));
            catIds[i] = rv;
      }
      return catIds;
  }

    console.log(3)
    catIds = tenCats();
    console.log(catIds)
    for (let i = 0; i < BLOCKS_NUM; i++) {
      console.log('We are in this shit')
      document.getElementById('catDiv' + 1).lastChild.lastChild.src =
      'C:\\GitLab\\classifiCATion\\static\\cats\\10.jpg';
    }

}());

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

const getCat = async () => {
  let catId = 3;
  const id = await api.getCatInfo(catId);
  console.dir(id);
}

getCat();
