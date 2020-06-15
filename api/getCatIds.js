async () => {

  const getRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

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
            cat = getRandom(1, 200);
          }
          while (isInArray(cat, cats));
            cats[i] = cat;
      }
      return cats;
  };

  const cats = tenCats();
  return { catsIds: cats };
};
