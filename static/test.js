const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
};

let arr = new Array(50);
for (let i = 0; i<50; i++)
{
  arr[i] = getRandom(0,10);
}
console.dir(arr);
