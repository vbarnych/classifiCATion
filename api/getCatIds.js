'use strict';

const isInArray = (key, arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === key) {
        return true;
      }
    }
  return false;
};

const tenCats = () => {
  const cats = new Array(10);
  let cat = 0;
  for (let i = 0; i < 10; i++) {
    do {
          cat = getRandom(1, 60);
        }
        while (isInArray(cat, cats));
          cats[i] = cat;
    }
    return cats;
};

module.exports = async (name, angle) => {
  const cats = tenCats();
  return cats;
};
