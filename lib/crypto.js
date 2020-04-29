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
