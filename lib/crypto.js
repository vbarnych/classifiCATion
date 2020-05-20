'use strict';

const crypto = require('crypto');

const BYTES_SIZE = 32;
const KEY_LEN = 64;
const SCRYPT_PARAMS = {
  N: 32768,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};
const SALT_LEN = 32;

const serializeHash = (derivedKey, buffer, params) => {
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`).join(',');
  const bufferString = buffer.toString('base64').split('=')[0];
  const derivedKeyString = derivedKey.toString('base64').split('=')[0];
  return `$scrypt$${paramString}$${bufferString}$${derivedKeyString}`;
};

const hashPassword = password => new Promise((resolve, reject) => {
  crypto.randomBytes(SALT_LEN, (err, salt) => {
    if (err) {
      reject(err);
      return;
    }
    crypto.scrypt(password, salt, KEY_LEN, SCRYPT_PARAMS, (err, hash) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(serializeHash(hash, salt, SCRYPT_PARAMS));
    });
  });
});

const deserializeHash = phcString => {
  const parsed = phcString.split('$');
  parsed.shift();
  if (parsed[0] !== 'scrypt') {
    throw new Error('Node.js crypto module only supports scrypt');
  }
  const params = Object.fromEntries(
    parsed[1].split(',').map(p => {
      const kv = p.split('=');
      kv[1] = Number(kv[1]);
      return kv;
    })
  );
  const salt = Buffer.from(parsed[2], 'base64');
  const hash = Buffer.from(parsed[3], 'base64');
  return { params, salt, hash };
};


let defaultHash;
hashPassword('').then(hash => {
  defaultHash = hash;
});

const checkPassword = (password, hash = defaultHash) =>
  new Promise((resolve, reject) => {
    const parsedHash = deserializeHash(hash);
    const len = parsedHash.hash.length;
    crypto.scrypt(password, parsedHash.salt, len, parsedHash.params,
      (err, hashedPassword) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(crypto.timingSafeEqual(hashedPassword, parsedHash.hash));
      }
    );
  });

module.exports = Object.freeze({ hashPassword, checkPassword });
