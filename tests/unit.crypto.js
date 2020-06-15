'use strict';

const assert = require('assert').strict;

const crypto = require('../lib/crypto.js');

assert(crypto);

const truePassword = 'correctPass';
const falsePassword = 'incorrectPassword';

crypto.hashPassword(truePassword).then(hash => {
  assert(hash);
  assert.equal(typeof hash, 'string');
  return Promise.all([
    crypto.validatePassword(truePassword, hash),
    crypto.validatePassword(falsePassword, hash),
  ]);
}).then(result => {
  assert.deepEqual(result, [true, false]);
}).catch(err => {
  console.log(err.stack);
  process.exit(1);
});
