'use strict';

const tests = ['config', 'db', 'crypto'];

for (const test of tests) {
  console.log(`Test unit: ${test}`);
  require(`..\\tests\\unit.${test}.js`);
}
