'use strict';

const BASE = '/api/';
const AWS = 'https://catsstorage.s3.eu-central-1.amazonaws.com/'
const catId = Number((window.location.search).substring(7));
console.log(catId);
const src = AWS + `${catId}.jpg`;
let currentGrade = null;

const GRADES = {
  '-1': 'Dislike',
  0: 'Neutral',
  1: 'Like'
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
  'saveGrade',
  'getCatInfo',
  'checkPreviousGrade'
]);


let color = "RED";
let eyeColor = "GREEN";
let fluffy = "SHORT";
let tail = "SHORT";
let typeColor = "ONE COLOR";


const scenario = async () => {

  //const id = await api.saveGrade({catId: 3, grade: 1});
  //console.log(id);

  const catInfo = await api.getCatInfo(catId);
  console.log(catInfo);

}

//getPhoto();
scenario();



document.getElementById("content").children[0].children[1].innerHTML = `<p style='margin-left: 15px;'>${color}</p>`
document.getElementById("content").children[1].children[1].innerHTML = `<p style='margin-left: 15px;'>${eyeColor}</p>`
document.getElementById("content").children[2].children[1].innerHTML = `<p style='margin-left: 15px;'>${fluffy}</p>`
document.getElementById("content").children[3].children[1].innerHTML = `<p style='margin-left: 15px;'>${tail}</p>`
document.getElementById("content").children[4].children[1].innerHTML = `<p style='margin-left: 15px;'>${typeColor}</p>`

document.getElementById("content").children[5].innerHTML = `<div><img src=${src} height="200px"></div>`


const getCurrentMark = async () => {

  currentGrade = await api.checkPreviousGrade({catId: catId})
  console.dir(currentGrade);
  console.log(GRADES[currentGrade.grade[0].grade]);

  let currentMarkDiv = document.getElementById("currentMark");
  currentMarkDiv.innerHTML =  `<p style='margin-left: 15px;'>${GRADES[currentGrade.grade[0].grade]}</p>`

}

getCurrentMark();


   /*function getMark(e){



       let radioForm = document.getElementById("formA");
       const buttonsNumber = 4

       for (let i = 0; i < buttonsNumber; i++){
           if (radioForm.children[i].children[0].checked){
               console.log(i)
           }

       }*/



       //console.log(radioForm);