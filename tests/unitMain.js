'use strict';

const tests = ['config', 'database', 'crypto'];

for (const test of tests) {
  console.log(`Test unit: ${test}`);
  require(`./unit.${test}.js`);
}
