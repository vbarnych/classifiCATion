'use strict';

const BASE = '/api/';
const MIN = 1;
const MAX = 60;

const GRADES = {
  '-1': 1,
  0: 2,
  1: 0
};

const STATISTICS = {
  0: 'Likes',
  1: 'Dislikes',
  2: 'Neutral'
};

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
  'checkPreviousGrade'
]);


const getCurrentGrades = async () => {

  const userGrades = await api.checkPreviousGrade()
  console.dir(userGrades);
  let grades = document.getElementById("grades");

  const statistics = new Array(0,0,0); // likes, dislikes, neutral
  for (let i = 0; i < userGrades.data.length; ++i)
  {
    const index = GRADES[userGrades.data[i].grade];
    statistics[index]++;
  }

  for (let i = 0; i < statistics.length; ++i)
  {
    const grade = document.createElement('grade');
    grade.innerHTML = STATISTICS[i] + ': ' + statistics[i].toString();
    const br = document.createElement('br');
    grades.appendChild(grade);
    grades.appendChild(br);
  }
}

getCurrentGrades();

//getCat();
