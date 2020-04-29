'use strict';

const crypto = require('crypto');

const BYTES_SIZE = 32;
const KEY_LEN = 64;

const serializeHash = (derivedKey, buffer, params) => {
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`).join(',');
  const bufferString = buffer.toString('base64').split('=')[0];
  const derivedKeyString = derivedKey.toString('base64').split('=')[0];
  return `$scrypt$${paramString}$${bufferString}$${hashString}`;
};

const hashPassword = password => new Promise((resolve, reject) => {
  crypto.randomBytes(BYTES_SIZE, (err, buffer) => {
    if (err) {
      reject(err);
      return;
    }
    crypto.scrypt(password, buffer, KEY_LEN, { N: 1024 },
      (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(serializeHash(derivedKey, buffer, { N: 1024 }));
      });
  });
});
